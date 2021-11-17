export default class RecentlyUsed<T> {
  #items: T[] = [];

  get items(): T[] {
    return this.#items;
  }

  get lastUsed(): T | null {
    return this.#items[0] || null;
  }

  touch(item: T): void {
    if(item === this.lastUsed) return;
    this.remove(item);
    this.#items.unshift(item);
  }

  remove(item: T): void {
    const index = this.#items.indexOf(item);
    if (index >= 0) {
      this.#items.splice(index, 1);
    }
  }
}