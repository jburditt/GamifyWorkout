import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from '@app/shared/models/menu-item.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from './shared/components/menu/menu.component';
import { AuthenticationService } from './core/auth/auth.interface';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, MenuComponent, NgxUiLoaderModule]
})
export class AppComponent {
  menuItemList: Array<MenuItem> = [
    new MenuItem('Home', '/', 'home'),
    new MenuItem('User', '/user', 'contact_mail', [
      new MenuItem('Search', '/user/search', 'search')
    ]),
    new MenuItem('Form', '/feature', 'build', [
      new MenuItem('NgRx Store', '/feature/ngrx-store', 'dashboard')
    ]),
    new MenuItem('Admin', '/admin', 'settings'),
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
}
