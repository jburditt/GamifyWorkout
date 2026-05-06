import { Player } from '@app/features/rpg/model/player';
import { Warrior } from '@app/features/rpg/model/warrior';
import { Enemy } from '@app/features/rpg/model/enemy';

describe('RPG Models', () => {
  it('should create player', () => {
    const player = new Player();
    expect(player.level).toBe(1);
    expect(player.hp).toBe(10);
  });

  it('should level up', () => {
    const player = new Player();
    const enemy = new Enemy();
    enemy.name = 'Goblin';
    enemy.hp = 5;
    enemy.maxHp = 5;
    enemy.mp = 0;
    enemy.maxMp = 0;
    enemy.experiencePoints = player.maxExperience;
    player.killEnemy(enemy);
    expect(player.level).toBe(2);
  });

  it('should create warrior', () => {
    const warrior = new Warrior();
    expect(warrior.maxHp).toBe(15); // base +5
  });
});
