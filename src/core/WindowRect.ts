export default class Rect {
  #x = 0;
  #y = 0;
  #w = 0;
  #h = 0;
  set left(value: number) {
    this.#x = value;
    this.element.style.left = `${this.#x}px`;
  }
  get left() {
    return this.#x;
  }
  set top(value: number) {
    this.#y = value;
    this.element.style.top = `${this.#y}px`;
  }
  get top() {
    return this.#y;
  }
  set width(value: number) {
    this.#w = value;
    this.element.style.width = `${this.#w}px`;
  }
  get width() {
    return this.#w;
  }
  set height(value: number) {
    this.#h = value;
    this.element.style.height = `${this.#h}px`;
  }
  get height() {
    return this.#h;
  }
  constructor(private element: HTMLElement) {}
}