import { createAction, props } from '@ngrx/store';

export const damage = createAction('[Player] Damage', props<{ damageHp: number }>());
export const heal = createAction('[Player] Heal');
