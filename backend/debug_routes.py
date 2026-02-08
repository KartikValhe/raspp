import requests
import json

def fetch_openapi():
    url = "http://localhost:8000/openapi.json"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            paths = data.get("paths", {})
            print("Registered Paths:")
            for path in paths:
                print(f" - {path}")
        else:
            print(f"Failed to fetch openapi.json: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fetch_openapi()
