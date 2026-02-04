export class List<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, Object.create(List.prototype));
  }
}
