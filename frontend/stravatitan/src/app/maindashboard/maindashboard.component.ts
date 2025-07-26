import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-maindashboard',
  standalone: true,
  imports: [],
  templateUrl: './maindashboard.component.html',
  styleUrl: './maindashboard.component.css',
})
export class MaindashboardComponent {
  constructor(private router: Router, private authService: AuthService ) {}

  ngOnInit() {}

  async handleLogoutClick(){
    let isLoggedOut = await this.authService.logout();

    if (isLoggedOut){
      this.router.navigate(['/login']);
    }
    
  }
}
