import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-insights',
  imports: [TabsModule, CardModule, SkeletonModule],
  templateUrl: './insights.html',
  styleUrl: './insights.css'
})
export class Insights {

}
