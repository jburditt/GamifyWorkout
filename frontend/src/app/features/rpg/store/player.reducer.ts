import { createReducer, on } from '@ngrx/store';
import { damage, heal } from './player.actions';

export const playerReducer = createReducer(
  100,
  //on(damage, (state, { damageHp }) => ({ ...state, hp: state.hp - damageHp })),
  on(damage, (state, { damageHp }) => state - damageHp),
  on(heal, state => state + 10)
);

export interface State {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  experience: number;
  level: number;
}

export const initialState: State = {
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  experience: 0,
  level: 1
};
