import Service from "../Service";

export default class CanvasService extends Service {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor(){
    super();
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
    this.canvas.classList.add('fullscreen-canvas');
    document.body.appendChild(this.canvas);
  }
}