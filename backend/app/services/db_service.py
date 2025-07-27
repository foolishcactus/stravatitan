# This module is responsible for:
# Making API Calls to our PostgreSQL database
####################################################################################
from flask import session
from datetime import datetime
from app import db
from app.models import User, StravaActivity
####################################################################################

#
#   METHODS FOR READING FROM DATABASE
#

####################################################################################
def getAllUsers() -> list[User]:
    return User.query.all()

####################################################################################
def is_access_token_expired(strava_athlete_id:str) -> tuple[str, bool]:
    """Returns a tuple of [Refresh Token: str, Is Expired: bool]"""
    user:User = User.query.filter_by(strava_athlete_id = strava_athlete_id).first()

    return (user.refresh_token, user.is_token_expired())

####################################################################################
def get_access_token(strava_athlete_id:str) -> str | None:
    try:
        user = User.query.filter_by(strava_athlete_id = strava_athlete_id).first()
        if user:
            print("We successfully got the ahtlete access_token")
            return user.access_token
    except Exception as e:
        return None

####################################################################################
#
#   METHODS FOR ADDING TO DATABASE
#
####################################################################################
def add_user_to_db(refresh_token: str, expires_at: datetime, access_token: str, athlete_data) -> User | None:
    try:
        
        strava_athlete_id = athlete_data['id']

        existing_user = User.query.filter_by(strava_athlete_id=strava_athlete_id).first()

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
            strava_athlete_id = athlete_data['id'],
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
def update_user_tokens(access_token: str, expires_at: datetime, refresh_token: str) -> User | None:
    try:
        id = session['athlete_id']
        if not id:
            return False
            
        user: User = User.query.filter_by(strava_athlete_id=id).first()
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
    
####################################################################################
def add_runs_to_database(actitivies_to_be_added: list[dict]) -> list[StravaActivity] | None:
    try:
        id = session['athlete_id']

        if not id:
            return False
        
        user = User.query.filter_by(strava_athlete_id = id).first()

        if not user:
            return False
        
        print(f"We are about to add activities into the database")
        savedActivities: list[StravaActivity] = []

        for activity in actitivies_to_be_added:
            print(f"We start building out data entries")

            data_entry = StravaActivity(
                strava_activity_id = activity['id'],
                name=activity.get('name', ''),
                activity_type=activity.get('type', ''),
                distance=activity.get('distance', 0),
                elapsed_time=activity.get('elapsed_time', 0),
                
                description=activity.get('description', '')[:255],
                start_date_local = datetime.fromisoformat(activity['start_date_local'].replace('Z', '+00:00')),
                strava_athlete_id = id,
                user_id = user.id,
            )
            
            db.session.add(data_entry)
            savedActivities.append(data_entry)
        
        db.session.commit()

        
        return savedActivities
    except Exception as e:
        db.session.rollback()
        print(f"Error adding activities {e}")
        return None