import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from '@app/shared/models/menu-item.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        MatIconModule, MatToolbarModule, MatButtonModule,
        MenuComponent
    ]
})
export class AppComponent {
  menuItemList: Array<MenuItem> = [
    new MenuItem('Home', '/', 'home'),
    new MenuItem('User', '/user', 'contact_mail', [
      new MenuItem('Search', '/user/search', 'search')
    ]),
    new MenuItem('Dashboard', '/user/dashboard', 'dashboard'),
    new MenuItem('Features', '/feature', 'build'),
    new MenuItem('Admin', '/admin', 'settings'),
  ];
}
