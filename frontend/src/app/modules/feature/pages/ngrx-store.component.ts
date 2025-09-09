import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
// TODO
import { damage, heal } from '@features/rpg/store/player.actions';
import { Player } from '@features/rpg/model/player';
import { StatusBarComponent } from '@app/features/rpg/component/status-bar.component';
import { MatButton } from "@angular/material/button";

@Component({
    templateUrl: 'ngrx-store.component.html',
    imports: [CommonModule, StatusBarComponent, MatButton],
    styleUrls: ['ngrx-store.component.scss']
})
export class NgRxStoreComponent {
  player!: Player;

  constructor(private store: Store<{ player: Player }>) {

    store.select('player').subscribe((player) => {
      this.player = player;
    })
  }

  damage() {
    this.store.dispatch(damage({ damageHp: 1 }));
  }

  heal() {
    this.store.dispatch(heal());
  }
}
