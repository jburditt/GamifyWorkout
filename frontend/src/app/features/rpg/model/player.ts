import { BaseCreature } from "./creature";

export class Player extends BaseCreature {

  private _level: number;
  public get level() { return this._level; }
  private set level(value: number) { this._level = value; }

  private _experience: number;
  public get experience() { return this._experience; }
  private set experience(value: number) {
    this._experience = value;
    if (this._experience >= this.maxExperience)
      this.levelUp();
  }

  private _maxExperience: number;
  public get maxExperience() { return this._maxExperience; }
  private set maxExperience(value: number) { this._maxExperience = value; }

  constructor(level: number = 1)
  {
    super();
    this._level = level;
    this.maxHp = 10 + (level - 1) * 5;
    this.hp = this.maxHp;
    this.maxMp = 5 + (level - 1) * 3;
    this.mp = this.maxMp;
    this._experience = 0;
    this._maxExperience = Math.floor(10 + (level - 1)) * 1.2;
  }

  protected levelUp() {
    this.level++;
    this.experience = 0;
    this.maxExperience = Math.floor(this.maxExperience * 1.2);
    this.hp = this.maxHp;
    this.mp = this.maxMp;
  }
}
