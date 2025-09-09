import { Component, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Heatmap } from '../../../heatmap/heatmap';
import { StravaActivity } from '../../../../interfaces/strava-activity';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Database } from '../../../../services/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-insights',
  imports: [TabsModule, CardModule, SkeletonModule, Heatmap, CommonModule, ReactiveFormsModule, FormsModule ],
  standalone: true,
  templateUrl: './insights.html',
  styleUrl: './insights.css'
})
export class Insights implements OnInit {
  activities$: Observable<StravaActivity[]>;
  loading$: Observable<boolean>;

  constructor(private databaseService: Database) {
    this.activities$ = this.databaseService.activities$;
    this.loading$ = this.databaseService.loading$;
  }

  ngOnInit(): void {
    if (this.databaseService.getCurrentActivities().length === 0) {
      this.databaseService.getActivities().subscribe();
    }
  }
}