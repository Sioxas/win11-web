export default class MouseShakeDetector {

  #inflexionCount = 0;

  #p = [0, 0];

  constructor(private onMouseShake?: () => void) {}

  move(event: MouseEvent) {
    const v = [event.movementX, event.movementY];
    // dot product of v and p
    const dp = v[0] * this.#p[0] + v[1] * this.#p[1];
    if (dp < 0) {
      this.#inflexionCount++;
      if (this.#inflexionCount === 3) {
        this.onMouseShake?.();
      }
      setTimeout(() => {
        this.#inflexionCount--;
      }, 700);
    }
    this.#p = v;
  }
}