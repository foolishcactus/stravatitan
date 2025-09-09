import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, startWith } from 'rxjs';
// PrimeNG Imports
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DatePickerModule } from 'primeng/datepicker';
import { OverlayModule } from 'primeng/overlay';
import { StravaActivity } from '../../../../interfaces/strava-activity';
import { Database } from '../../../../services/database';

@Component({
  selector: 'app-myruns',
  imports: [ButtonModule, InputTextModule, TableModule, DatePickerModule, FormsModule, CommonModule, SliderModule, MultiSelectModule, IconFieldModule, InputIconModule, OverlayModule],
  standalone: true,
  templateUrl: './myruns.html',
  styleUrl: './myruns.css'
})
export class Myruns implements OnInit{
  // Initialize the observables in the declaration
  stravaActivities$: Observable<StravaActivity[]>;
  loading$: Observable<boolean>;
  
  selectedActivity!: StravaActivity;
  searchValue = '';
 
  // Filter ranges
  distanceRange: number[] = [0, 50000];
  durationRange: number[] = [0, 14400];
  paceRange: number[] = [180, 900];

  // Inject the database service and initialize observables
  constructor(private databaseService: Database) {
    // Initialize the observables here with startWith to prevent null
    this.stravaActivities$ = this.databaseService.activities$.pipe(startWith([]));
    this.loading$ = this.databaseService.loading$;
  }

  ngOnInit() {
    this.loadActivities();
  }

  loadActivities() {
    // Check if we already have data, if not load it
    if (this.databaseService.getCurrentActivities().length === 0) {
      this.databaseService.getActivities().subscribe({
        next: (activities: StravaActivity[]) => {
          console.log(`Loaded ${activities.length} activities`);
        },
        error: (error: any) => {
          console.error('Failed to load activities:', error);
        }
      });
    }
  }

  // Add refresh method
  refreshActivities() {
    this.databaseService.refreshActivities().subscribe();
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }

  formatDistance(meters: number): string {
    const km = (meters / 1000).toFixed(2);
    return `${km} km`;
  }

  formatElapsedTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
   
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
   
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  calculatePace(distanceMeters: number, elapsedTimeSeconds: number): string {
    if (distanceMeters === 0) return 'N/A';
   
    const distanceKm = distanceMeters / 1000;
    const timeMinutes = elapsedTimeSeconds / 60;
    const paceMinPerKm = timeMinutes / distanceKm;
   
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
   
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`;
  }

  getActivityIcon(activityType: string): string {
    const iconMap: { [key: string]: string } = {
      'Run': 'pi pi-directions-alt',
      'Ride': 'pi pi-car',
      'Swim': 'pi pi-heart',
      'Hike': 'pi pi-map-marker',
      'Walk': 'pi pi-user'
    };
    return iconMap[activityType] || 'pi pi-circle';
  }

  formatPaceFromSeconds(paceSeconds: number, unit: 'km' | 'mile' = 'km'): string {
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.round(paceSeconds % 60);
    const unitLabel = unit === 'km' ? '/km' : '/mi';
    return `${minutes}:${seconds.toString().padStart(2, '0')} ${unitLabel}`;
  }

  onRowSelect(data: TableRowSelectEvent){
    console.log("We are trying to access some row.")
    console.log(this.selectedActivity);
  }
}