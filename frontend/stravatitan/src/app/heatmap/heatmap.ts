import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { StravaActivity } from '../../interfaces/strava-activity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions, AgChartTheme } from "ag-charts-enterprise";
import "ag-charts-enterprise";

export type TimeRange = "week" | "month" | "ytd" | "year"

interface HeatmapData {
  day: string;
  month: string;
  miles: number;
}

@Component({
  selector: 'app-heatmap',
  imports: [CommonModule, FormsModule, AgCharts],
  standalone: true,
  templateUrl: './heatmap.html',
  styleUrl: './heatmap.css'
})
export class Heatmap implements OnInit, OnChanges, OnDestroy {
  
  @Input() activities: StravaActivity[] = [];
  @Input() timeRange: TimeRange = 'year';
  @Input() selectedDate?: Date;
  @Input() showTitle: boolean = true;
  @Input() year?: number;

  public chartOptions: AgChartOptions = {};
  private themeObserver?: MutationObserver;

  // Light Mode Theme
  private lightHeatmapTheme: AgChartTheme = {
    baseTheme: 'ag-default',
    palette: {
      fills: [
        '#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350',
        '#f44336', '#e53935', '#d32f2f', '#c62828', '#ff0000'
      ],
      strokes: ['#ffffff']
    },
    params: {
      foregroundColor: '#404040',
      backgroundColor: '#ffffff',
      accentColor: '#ff0000',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 12,
      tooltipBackgroundColor: '#ffffff',
      tooltipTextColor: '#404040',
      chromeBackgroundColor: '#ffffff',
      chromeTextColor: '#404040'
    },
    overrides: {
      common: {
        title: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#404040'
        },
        subtitle: {
          fontSize: 14,
          color: '#404040'
        },
        legend: {
          item: {
            label: {
              color: '#404040'
            }
          }
        },
        axes: {
          category: {
            line: {
              width: 1
            },
            tick: {
              width: 1
            },
            label: {
              color: '#404040',
              fontSize: 11
            },
            title: {
              color: '#404040',
              fontSize: 12,
              fontWeight: 'bold'
            },
            gridLine: {
              style: [{
                stroke: '#f5f5f5',
                lineDash: [0]
              }]
            }
          },
          number: {
            line: {
              width: 1
            },
            tick: {
              width: 1
            },
            label: {
              color: '#404040',
              fontSize: 11
            },
            title: {
              color: '#404040',
              fontSize: 12,
              fontWeight: 'bold'
            },
            gridLine: {
              style: [{
                stroke: '#f5f5f5',
                lineDash: [0]
              }]
            }
          }
        }
      },
      heatmap: {
        series: {
          label: {
            enabled: true,
            color: '#404040',
            fontSize: 10
          },
          stroke: '#ffffff',
          strokeWidth: 1
        }
      }
    }
  };

  // Dark Mode Theme
  private darkHeatmapTheme: AgChartTheme = {
    baseTheme: 'ag-default-dark',
    palette: {
      fills: [
        '#2d1b1b', '#3d2020', '#4d2525', '#5d2a2a', '#6d2f2f',
        '#801a1a', '#a01515', '#c01010', '#e00808', '#ff0000'
      ],
      strokes: ['#27272a']
    },
    params: {
      foregroundColor: '#d3d3d6',
      backgroundColor: '#27272a',
      accentColor: '#ff0000',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 12,
      tooltipBackgroundColor: '#27272a',
      tooltipTextColor: '#d3d3d6',
      chromeBackgroundColor: '#27272a',
      chromeTextColor: '#d3d3d6'
    },
    overrides: {
      common: {
        title: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#d3d3d6'
        },
        subtitle: {
          fontSize: 14,
          color: '#d3d3d6'
        },
        legend: {
          item: {
            label: {
              color: '#d3d3d6'
            }
          }
        },
        axes: {
          category: {
            line: {
              width: 1,
              stroke: '#404040'
            },
            tick: {
              width: 1,
              stroke: '#404040'
            },
            label: {
              color: '#d3d3d6',
              fontSize: 11
            },
            title: {
              color: '#d3d3d6',
              fontSize: 12,
              fontWeight: 'bold'
            },
            gridLine: {
              style: [{
                stroke: '#404040',
                lineDash: [0]
              }]
            }
          },
          number: {
            line: {
              width: 1,
              stroke: '#404040'
            },
            tick: {
              width: 1,
              stroke: '#404040'
            },
            label: {
              color: '#d3d3d6',
              fontSize: 11
            },
            title: {
              color: '#d3d3d6',
              fontSize: 12,
              fontWeight: 'bold'
            },
            gridLine: {
              style: [{
                stroke: '#404040',
                lineDash: [0]
              }]
            }
          }
        }
      },
      heatmap: {
        series: {
          label: {
            enabled: true,
            color: '#d3d3d6',
            fontSize: 10
          },
          stroke: '#27272a',
          strokeWidth: 1
        }
      }
    }
  };

  ngOnInit() {
    this.updateChart();
    this.setupThemeObserver();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activities'] || changes['timeRange'] || changes['selectedDate'] || changes['year']) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  private getCurrentTheme(): AgChartTheme {
    const htmlElement = document.querySelector('html');
    const isDarkMode = htmlElement?.classList.contains('my-app-dark') || false;
    return isDarkMode ? this.darkHeatmapTheme : this.lightHeatmapTheme;
  }

  private setupThemeObserver() {
    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const newTheme = this.getCurrentTheme();
          this.chartOptions = {
            ...this.chartOptions,
            theme: newTheme
          };
        }
      });
    });

    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      this.themeObserver.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  getTitle(): string {
    const currentYear = this.year || new Date().getFullYear();
    
    switch (this.timeRange) {
      case 'month':
        const monthDate = this.selectedDate || new Date();
        return `${monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Activity`;
      case 'ytd':
        return `${currentYear} Year to Date`;
      case 'year':
        return `${currentYear} Full Year`;
      default:
        return 'Week';
    }
  }

  private updateChart() {
    console.log('updateChart called');
    const filteredActivities = this.getFilteredActivities();
    console.log('Filtered activities:', filteredActivities.length);
    
    const chartData = this.prepareChartData(filteredActivities);
    console.log('Chart data length:', chartData.length);
    
    // Get the current theme based on the CSS class
    const currentTheme = this.getCurrentTheme();
    
    // Calculate proper color domain
    const activeDays = chartData.filter(d => d.miles > 0);
    const maxMiles = activeDays.length > 0 ? Math.max(...activeDays.map(d => d.miles)) : 1;
    
    console.log('Max miles:', maxMiles);
    
    this.chartOptions = {
      theme: currentTheme,
      data: chartData,
      title: this.showTitle ? {
        text: this.getTitle(),
      } : undefined,
      series: [
        {
          type: "heatmap",
          xKey: "day",
          xName: "Day",
          yKey: "month",
          yName: "Month", 
          colorKey: "miles",
          colorName: "Miles",
          colorRange: ["#ffebee", "#ff0000"], // Light pink to bright red
          // Force the domain to start at 0 and go to max
          colorDomain: [0, maxMiles]
        } as any,
      ],
    };
  }

  private getFilteredActivities(): StravaActivity[] {
    const currentYear = this.year || new Date().getFullYear();
    const now = new Date();
    
    return this.activities.filter(activity => {
      const activityDate = new Date(activity.start_date_local);
      
      switch (this.timeRange) {
        case 'month':
          const targetDate = this.selectedDate || now;
          return activityDate.getFullYear() === targetDate.getFullYear() &&
                 activityDate.getMonth() === targetDate.getMonth();
        
        case 'ytd':
          return activityDate.getFullYear() === currentYear &&
                 activityDate <= now;
        
        case 'year':
          return activityDate.getFullYear() === currentYear;
        
        default:
          return true;
      }
    });
  }

  private prepareChartData(activities: StravaActivity[]): HeatmapData[] {
    const currentYear = this.year || new Date().getFullYear();
    const dataMap = new Map<string, number>();
    
    // Group activities by date
    activities.forEach(activity => {
      const date = new Date(activity.start_date_local);
      const dateStr = date.toISOString().split('T')[0];
      const currentDistance = dataMap.get(dateStr) || 0;
      dataMap.set(dateStr, currentDistance + (activity.distance / 1000)); // Convert to km
    });

    const chartData: HeatmapData[] = [];

    if (this.timeRange === 'week') {
      // Week view - Sunday through Saturday
      const now = new Date();
      const startOfWeek = new Date(now);
      const dayOfWeek = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const distance = dataMap.get(dateStr) || 0;
        const miles = distance * 0.621371;
        
        chartData.push({
          day: dayNames[i],
          month: 'Week',
          miles: Math.round(miles * 10) / 10
        });
      }
    } else if (this.timeRange === 'month') {
      // Month view - single month
      const targetDate = this.selectedDate || new Date();
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short' });
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const distance = dataMap.get(dateStr) || 0;
        const miles = distance * 0.621371; // Convert km to miles
        
        chartData.push({
          day: day.toString(),
          month: monthName,
          miles: Math.round(miles * 10) / 10
        });
      }
    } else if (this.timeRange === 'ytd') {
      // YTD view - last 365 days, organized by month
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      
      // Group the 365 days by year-month for display
      const monthlyData = new Map<string, { year: number, month: number, monthName: string, data: HeatmapData[] }>();
      
      for (let date = new Date(oneYearAgo); date <= now; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        const distance = dataMap.get(dateStr) || 0;
        const miles = distance * 0.621371;
        
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear().toString().slice(-2)}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            year: date.getFullYear(),
            month: date.getMonth(),
            monthName: monthName,
            data: []
          });
        }
        
        monthlyData.get(monthKey)!.data.push({
          day: date.getDate().toString(),
          month: monthName,
          miles: Math.round(miles * 10) / 10
        });
      }
      
      // Flatten the monthly data
      monthlyData.forEach(monthInfo => {
        chartData.push(...monthInfo.data);
      });
    } else {
      // Year view - all months of the specified year
      for (let month = 0; month < 12; month++) {
        const monthName = new Date(currentYear, month, 1).toLocaleDateString('en-US', { month: 'short' });
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(currentYear, month, day);
          const dateStr = date.toISOString().split('T')[0];
          const distance = dataMap.get(dateStr) || 0;
          const miles = distance * 0.621371; // Convert km to miles
          
          chartData.push({
            day: day.toString(),
            month: monthName,
            miles: Math.round(miles * 10) / 10
          });
        }
      }
    }

    return chartData;
  }
}