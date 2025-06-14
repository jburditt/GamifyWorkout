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
import { Store } from '@ngrx/store';
import { Player } from '@features/rpg/model/player';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        NgIf, NgForOf,
        RouterLink, RouterOutlet,
        MatIconModule, MatToolbarModule, MatButtonModule,
        MenuComponent
    ]
})
export class AppComponent implements OnInit {

  private readonly _loggingService: LoggingService;

  menuItemList: Array<MenuItem> = [
    new MenuItem('Weather', '/user/weather', 'assignment'),
    new MenuItem('Admin', '/admin', 'settings'),
    new MenuItem('User', '/user', 'contact_mail'),
    new MenuItem('Dashboard', '/user/dashboard', 'dashboard'),
  ];

  public player!: Player;

  constructor(private store: Store<{ player: Player }>, private loggingFactory: LoggingFactory)
  {
    this._loggingService = this.loggingFactory.create(this.constructor.name);
    store.select('player').subscribe((player) => {
      console.log('player', player);
      this.player = player;
    });
  }

  ngOnInit() {
    this._loggingService.debug('AppComponent initialized');
  }
}
