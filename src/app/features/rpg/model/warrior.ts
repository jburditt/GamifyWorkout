import { Player } from "./player";

export class Warrior extends Player
{
  constructor(level: number = 1) {
    super(level);
    this.maxHp += 5;
    this.hp = this.maxHp;
    this.maxMp += 2;
    this.mp = this.maxMp;
  }
}
