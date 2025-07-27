import requests
import os
from dotenv import load_dotenv

load_dotenv()
CLIENT_ID = os.getenv('STRAVA_CLIENT_ID')
CLIENT_SECRET = os.getenv('STRAVA_CLIENT_SECRET')
WEBHOOK_CALLBACK_URL = os.getenv('WEBHOOK_CALLBACK_URL')
VERIFY_TOKEN = os.getenv('VERIFICATION_TOKEN')

def subscribe_to_strava_webhook():
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'callback_url': WEBHOOK_CALLBACK_URL,
        'verify_token': VERIFY_TOKEN,
    }

    response = requests.post(url, data=token_data)

    if response.status_code == 201:
        print(f"We successfully subscirbed to the Webhook within setup_webhook.py")
    else:
        print(f"We failed to subscribe to the webhook in setup_webhook.py")

if __name__ == "__main__":
    subscribe_to_strava_webhook()