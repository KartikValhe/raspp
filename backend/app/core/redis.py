import json
import logging
from datetime import date, datetime
from typing import Any, Optional
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
        self._init_connection()

    def _init_connection(self):
        if not settings.REDIS_ENABLED:
            logger.info("Redis caching is disabled in configuration.")
            return

        try:
            self._client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD,
                db=settings.REDIS_DB,
                decode_responses=True,
                socket_connect_timeout=2.0,
                socket_timeout=2.0,
            )
            # Test connection
            self._client.ping()
            self._is_connected = True
            logger.info("Connected to Redis successfully.")
        except Exception as e:
            self._is_connected = False
            logger.warning("Could not connect to Redis: %s. Continuing with database fallback.", e)

    @property
    def client(self) -> Optional[redis.Redis]:
        if not self._is_connected:
            # Attempt reconnect lazily
            self._init_connection()
        return self._client if self._is_connected else None

    def get(self, key: str) -> Optional[Any]:
        """Fetch and deserialize JSON value from Redis."""
        try:
            cli = self.client
            if not cli:
                return None
            data = cli.get(key)
            if data is not None:
                return json.loads(data)
        except Exception as e:
            logger.warning("Redis GET error for key %s: %s", key, e)
        return None

    def set(self, key: str, value: Any, ttl: int = 300) -> bool:
        """Serialize and store value in Redis with time-to-live in seconds."""
        try:
            cli = self.client
            if not cli:
                return False
            payload = json.dumps(value, cls=CustomJSONEncoder)
            cli.setex(key, ttl, payload)
            return True
        except Exception as e:
            logger.warning("Redis SET error for key %s: %s", key, e)
            return False

    def delete(self, key: str) -> bool:
        """Delete specific key from Redis."""
        try:
            cli = self.client
            if not cli:
                return False
            cli.delete(key)
            return True
        except Exception as e:
            logger.warning("Redis DELETE error for key %s: %s", key, e)
            return False

    def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching a glob pattern (e.g. 'analytics:*')."""
        try:
            cli = self.client
            if not cli:
                return 0
            keys = list(cli.scan_iter(match=pattern))
            if keys:
                return cli.delete(*keys)
        except Exception as e:
            logger.warning("Redis DELETE_PATTERN error for pattern %s: %s", pattern, e)
        return 0

    def is_healthy(self) -> bool:
        """Healthcheck for Redis service."""
        try:
            cli = self.client
            return bool(cli and cli.ping())
        except Exception:
            return False

# Global singleton instance
redis_cache = RedisClient()
