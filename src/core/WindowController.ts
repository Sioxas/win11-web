import MouseShakeDetector from '@/utils/MouseShakeDetector';
import WindowService from './WindowService';
import Rect from './WindowRect';
import { WindowResizer, WindowLevel, WindowStatus, WindowType } from './enums';
import { WindowOptions } from './WindowService';
import Application from './Application';

export class WindowController<T extends Application> {
  #drag = false;
  #resizer = WindowResizer.NONE;
  #rect?: Rect;
  #windowElement?: HTMLDivElement;
  #onActiveChange?: (active: boolean) => void;
  #onStatusChange?: (status: WindowStatus) => void;
  #onLevelChange?: (level: WindowLevel) => void;
  #mouseShakeDetector?: MouseShakeDetector;

  #level: WindowLevel = WindowLevel.MIDDLE;
  set level(value: WindowLevel) {
    this.#onLevelChange?.(this.#level = value);
  }
  get level() {
    return this.#level;
  }

  #zIndex = 0;
  set zIndex(zIndex: number) {
    if(this.#windowElement) {
      this.#windowElement.style.zIndex = zIndex + this.#level + '';
    }
    this.#zIndex = zIndex;
  }
  get zIndex() {
    return this.#zIndex;
  }

  #active = true;
  set active(value: boolean) {
    this.#onActiveChange?.(this.#active = value);
  }
  get active() {
    return this.#active;
  }

  #windowStatus = WindowStatus.NORMAL;
  get status() {
    return this.#windowStatus;
  }
  set status(value: WindowStatus) {
    this.#windowStatus = value;
    this.#onStatusChange?.(value);
  }

  constructor(
    private windowService: WindowService, 
    public options: Required<WindowOptions>,
    public application: T,
  ) {
    this.#mouseShakeDetector = new MouseShakeDetector(() => windowService.onWindowShake());
  }

  init(windowElement: HTMLDivElement,
    onActiveChange?: (active: boolean) => void,
    onStatusChange?: (status: WindowStatus) => void,
    onLevelChange?: (level: WindowLevel) => void
  ) {
    this.#windowElement = windowElement;
    this.#onActiveChange = onActiveChange;
    this.#onStatusChange = onStatusChange;
    this.#onLevelChange = onLevelChange;
    this.#rect = new Rect(windowElement);
    if(this.options.type === WindowType.FULLSCREEN) {
      this.#rect.width = window.innerWidth;
      this.#rect.height = window.innerHeight;
      this.#rect.left = 0;
      this.#rect.top = 0;
    } else {
      this.#rect.width = this.options.width;
      this.#rect.height = this.options.height;
      this.#rect.left = Math.max(this.windowService.windowContainer!.clientWidth / 2 - this.#rect.width / 2, 0);
      this.#rect.top = Math.max(this.windowService.windowContainer!.clientHeight / 2 - this.#rect.height / 2, 0);
    }
  }

  setWindowActive(){
    this.windowService.setWindowActive(this);
  }

  setStatus(status: WindowStatus) {
    this.status = status;
  }

  onDragStart(resizer: number) {
    this.#drag = true;
    this.#resizer = resizer;
  }

  onDragMove(event: MouseEvent) {
    if(!this.#rect) return;
    if (!this.#drag) return;
    this.#mouseShakeDetector?.move(event);
    const Δx = event.movementX / devicePixelRatio;
    const Δy = event.movementY / devicePixelRatio;
    if (this.#resizer === WindowResizer.NONE) { // drag title bar
      if (this.status === WindowStatus.MAXIMIZED) {
        this.status = WindowStatus.NORMAL;
        this.#rect.left = event.clientX - this.#rect.width / 2;
        this.#rect.top = 0;
      }
      this.#rect.left += Δx;
      this.#rect.top += Δy;
      return;
    }
    if (this.#resizer & WindowResizer.TOP) {
      this.#rect.top += Δy;
      this.#rect.height -= Δy;
    }
    if (this.#resizer & WindowResizer.RIGHT) {
      this.#rect.width += Δx;
    }
    if (this.#resizer & WindowResizer.BOTTOM) {
      this.#rect.height += Δy;
    }
    if (this.#resizer & WindowResizer.LEFT) {
      this.#rect.left += Δx;
      this.#rect.width -= Δx;
    }
  }

  onDragStop(event: MouseEvent) {
    if(!this.#rect) return;
    if (!this.#drag) return;
    if (this.#resizer === WindowResizer.NONE) {
      if (event.clientY <= 0) {
        this.status = WindowStatus.MAXIMIZED;
      }
      if (this.#rect.top < 0) {
        this.#rect.top = 0;
      }
    }
    if (this.#resizer & WindowResizer.TOP) {
      if (event.clientY <= 0) {
        this.#rect.height = this.windowService!.windowContainer!.clientHeight;
      }
    }
    this.#drag = false;
    this.#resizer = 0;
  }
}