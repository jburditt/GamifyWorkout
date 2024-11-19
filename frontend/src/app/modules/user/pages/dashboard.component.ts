import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
// TODO
import { damage, heal } from '@features/rpg/store/player.actions';
import { Player } from '@features/rpg/model/player';

@Component({
  standalone: true,
  templateUrl: 'dashboard.component.html',
  imports: [CommonModule]
})
export class DashboardPageComponent {
  player$: Observable<Player>;

  constructor(private store: Store<{ player: Player }>) {
    this.player$ = store.select('player');
  }

  damage() {
    //this.store.dispatch(damage());
  }

  heal() {
    this.store.dispatch(heal());
  }
}
