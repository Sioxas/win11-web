export default abstract class Service {
  static #instance: Service;

  static getInstance() {
    return Service.#instance;
  }

  constructor() {
    if (Service.#instance) {
      return Service.#instance
    }
    Service.#instance = this;
  }
}