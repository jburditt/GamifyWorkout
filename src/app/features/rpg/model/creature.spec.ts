import { Player } from '@app/features/rpg/model/player';
import { Warrior } from '@app/features/rpg/model/warrior';
import { Enemy } from '@app/features/rpg/model/enemy';

describe('RPG Models', () => {
  describe('Player', () => {
    it('should start at level 1 with 10 hp', () => {
      const player = new Player();
      expect(player.level).toBe(1);
      expect(player.hp).toBe(10);
    });

    it('should level up after killing an enemy worth enough experience', () => {
      const player = new Player();
      const enemy = new Enemy();
      enemy.experiencePoints = player.maxExperience;
      player.killEnemy(enemy);
      expect(player.level).toBe(2);
    });

    it('should reset experience to 0 after levelling up', () => {
      const player = new Player();
      const enemy = new Enemy();
      enemy.experiencePoints = player.maxExperience;
      player.killEnemy(enemy);
      expect(player.experience).toBe(0);
    });

    it('should restore hp to max on level up', () => {
      const player = new Player();
      player.hp = 1;
      const enemy = new Enemy();
      enemy.experiencePoints = player.maxExperience;
      player.killEnemy(enemy);
      expect(player.hp).toBe(player.maxHp);
    });

    it('should accumulate experience without levelling up', () => {
      const player = new Player();
      const enemy = new Enemy();
      enemy.experiencePoints = 1;
      player.killEnemy(enemy);
      expect(player.experience).toBe(1);
      expect(player.level).toBe(1);
    });

    it('should not level up when experience is one short of the threshold', () => {
      const player = new Player();
      const enemy = new Enemy();
      enemy.experiencePoints = player.maxExperience - 1;
      player.killEnemy(enemy);
      expect(player.level).toBe(1);
    });

    it('should increase maxExperience threshold after levelling up', () => {
      const player = new Player();
      const firstThreshold = player.maxExperience;
      const enemy = new Enemy();
      enemy.experiencePoints = player.maxExperience;
      player.killEnemy(enemy);
      expect(player.maxExperience).toBeGreaterThan(firstThreshold);
    });
  });

  describe('Warrior', () => {
    it('should have +5 maxHp over base player', () => {
      const warrior = new Warrior();
      const player = new Player();
      expect(warrior.maxHp).toBe(player.maxHp + 5);
    });

    it('should have +2 maxMp over base player', () => {
      const warrior = new Warrior();
      const player = new Player();
      expect(warrior.maxMp).toBe(player.maxMp + 2);
    });

    it('should start with hp equal to maxHp', () => {
      const warrior = new Warrior();
      expect(warrior.hp).toBe(warrior.maxHp);
    });
  });
});
