import './style.less';

export default class CanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.canvas.classList.add('fullscreen-canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
  }
}