import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  triggerOAuth() {
    const params = new URLSearchParams({
      client_id: '122292',
      redirect_uri: 'http://localhost:4200/',
      response_type: 'code',
      scope: 'read_all,activity:read_all',
      approval_prompt: 'force',
    });

    const authUrl = `https://www.strava.com/oauth/authorize?${params.toString()}`;
    window.location.href = authUrl;
  }
}
