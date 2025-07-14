from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin

from app import db
from typing import Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import os

from app.models import User
from .services.strava_service import StravaService



api_bp = Blueprint('api', __name__)

@dataclass
class titan_api_res:
    message: str
    success: bool
    data: Optional[dict[str, Any]] = None

####################################################################################  
# First step to handling the OAuth Flow. We must handle the exchange token that we receive
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
        
        strava_service = StravaService()
        token_info = strava_service.exchange_code_for_access_token(code)

        user = add_user_to_db(token_info['refresh_token'], datetime.fromtimestamp(token_info['expires_at']), token_info['access_token'], token_info['athlete'])

        if user:
            session['athlete_id'] = token_info['athlete']['id']
            session.permanent = True
            session.modified = True

            #print(f"We are trying to create the session. Here is the session {session}")
            
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
    
def add_user_to_db(refresh_token: str, expires_at: datetime, access_token: str, athlete_data) -> bool:
    try:
        
        strava_id = athlete_data['id']

        existing_user = User.query.filter_by(strava_id=strava_id).first()

        if existing_user:
            print(f"We have an existing user")
            existing_user.access_token = access_token
            existing_user.refresh_token = refresh_token
            existing_user.fist_name = athlete_data['firstname']
            existing_user.last_name = athlete_data['lastname']
            existing_user.username = athlete_data['username']
            existing_user.profile_picture = athlete_data['profile']

            db.session.commit()

            return existing_user
        else:
            user = User(
            username = athlete_data['username'],
            first_name = athlete_data['firstname'],
            last_name = athlete_data['lastname'],
            strava_id = athlete_data['id'],
            access_token = access_token,
            refresh_token = refresh_token,
            token_expires_at = expires_at,
            profile_picture = athlete_data['profile']
            )

            db.session.add(user)
            db.session.commit()
            return user

    except Exception as e:
        db.session.rollback()
        print(f"Error adding user: {e}")
        return None

####################################################################################  
@api_bp.route('/get-all-users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])
####################################################################################

@api_bp.route('/auth/status', methods=['GET'])
def auth_status():
    #print(f"=========================================")
    #print(f"Received cookies: {dict(request.cookies)}")
    #print(f"Session data: {dict(session)}")
    
    athlete_strava_id = session.get('athlete_id')

    if athlete_strava_id:
        response = titan_api_res(
            message = "Cookie for user exists",
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