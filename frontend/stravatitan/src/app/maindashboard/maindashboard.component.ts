import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputIconModule } from 'primeng/inputicon';
import { SelectButtonModule } from 'primeng/selectbutton';

import { Insights } from './subcomponents/insights/insights';
import { Myruns } from './subcomponents/myruns/myruns';

@Component({
    selector: 'app-maindashboard',
    imports: [ButtonModule, DividerModule, CardModule, PanelModule, InputIconModule, Insights, Myruns, SelectButtonModule, CommonModule, FormsModule ],
    templateUrl: './maindashboard.component.html',
    styleUrl: './maindashboard.component.css'
})
export class MaindashboardComponent {
  constructor(private router: Router, private authService: AuthService ) {}

  ngOnInit() {}

  mainFlex = '5';
  sideFlex = '0';
  isPanelCollapsed = true;
  panelToggleLabel = 'Show Side Panel';

  stateOptions = [
    {label:'Miles', value: 'miles'}, {label: 'Kilometers', value: 'kilometers'}
  ]

  value: string = 'kilometers'

  togglePanel() {
    if (this.sideFlex === '0') {
      this.sideFlex = '1';
      this.mainFlex = '4';
      this.isPanelCollapsed = false;
      this.panelToggleLabel = 'Hide Side Panel';
    } else {
      this.sideFlex = '0';
      this.mainFlex = '5';
      this.isPanelCollapsed = true;
      this.panelToggleLabel = 'Show Side Panel';
    }
  }
  
  toggleDarkMode(){
    const element = document.querySelector('html');
    element?.classList.toggle('my-app-dark');
  }

  

  async handleLogoutClick(){
  let isLoggedOut = await this.authService.logout();

    if (isLoggedOut){
      this.router.navigate(['/login']);
    }
    
  }
}
