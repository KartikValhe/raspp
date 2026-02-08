import requests

def test_cors():
    url = "http://localhost:8000/api/v1/auth/login"
    origin = "http://localhost:5174"
    
    headers = {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }
    
    try:
        print(f"Sending OPTIONS request to {url} with Origin: {origin}")
        response = requests.options(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print("Headers:")
        for k, v in response.headers.items():
            if 'access-control' in k.lower():
                print(f"  {k}: {v}")
                
        if 'access-control-allow-origin' in response.headers:
            print("\nSUCCESS: Access-Control-Allow-Origin header is present.")
            if response.headers['access-control-allow-origin'] == origin:
                print("SUCCESS: Origin matches.")
            else:
                print(f"WARNING: Origin mismatch. Got: {response.headers['access-control-allow-origin']}")
        else:
            print("\nFAILURE: Access-Control-Allow-Origin header is MISSING.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_cors()
