# This module is responsible for:
# Making API Calls to Strava
####################################################################################  
import requests
import os
from datetime import datetime
from flask_cors import cross_origin
from app.models import User
from flask import session

# Constants
CLIENT_ID = os.getenv('STRAVA_CLIENT_ID')
CLIENT_SECRET = os.getenv('STRAVA_CLIENT_SECRET')
BASE_URL = "https://www.strava.com/api/v3"

####################################################################################
def exchange_code_for_access_token(code):
    """Exchange authorization code for access token"""
    token_url = 'https://www.strava.com/oauth/token'

    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code'
    }

    response = requests.post(token_url, data=token_data)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Exchange Code for Access Token Failed: {response.status_code}")
    
####################################################################################
def refresh_access_token(refresh_token:str) -> tuple[str, datetime, str] | None:
    """Refresh expired access token"""
    token_url = 'https://www.strava.com/oauth/token'
    
    token_data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    }
    
    response = requests.post(token_url, data=token_data)
    
    
    if response.status_code == 200:
        response_data = response.json()
        print(response.json())

        return (response_data['access_token'], datetime.fromtimestamp(response_data['expires_at']), response_data['refresh_token'])
    else:
        raise Exception(f"Token refresh failed: {response.status_code}")

def print_session_id():
    """Debug function to print session ID"""
    print(f"This is the value of the session id: {session.get('user_strava_id', 'Not found')}")

####################################################################################  
def fetch_user_from_strava(access_token):
    """Fetch user data from Strava API"""
    print("We are trying to fetch the user info")

    url = f"{BASE_URL}/athlete"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        strava_user_data = response.json()
        return strava_user_data
    else:
        raise Exception(f"Fetch User from Strava Failed: {response.status_code}")

####################################################################################
def fetch_user_activities_from_strava_page(access_token, page: int) -> list[dict]:
    """Fetch a single page of activities from Strava"""
    parameters = {
        "page": page
    }

    url = f"{BASE_URL}/athlete/activities"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers, params=parameters)

    if response.status_code == 200:
        print(f"We just got page {page} of the Strava Data")
        return response.json()
    else:
        print(f"Error response: {response.text}")
        raise Exception(f"Fetch User Activities from Strava Page Failed: {response.status_code}")
####################################################################################
def fetch_all_user_activities_from_strava(access_token) -> list[dict]:
    """Fetch all activities from Strava (paginated)"""
    print(f"We tried getting all the data from the API.")
    all_activities = []
    page_iterator = 1
    per_page = 30

    while True:
        activities = fetch_user_activities_from_strava_page(access_token, page_iterator)

        if len(activities) == 0:
            break

        all_activities.extend(activities)

        # Stop if partial page
        if len(activities) < per_page:
            break

        page_iterator += 1

        print(f"We finished getting all the data from the API.")
    
    return all_activities

####################################################################################