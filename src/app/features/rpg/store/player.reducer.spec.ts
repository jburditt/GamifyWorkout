import { playerReducer, initialState } from '@app/features/rpg/store/player.reducer';
import { damage, heal } from '@app/features/rpg/store/player.actions';

describe('Player Reducer', () => {
  it('should handle damage', () => {
    const action = damage({ damageHp: 10 });
    const result = playerReducer(initialState, action);
    expect(result.hp).toBe(initialState.hp - 10);
  });

  it('should handle heal', () => {
    const action = heal();
    const result = playerReducer({ ...initialState, hp: 0 }, action);
    expect(result.hp).toBe(10);
  });
});
