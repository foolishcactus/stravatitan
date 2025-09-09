import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, catchError, tap, map} from 'rxjs';
import { StravaActivity } from '../interfaces/strava-activity';
import { TitanAPIRes } from '../interfaces/titan-apires';

@Injectable({
  providedIn: 'root'
})
export class Database {
  private apiUrl = environment.apiUrl

  private activitiesSubject = new BehaviorSubject<StravaActivity[]>([]);
  public activities$ = this.activitiesSubject.asObservable();
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('DatabaseService initialized');
  }

  getActivities(): Observable<StravaActivity[]> {
    console.log('Fetching activities from database...');
    this.loadingSubject.next(true);
    
    return this.http.get<TitanAPIRes>(`${this.apiUrl}/api/db/get-runs`, {
      withCredentials: true  // Sends session cookies for authentication
    }).pipe(
      map(response => {
        // Extract activities from Titan API response
        if (response.success && response.data) {
          return response.data;  // data IS the activities array
        } else {
          console.warn('API response structure unexpected:', response);
          return [];
        }
      }),
      tap(activities => {
        console.log(`Successfully loaded ${activities.length} activities`);
        // Update the state - all subscribed components will get new data
        this.activitiesSubject.next(activities);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        console.error('Error fetching activities:', error);
        this.loadingSubject.next(false);
        return throwError(() => error);
      })
    );
  }

  getCurrentActivities(): StravaActivity[] {
    return this.activitiesSubject.value;
  }

  refreshActivities(): Observable<StravaActivity[]> {
    return this.getActivities();
  }

  clearActivities(): void {
    this.activitiesSubject.next([]);
    console.log('Activities data cleared');
  }
}
