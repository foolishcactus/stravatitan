#This is class is respoinsible for:
#1. Making API Calls to Strava
#2. Taking the data from Strava and saving it to our datbase
####################################################################################  
import requests
from datetime import datetime
from app.models import StravaActivity, User
from app import db
from flask import session

class StravaService:

    def __init__(self, access_token = None):
        #Don't know if we should make the client secret, and client id, environment variables???
        #self.client_id = os.getenv('STRAVA_CLIENT_ID')
        #self.client_secret = os.getenv('STRAVA_CLIENT_SECRET')

        self.client_id = "122292"
        self.client_secret = "03545051c823732cb8168a43d4ab8ae57b59e1f8"
        self.base_url = "https://www.strava.com/api/v3" 
        self.access_token = access_token

        if access_token:
            self.headers = {"Authorization": f"Bearer {access_token}"}

####################################################################################
    def exchange_code_for_access_token(self, code):
        token_url = 'https://www.strava.com/oauth/token'

        token_data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'grant_type': 'authorization_code'
        }

        response = requests.post(token_url, data = token_data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Exchange Code for Access Token Failed: {response.status_code}")
        
    def print_session_id(self):
        print(f"This is the value of the session id: {session["user_strava_id"]}")  
####################################################################################  
    def fetch_user_from_strava(self):

        print("We are trying to fetch the user info")

        url = f"{self.base_url}/athlete"
        response = requests.get(url, headers = self.headers)

        if response.status_code == 200:
            strava_user_data = response.json()
            return strava_user_data
        else:
            raise Exception(f"Fetch User from Strava Failed: {response.status_code}")
        
####################################################################################    
    def add_user_to_local_db(self, strava_user_data):
        
        try:
            #Checking if the user already exists within the database
            existing_user = User.query.filter_by(strava_id=strava_user_data.get('id')).first()
            if existing_user:
                return existing_user
        
            user = User(
                #Using get method is safe as it returns None if missing instead of just accessing using brackets
                username = strava_user_data.get('username'),
                strava_id = strava_user_data.get('id'),
            )

            db.session.add(user)
            db.session.commit()

            return user
        except Exception as e:
            #Undoes any datbase changes made in the current transaction
            db.session.rollback()
            raise e
####################################################################################
    def fetch_user_activities_from_strava_page(self, page:int):
        parameters = {
            "page" : page
        }

        url = f"{self.base_url}/athlete/activities"
        response = requests.get(url, headers = self.headers, params = parameters)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error response: {response.text}")
            raise Exception(f"Fetch User Activities from Strava Page Failed: {response.status_code}")
          
    def fetch_user_activities_from_strava(self):
        all_activities = []
        page_iterator = 1
        per_page = 30

        while True:

            activities = self.fetch_user_activities_from_strava_page(page_iterator)

            if len(activities) == 0:
                break

            all_activities.extend(activities)

            #Stop if partial page
            if len(activities) < per_page:
                break

            page_iterator += 1
        
        return all_activities
####################################################################################            


            

           

            

    

         

        

        