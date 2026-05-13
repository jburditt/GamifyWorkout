import { playerReducer, initialState } from '@app/features/rpg/store/player.reducer';
import { damage, heal } from '@app/features/rpg/store/player.actions';

describe('Player Reducer', () => {
  it('initial state has correct values', () => {
    expect(initialState.hp).toBe(100);
    expect(initialState.maxHp).toBe(100);
    expect(initialState.level).toBe(1);
    expect(initialState.experience).toBe(0);
  });

  it('should return the initial state for an unknown action', () => {
    const action = { type: '[Unknown] Action' } as any;
    const result = playerReducer(initialState, action);
    expect(result).toEqual(initialState);
  });

  describe('damage', () => {
    it('should reduce hp by the damage amount', () => {
      const action = damage({ damageHp: 10 });
      const result = playerReducer(initialState, action);
      expect(result.hp).toBe(initialState.hp - 10);
    });

    it('should not mutate the state', () => {
      const action = damage({ damageHp: 10 });
      playerReducer(initialState, action);
      expect(initialState.hp).toBe(100);
    });

    it('should handle zero damage', () => {
      const action = damage({ damageHp: 0 });
      const result = playerReducer(initialState, action);
      expect(result.hp).toBe(initialState.hp);
    });
  });

  describe('heal', () => {
    it('should restore 10 hp', () => {
      const action = heal();
      const result = playerReducer({ ...initialState, hp: 0 }, action);
      expect(result.hp).toBe(10);
    });

    it('should add 10 to partial hp', () => {
      const action = heal();
      const result = playerReducer({ ...initialState, hp: 50 }, action);
      expect(result.hp).toBe(60);
    });

    it('should not change level, maxHp, or experience', () => {
      const action = heal();
      const result = playerReducer({ ...initialState, hp: 0 }, action);
      expect(result.level).toBe(initialState.level);
      expect(result.maxHp).toBe(initialState.maxHp);
      expect(result.experience).toBe(initialState.experience);
    });
  });
});
