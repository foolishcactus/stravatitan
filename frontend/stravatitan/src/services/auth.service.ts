import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TitanAPIRes } from '../interfaces/titan-apires';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  async isUserAuthenticated():Promise<boolean> {
    try {
      const response: TitanAPIRes = await lastValueFrom(
        this.http.get<TitanAPIRes>(`${this.apiUrl}/api/auth/status`, {
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
          `${this.apiUrl}/api/handle-strava-exchange-code`,
          { code: exchangeCode },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
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

  async logout(): Promise<boolean>{
    try{
      const response: TitanAPIRes = await lastValueFrom(this.http.get<TitanAPIRes>(`${this.apiUrl}/api/auth/logout`, {
        withCredentials: true, 
      }))

      if (response.success){
        return true;
      }else{
        return false;
      }
    }catch(error){
      console.error('Error logging out')
      return false;
    }
  }
}
