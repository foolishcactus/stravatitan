# This module is responsible for:
# Making API Calls to Strava

from flask import session
from datetime import datetime
from app import db
from app.models import User

def add_user_to_db(refresh_token: str, expires_at: datetime, access_token: str, athlete_data) -> User | None:
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
    
def getAllUsers() -> list[User]:
    return User.query.all()

def is_access_token_expired() -> tuple[str, int]:
    id = session['athlete_id']

    user:User = User.query.filter_by(strava_id = id).first()

    return (user.refresh_token, user.is_token_expired())

def update_user_tokens(access_token: str, expires_at: datetime, refresh_token: str) -> User | None:
    try:
        id = session['athlete_id']
        if not id:
            return False
            
        user: User = User.query.filter_by(strava_id=id).first()
        if user is None:
            return False
            
        user.access_token = access_token
        user.token_expires_at = expires_at
        user.refresh_token = refresh_token
        user.updated_at = datetime.now()
        
        db.session.commit()
        return user
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user tokens: {e}")
        return None
