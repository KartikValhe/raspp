import requests

def test_login():
    url = "http://localhost:8000/api/v1/auth/login"
    data = {
        "username": "admin@test.com",
        "password": "admin123"
    }
    
    try:
        print(f"Attempting login to {url}...")
        response = requests.post(url, data=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("LOGIN SUCCESS!")
        else:
            print("LOGIN FAILED!")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to backend. Is it running?")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_login()
