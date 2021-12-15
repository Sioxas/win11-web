export default class LRU<K, V> {
  cache = new Map<K, V>();

  constructor(public capacity = 256) { }

  get(key: K) {
    if(!this.cache.has(key)) return;
    let item = this.cache.get(key);
    if (item) {
      // refresh key
      this.cache.delete(key);
      this.cache.set(key, item);
    }
    return item;
  }

  set(key: K, val: V) {
    // refresh key
    if (this.cache.has(key)) this.cache.delete(key);
    // evict oldest
    else if (this.cache.size == this.capacity) this.cache.delete(this.leastUsed!);
    this.cache.set(key, val);
  }

  remove(key: K) {
    this.cache.delete(key);
  }

  get leastUsed(): K | undefined {
    return this.cache.keys().next().value;
  }

  get mostUsed(): K | undefined {
    return Array.from(this.cache.keys()).pop();
  }

  get size() {
    return this.cache.size;
  }
}