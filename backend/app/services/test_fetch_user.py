import requests
from datetime import datetime
from app.services.strava_service import StravaService


# Test it!
if __name__ == "__main__":
    # Put your real access token here
    access_token = "0bcfce3cdd49ecc43994fa9d74660400aaeb69c2"
    
    # Create the service
    strava_service = StravaService(access_token)
    
    # Test the function
    try:
        activities = strava_service.fetch_user_activities_from_strava()
        print("\n✅ SUCCESS!")
        print(f"Total activities fetched: {len(activities)}")
        
        if activities:
            print(f"First activity: {activities[0].get('name')}")
            print(f"Activity type: {activities[0].get('type')}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")