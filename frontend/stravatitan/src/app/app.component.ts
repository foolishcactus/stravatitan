import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'stravatitan';
  isAuthenticated: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    console.log('We are in the ngoninit');
  }

  async createCookie() {
    try {
      const response: any = await lastValueFrom(
        this.http.get('http://localhost:5000/api/create-session', {
          withCredentials: true,
        })
      );

      console.log(response.message);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }

  async checkCookie() {
    try {
      const response: any = await lastValueFrom(
        this.http.get('http://localhost:5000/api/test-session-check', {
          withCredentials: true,
        })
      );

      console.log(response.message);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  }
}
