from flask import Blueprint, jsonify, request, session, current_app
from app import db
from app.models import User, StravaActivity
from .services.strava_service import StravaService
from datetime import datetime
from sqlalchemy import func

api_bp = Blueprint('api', __name__)

####################################################################################  
# First step to handling the OAuth Flow. We must handle the exchange token that we receive
@api_bp.route('/handle-strava-exchange-code', methods=['POST']) 
def handle_strava_exchange_code():
    try: 
        code = request.json.get('code')

        if not code:
                return jsonify({'error': 'Authorization code is required'}), 400
        
        strava_service = StravaService()
        token_info = strava_service.exchange_code_for_access_token(code)

        user = add_user_to_db(token_info['refresh_token'], datetime.fromtimestamp(token_info['expires_at']), token_info['access_token'], token_info['athlete'])

        if user:
            return jsonify({
                'success': True,
                'message': 'Strava account connected successfully and added to local database',
                'athlete_id': token_info['athlete']['id'],
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': "User wasn't added successfully"
            })
        
    except Exception as e:
        # Log the error and return error response
        print(f"Error in handle_strava_exchange_code: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to exchange Strava authorization code',
            'details': str(e)
        }), 500
    
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
# Database connection test
@api_bp.route('/test-db')
def test_db():
    """Test database connection"""
    try:
        # Simple query to test connection
        result = db.session.execute(db.text('SELECT 1'))
        return jsonify({
            "database": "connected",
            "message": "Database connection successful"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Database connection failed"
        }), 500

####################################################################################


@api_bp.route('/create-session', methods=['GET'])
def create_session():
    print(f"SECRET_KEY configured: {current_app.config.get('SECRET_KEY')}")
    print(f"Before setting session: {dict(session)}")
    #data = request.json

    #if not data or 'athlete_id' not in data:
    #    return jsonify({'error': 'athlete_id is required'}), 400
    
    #session['athlete_id'] = data['athlete_id']
    session['athlete_id'] = 1000
    session.permanent = True
    
    print(f"After setting session: {dict(session)}")
    
    return jsonify({'message': 'Session test complete'})

@api_bp.route('/test-session-check', methods=['GET'])
def test_session_check():
    print(f"Received cookies: {dict(request.cookies)}")
    print(f"Session data: {dict(session)}")
    
    test_value = session.get('athlete_id')
    if test_value:
        return jsonify({
            'message': 'Session cookie working!',
            'session_data': dict(session),
            'test_value': test_value
        })
    else:
        return jsonify({
            'message': 'No session data found',
            'session_data': dict(session)
        }), 400