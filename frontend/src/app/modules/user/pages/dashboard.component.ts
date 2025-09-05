import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
// TODO
import { damage, heal } from '@features/rpg/store/player.actions';
import { Player } from '@features/rpg/model/player';

@Component({
    templateUrl: 'dashboard.component.html',
    imports: [CommonModule]
})
export class DashboardPageComponent {
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
