import { StravaActivity } from "./strava-activity";


export const mockStravaActivities: StravaActivity[] = [
  {
    id: 1,
    strava_activity_id: 9876543210,
    name: "Morning 5K Run",
    activity_type: "Run",
    distance: 5200, // meters
    elapsed_time: 1680, // seconds (28 minutes)
    pace_per_km: 323, // 5:23 per km
    pace_per_mile: 520, // 8:40 per mile
    description: "Beautiful morning run through Central Park. Felt great today!",
    start_date_local: new Date("2024-08-01T06:30:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-08-01T07:15:00"),
    updated_at: new Date("2024-08-01T07:15:00")
  },
  {
    id: 2,
    strava_activity_id: 9876543211,
    name: "Tempo Run",
    activity_type: "Run",
    distance: 8000, // meters
    elapsed_time: 2400, // seconds (40 minutes)
    pace_per_km: 300, // 5:00 per km
    pace_per_mile: 483, // 8:03 per mile
    description: "Solid tempo run. Felt strong throughout.",
    start_date_local: new Date("2024-07-30T18:45:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-30T19:35:00"),
    updated_at: new Date("2024-07-30T19:35:00")
  },
  {
    id: 3,
    strava_activity_id: 9876543212,
    name: "Long Weekend Run",
    activity_type: "Run",
    distance: 12800, // meters
    elapsed_time: 4320, // seconds (1 hour 12 minutes)
    pace_per_km: 338, // 5:38 per km
    pace_per_mile: 544, // 9:04 per mile
    description: "Weekend long run prep for upcoming half marathon. Legs felt heavy but pushed through.",
    start_date_local: new Date("2024-07-28T07:00:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-28T08:30:00"),
    updated_at: new Date("2024-07-28T08:30:00")
  },
  {
    id: 4,
    strava_activity_id: 9876543213,
    name: "Hill Training",
    activity_type: "Run",
    distance: 8600, // meters
    elapsed_time: 3120, // seconds (52 minutes)
    pace_per_km: 363, // 6:03 per km
    pace_per_mile: 584, // 9:44 per mile
    description: "Brutal hill repeats session. 8x400m uphill intervals. Quads are toast!",
    start_date_local: new Date("2024-07-26T17:30:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-26T18:25:00"),
    updated_at: new Date("2024-07-26T18:25:00")
  },
  {
    id: 5,
    strava_activity_id: 9876543214,
    name: "Easy Recovery Run",
    activity_type: "Run",
    distance: 6400, // meters
    elapsed_time: 2520, // seconds (42 minutes)
    pace_per_km: 394, // 6:34 per km
    pace_per_mile: 634, // 10:34 per mile
    description: "Easy recovery run. Focused on just getting the legs moving.",
    start_date_local: new Date("2024-07-25T12:00:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-25T12:45:00"),
    updated_at: new Date("2024-07-25T12:45:00")
  },
  {
    id: 6,
    strava_activity_id: 9876543215,
    name: "Interval Training",
    activity_type: "Run",
    distance: 7200, // meters
    elapsed_time: 2160, // seconds (36 minutes)
    pace_per_km: 300, // 5:00 per km
    pace_per_mile: 483, // 8:03 per mile
    description: "Track workout: 6x800m at 5K pace. Legs felt fast and responsive.",
    start_date_local: new Date("2024-07-24T17:00:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-24T17:45:00"),
    updated_at: new Date("2024-07-24T17:45:00")
  },
  {
    id: 7,
    strava_activity_id: 9876543216,
    name: "Half Marathon Long Run",
    activity_type: "Run",
    distance: 21100, // meters (half marathon)
    elapsed_time: 7140, // seconds (1 hour 59 minutes)
    pace_per_km: 338, // 5:38 per km
    pace_per_mile: 544, // 9:04 per mile
    description: "Half marathon distance training run. Maintained steady effort throughout. Ready for race day!",
    start_date_local: new Date("2024-07-21T07:00:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-21T09:15:00"),
    updated_at: new Date("2024-07-21T09:15:00")
  },
  {
    id: 8,
    strava_activity_id: 9876543217,
    name: "Rainy Day Treadmill Run",
    activity_type: "Run",
    distance: 6000, // meters
    elapsed_time: 2100, // seconds (35 minutes)
    pace_per_km: 350, // 5:50 per km
    pace_per_mile: 563, // 9:23 per mile
    description: "Indoor treadmill run due to heavy rain. Watched Netflix to pass the time.",
    start_date_local: new Date("2024-07-23T19:30:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-23T20:10:00"),
    updated_at: new Date("2024-07-23T20:10:00")
  },
  {
    id: 9,
    strava_activity_id: 9876543218,
    name: "Fartlek Fun Run",
    activity_type: "Run",
    distance: 9300, // meters
    elapsed_time: 2790, // seconds (46.5 minutes)
    pace_per_km: 300, // 5:00 per km
    pace_per_mile: 483, // 8:03 per mile
    description: "Fartlek session mixing fast and easy efforts. Played with speed throughout the route.",
    start_date_local: new Date("2024-07-22T06:15:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-22T07:05:00"),
    updated_at: new Date("2024-07-22T07:05:00")
  },
  {
    id: 10,
    strava_activity_id: 9876543219,
    name: "Early Morning Shakeout",
    activity_type: "Run",
    distance: 3200, // meters
    elapsed_time: 1280, // seconds (21 minutes 20 seconds)
    pace_per_km: 400, // 6:40 per km
    pace_per_mile: 644, // 10:44 per mile
    description: "Short easy shakeout run before work. Just getting the blood flowing.",
    start_date_local: new Date("2024-07-20T05:30:00"),
    strava_athlete_id: 12345,
    created_at: new Date("2024-07-20T06:00:00"),
    updated_at: new Date("2024-07-20T06:00:00")
  }
];

// Helper function to format pace from seconds to mm:ss display
export function formatPaceFromSeconds(paceSeconds: number, unit: 'km' | 'mile' = 'km'): string {
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = Math.round(paceSeconds % 60);
  const unitLabel = unit === 'km' ? '/km' : '/mi';
  return `${minutes}:${seconds.toString().padStart(2, '0')} ${unitLabel}`;
}

// Helper function to convert elapsed time to readable format
export function formatElapsedTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else {
    return `${minutes}m ${remainingSeconds}s`;
  }
}

// Helper function to convert distance to km
export function formatDistance(meters: number): string {
  const km = (meters / 1000).toFixed(2);
  return `${km} km`;
}

// Helper function to calculate pace (min/km for runs)
export function calculatePace(distanceMeters: number, elapsedTimeSeconds: number): string {
  const distanceKm = distanceMeters / 1000;
  const timeMinutes = elapsedTimeSeconds / 60;
  const paceMinPerKm = timeMinutes / distanceKm;
  
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
}