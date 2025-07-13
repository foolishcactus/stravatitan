import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-maindashboard',
  standalone: true,
  imports: [],
  templateUrl: './maindashboard.component.html',
  styleUrl: './maindashboard.component.css',
})
export class MaindashboardComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Use snapshot - perfect for OAuth codes that are only used once
    const code = this.route.snapshot.queryParams['code'];

    if (code) {
      this.handleStravaExchangeCode(code);
      console.log('We have fired the handle strava exchange function');
    } else {
      // No code present, check if user is already authenticated
      //this.checkAuthStatus();
    }
  }

  async handleStravaExchangeCode(code: any) {
    try {
      const response: any = await lastValueFrom(
        this.http.post(
          'http://localhost:5000/api/handle-strava-exchange-code',
          { code },
          { withCredentials: true }
        )
      );

      if (response.success) {
        console.log('Strava account connected');
        //await this.createUserSession(response.athlete_id);
      } else {
        console.log("User wasn't added successfully");
      }
    } catch (error) {
      console.error('Error connecting Strava account:', error);
    }
  }

  //async createUserSession(athlete_id: any) {
  //  try {
  //    const response: any = await lastValueFrom(
  //      this.http.get(
  //        'http://localhost:5000/api/create-session',
  //        //{ athlete_id: athlete_id }, // Send athlete_id in the request body
  //        { withCredentials: true } // Include credentials for session cookies
  //      )
  //    );
  //
  //    if (response.success) {
  //      console.log('Session created successfully');
  //      console.log('Athlete ID:', response.athlete_id);
  //      return response;
  //    } else {
  //      console.error('Failed to create session:', response.error);
  //      return null;
  //    }
  //  } catch (error) {
  //    console.error('Error creating user session:', error);
  //    return null;
  //  }
  //}
}
