import { createReducer, on } from '@ngrx/store';
import { damage, heal } from './player.actions';

export const initialState: State = {
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  experience: 0,
  level: 1
};

export const playerReducer = createReducer(
  initialState,
  on(damage, (state, { damageHp }) => ({ ...state, hp: state.hp - damageHp })),
  on(heal, (state) => ({...state, hp: state.hp + 10}))
);

export interface State {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  experience: number;
  level: number;
}


