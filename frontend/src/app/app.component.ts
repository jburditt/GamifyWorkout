import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem, MenuComponent } from '@fullswing-angular-library';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationService } from './core/auth/auth.interface';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, MenuComponent, NgxUiLoaderModule],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inventoryMenuItems: Array<MenuItem> = [
    new MenuItem('Gym', '/inventory/gym', 'home'),
    //new MenuItem('Items', '/inventory/items', 'contact_mail'),
    //new MenuItem('Equipment', '/inventory/equipment', 'build'),
  ];
  scheduleMenuItems: Array<MenuItem> = [
    new MenuItem('Weekly Schedule', '/schedule/week', 'calendar_today')
  ];
  isLoggedIn: boolean = false;

  constructor(private authService: AuthenticationService) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  login() {
    // TODO config service first
    //this.authService.init();
  }

  logout() {
    this.authService.logout();
  }

  isActive(route: string): string {
    return window.location.pathname.startsWith(route) ? 'active' : '';
  }
}
