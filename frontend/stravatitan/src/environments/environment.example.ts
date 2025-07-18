//Create two new files: One named 'environment.ts' and One named 'environment.prod.ts'

//Sample environment.ts
//Make sure the values for the last 3 fields are strings
export const environment = {
  production: false, //Keep this false
  stravaClientId: '<Your Strava Client ID',
  apiUrl: 'http://localhost:5000', // Backend Flask URL
  redirectUri: 'http://localhost:4200', //Your front end OAuth Lander. This is the URL that the Strava OAuth redirects to after authenticating
};

//Sample environment.prod.ts
//Make sure the values for the last 3 fields are strings
export const environmentProd = {
  production: true,
  stravaClientId: '<Your Strava Client ID',
  apiUrl: 'http://localhost:5000', // Backend Flask URL
  redirectUri: 'http://localhost:4200', //Your front end OAuth Lander. This is the URL that the Strava OAuth redirects to after authenticating
}