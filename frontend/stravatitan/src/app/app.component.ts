import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stravatitan';
  isAuthenticated: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      await this.authService.handleOAuthCallback(code);
      window.history.replaceState({}, document.title, '/');
    }

    const isAuthenticated:boolean = await this.authService.isUserAuthenticated();

    if (isAuthenticated) {
      this.router.navigate(['/maindashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
