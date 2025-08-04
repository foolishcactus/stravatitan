export interface StravaActivity {

    id: number,
    strava_activity_id: number,
    name: string,
    activity_type: string,
    distance: number,
    elapsed_time: number,
    pace_per_km: number,
    pace_per_mile: number,
    description: string,
    start_date_local: Date,
    strava_athlete_id: number,

    created_at: Date,
    updated_at: Date,
}
