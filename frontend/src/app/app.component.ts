import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { LoggingService } from '@app/core/services/logging/logging-service.interface';
import { LoggingFactory } from '@app/core/services/logging/logging.factory';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from '@app/shared/models/menu-item.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MenuComponent } from './shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NgIf, NgForOf,
    RouterLink, RouterOutlet,
    MatIconModule, MatToolbarModule, MatButtonModule,
    MenuComponent
  ]
})
export class AppComponent implements OnInit {

  public projectName: string = 'Maverick';

  private readonly _loggingService: LoggingService;

  menuItemList: Array<MenuItem> = [
    new MenuItem('Weather', '/user/weather', 'assignment'),
    new MenuItem('Admin', '/admin', 'settings'),
    new MenuItem('User', '/user', 'contact_mail'),
  ];

  constructor(private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
  }

  ngOnInit() {
    this._loggingService.debug('AppComponent initialized');
  }
}
