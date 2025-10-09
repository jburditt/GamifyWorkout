export interface Creature {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

export class BaseCreature implements Creature {
  hp!: number;
  maxHp!: number;
  mp!: number;
  maxMp!: number;
}
