import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TitanAPIRes } from '../interfaces/titan-apires';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  async isUserAuthenticated() {
    try {
      const response: TitanAPIRes = await lastValueFrom(
        this.http.get<TitanAPIRes>('http://localhost:5000/api/auth/status', {
          withCredentials: true,
        })
      );

      if (response.success) {
        console.log('This is the response message: ' + response.message);
        return true;
      }

      console.log('This is the response message: ' + response.message);
      return false;
    } catch (error) {
      console.log('TitanAPI Error accessing auth/status');
      return false;
    }
  }

  async handleOAuthCallback(exchangeCode: any) {
    try {
      const response: TitanAPIRes = await lastValueFrom(
        this.http.post<TitanAPIRes>(
          'http://localhost:5000/api/handle-strava-exchange-code',
          { code: exchangeCode },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json', // Add this
            },
          }
        )
      );

      if (response.success) {
        console.log('Strava account connected');
        console.log('Here is the athlete id ' + response.data.athlete_id);
      } else {
        console.log("User wasn't added successfully");
      }
    } catch (error) {
      console.error('Error connecting Strava account:', error);
    }
  }
}
