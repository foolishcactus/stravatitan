from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from sqlalchemy import text

from app import db
from typing import Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import os


from .services import db_service as DBService
from .services import strava_service as StravaService
from .models import User, StravaActivity

api_bp = Blueprint('api', __name__)

@dataclass
class titan_api_res:
    message: str
    success: bool
    data: Optional[dict[str, Any]] = None

####################################################################################
#AUTH ENDPOINTS
#  
# First step to handling the OAuth Flow. We must handle the exchange token that we receive
####################################################################################
@api_bp.route('/handle-strava-exchange-code', methods=['POST']) 
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def handle_strava_exchange_code():
    try: 
        code = request.json.get('code')

        if not code:
                response = titan_api_res(
                    message = 'Exchange Code Required',
                    success = False,
                )
                return jsonify(asdict(response)), 400
        
        token_info = StravaService.exchange_code_for_access_token(code)

        user = DBService.add_user_to_db(token_info['refresh_token'], datetime.fromtimestamp(token_info['expires_at']), token_info['access_token'], token_info['athlete'])

        if user:
            session['athlete_id'] = token_info['athlete']['id']
            session.permanent = True
            session.modified = True

            print(f"We are trying to create the session. Here is the session {session}")
            
            response = titan_api_res(
                message='Strava account connected successfully and added to local database',
                success=True,
                data={
                    'athlete_id': token_info['athlete']['id']
                }
            )
        else:
            response = titan_api_res(
                success=False,
                message="User wasn't added successfully"
            )
        
        return jsonify(asdict(response)), 200 if response.success else 500
        
    except Exception as e:
        print(f"Error in handle_strava_exchange_code: {str(e)}")

        response = titan_api_res(
            message='Failed to exchange Strava authorization code',
            success=False,
            data={
                'error': str(e)
            }
        )
        return jsonify(asdict(response)), 500

####################################################################################
@api_bp.route('/auth/status', methods=['GET'])
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def auth_status():
    #print(f"=========================================")
    #print(f"Received cookies: {dict(request.cookies)}")
    #print(f"Session data: {dict(session)}")
    
    athlete_strava_id = session.get('athlete_id')

    if athlete_strava_id:
        tokenInfo = DBService.is_access_token_expired(athlete_strava_id)
        refreshToken: str = tokenInfo[0]
        isAccessTokenExpired: bool = tokenInfo[1]
        

        #If the access token is expired, but the Flask session is still active we automatically refresh it for the user here
        if isAccessTokenExpired:
            #Returns the following tuple [access_token: str, expires_at: datetime, refresh_token:str]
            new_tokens = StravaService.refresh_access_token(refreshToken)

            print(f"These are the new tokens: {new_tokens}")
            if new_tokens is None:
                response = titan_api_res(
                    message="Error with the Strava API when trying to refresh tokens",
                    success=False,
                )
            
            response_from_db = DBService.update_user_tokens(new_tokens[0], new_tokens[1], new_tokens[2])
            print(f"This is the response from the DB: {response_from_db}")
            if response_from_db is None:
                response = titan_api_res(
                    message="We got the tokens, but couldn't add to database",
                    success= False
                )   
            else:
                response = titan_api_res(
                    message="We successfully refreshed tokens and Flask Session exists",
                    success = True
                )   
        else:
            response = titan_api_res(
                message = "Cookie for user exists and tokens are still fresh",
                success = True,
                data = {
                'athlete_strava_id': athlete_strava_id
                }
            )
    else:
        response = titan_api_res(
            message = "Cookie for user doesn't exist. Needs to re authenticate.",
            success = False,
        )
    
    return jsonify(asdict(response)), 200 if response.success else 400

####################################################################################
@api_bp.route('/auth/logout')
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def logout():
    try:

        session.clear()
        response = titan_api_res(
            message= "Successfully logged out",
            success = True,
        )
    except Exception as e:
        response = titan_api_res(
            message = "Couldn't log out"
        )
    return jsonify(asdict(response)), 200 if response.success else 400
####################################################################################
#DB RELATED ENDPOINTS
####################################################################################  
@api_bp.route('/db/health', methods =['GET'] )
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def db_health():
    try:
        # Simple query to test connection
        db.session.execute(text('SELECT 1'))
        return {'status': 'healthy', 'database': 'connected'}, 200
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 500
    
@api_bp.route('/db/all-users', methods =['GET'] )
def all_users():
    print("We are getting called")
    users = DBService.getAllUsers()
    return jsonify([user.to_dict() for user in users])

####################################################################################
@api_bp.route('/db/get-runs', methods = ['GET'])
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def get_runs_from_db():
    try:
        athlete_strava_id = session.get('athlete_id')
        runs = DBService.getAllRunsFromDB(athlete_strava_id)
        runs_json = [run.to_dict() for run in runs]
        response = titan_api_res(
            message="Got all runs",
            success=True,
            data = runs_json,
        )

    except Exception as e:
        response = titan_api_res(
            message = "Couldn't log out"
        )

    return jsonify(asdict(response)), 200 if response.success else 400

####################################################################################
# Calls the Strava API and gets all runs and adds it to the local SQL database
####################################################################################
@api_bp.route('/get-runs', methods = ['GET'])
@cross_origin(origins=[os.getenv('FRONTEND_URL')], supports_credentials=True)
def get_all_runs():

    try:
        athlete_strava_id = session.get('athlete_id')
        access_token  = DBService.get_access_token(athlete_strava_id)
        all_strava_activities: list[dict] = StravaService.fetch_all_user_activities_from_strava(access_token)
        strava_activity_objects: list[StravaActivity] = DBService.add_runs_to_database(all_strava_activities)

        return jsonify({
            "raw_activities": all_strava_activities,
            "saved_activities": [activity.to_dict() for activity in strava_activity_objects]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

####################################################################################   
@api_bp.route('/webhooks/strava', methods = ['GET', 'POST'])
@cross_origin(supports_credentials= True)
def handle_webhook():
    local_verify_token = os.getenv('VERIFICATION_TOKEN')
    try:
        if request.method == 'GET':
            mode = request.args.get('hub.mode')
            verify_token = request.args.get('hub.verify_token')
            challenge = request.args.get('hub.challenge')

            if (mode == 'subscribe') and (verify_token == local_verify_token):
                print(f"Webhook verified")
                return jsonify({"hub.challenge": challenge}), 200
            else:
                return jsonify({"message" : "Verify Tokens do not match"}), 403   
        elif request.method == 'POST':
            event_data = request.json
            print(f"Received webhook {event_data}")
            return jsonify({"message" : "we received data"})
    except Exception as e:
        return jsonify({"message": "Ran into an error"}), 500         