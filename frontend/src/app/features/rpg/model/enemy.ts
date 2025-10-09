import { BaseCreature } from "./creature";

export class Enemy extends BaseCreature {
  [key: number]: Enemy | ((key: number) => Enemy);

  check(key: number) {
    return this[key] instanceof Enemy;
  }
}
