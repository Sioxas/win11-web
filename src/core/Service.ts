type Constructor<T> = { new (): T };

export default abstract class Service {
  static #instance = new Map();
  static getInstance<T>(this: Constructor<T>): T {
    return Service.#instance.get(this);
  }
  protected constructor() {
    if(Service.#instance.has(this.constructor)) {
      return Service.#instance.get(this.constructor);
    }
    Service.#instance.set(this.constructor, this);
  }
}