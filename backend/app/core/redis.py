import copy
import fnmatch
import json
import logging
import time
from datetime import date, datetime
from typing import Any, Dict, Optional, Tuple
import redis
from app.core.config import settings

logger = logging.getLogger("redis_cache")

class CustomJSONEncoder(json.JSONEncoder):
    """Handles datetime and date objects during JSON serialization."""
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if hasattr(obj, "__dict__"):
            return obj.__dict__
        return super().default(obj)

class RedisClient:
    def __init__(self):
        self._client: Optional[redis.Redis] = None
        self._is_connected = False
        self._last_attempt = 0.0
        self._logged_warning = False
        # High-speed in-memory cache fallback: key -> (expiration_timestamp, deepcopied_value)
        self._memory_cache: Dict[str, Tuple[float, Any]] = {}
        self._init_connection()

    def _init_connection(self):
        if not settings.REDIS_ENABLED:
            return

        now = time.time()
        # Cooldown: retry at most once every 300 seconds if unreachable to avoid lag
        if now - self._last_attempt < 300:
            return
        self._last_attempt = now

        try:
            self._client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=0.3,
                socket_timeout=0.3,
            )
            self._client.ping()
            self._is_connected = True
            self._logged_warning = False
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            self._is_connected = False
            if not self._logged_warning:
                logger.info("Redis not reachable (%s). Using high-speed in-memory cache fallback.", e)
                self._logged_warning = True

    @property
    def client(self) -> Optional[redis.Redis]:
        return self._client if self._is_connected else None

    # --- In-Memory Helpers ---
    def _mem_get(self, key: str) -> Optional[Any]:
        if key in self._memory_cache:
            expires_at, val = self._memory_cache[key]
            if time.time() < expires_at:
                return copy.deepcopy(val)
            else:
                del self._memory_cache[key]
        return None

    def _mem_set(self, key: str, value: Any, ttl: int = 300) -> bool:
        # Prevent unbounded memory growth: periodically prune expired keys
        if len(self._memory_cache) > 2000:
            now = time.time()
            stale_keys = [k for k, (exp, _) in self._memory_cache.items() if now >= exp]
            for k in stale_keys:
                del self._memory_cache[k]
        self._memory_cache[key] = (time.time() + ttl, copy.deepcopy(value))
        return True

    def _mem_delete(self, key: str) -> bool:
        return self._memory_cache.pop(key, None) is not None

    def _mem_delete_pattern(self, pattern: str) -> int:
        count = 0
        keys_to_del = [k for k in list(self._memory_cache.keys()) if fnmatch.fnmatch(k, pattern)]
        for k in keys_to_del:
            self._memory_cache.pop(k, None)
            count += 1
        return count

    # --- Public Cache Interface ---
    def get(self, key: str) -> Optional[Any]:
        """Fetch and deserialize JSON value from Redis, or return from in-memory cache."""
        try:
            cli = self.client
            if cli:
                data = cli.get(key)
                if data is not None:
                    return json.loads(data)
        except Exception as e:
            logger.debug("Redis GET error for key %s: %s", key, e)
        # Fast fallback
        return self._mem_get(key)

    def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Serialize and store value in Redis with TTL, mirrored in memory for sub-millisecond retrieval."""
        try:
            cli = self.client
            if cli:
                payload = json.dumps(value, cls=CustomJSONEncoder)
                cli.setex(key, ttl, payload)
        except Exception as e:
            logger.debug("Redis SET error for key %s: %s", key, e)
        # Always store in memory cache for immediate instant reads
        self._mem_set(key, value, ttl)
        return True

    def delete(self, key: str) -> bool:
        """Delete specific key from Redis and in-memory cache."""
        try:
            cli = self.client
            if cli:
                cli.delete(key)
        except Exception as e:
            logger.debug("Redis DELETE error for key %s: %s", key, e)
        self._mem_delete(key)
        return True

    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching a glob pattern (e.g. 'analytics:*')."""
        deleted = 0
        try:
            cli = self.client
            if cli:
                keys = list(cli.scan_iter(match=pattern))
                if keys:
                    deleted = cli.delete(*keys)
        except Exception as e:
            logger.debug("Redis DELETE_PATTERN error for pattern %s: %s", pattern, e)
        deleted += self._mem_delete_pattern(pattern)
        return deleted

    def is_healthy(self) -> bool:
        """Healthcheck for cache service: always healthy via Redis or In-Memory."""
        return True

# Global singleton instance
redis_cache = RedisClient()

