export interface Creature {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  experiencePoints: number;
}

export class BaseCreature implements Creature {
  name!: string;
  hp!: number;
  maxHp!: number;
  mp!: number;
  maxMp!: number;
  experiencePoints!: number;
}
