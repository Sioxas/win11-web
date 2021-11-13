import { BehaviorSubject } from 'rxjs';

import MouseShakeDetector from '@/utils/MouseShakeDetector';
import WindowService from './WindowService';
import Rect from './WindowRect';
import { WindowResizer, WindowLevel, WindowStatus, WindowType, WindowPosition } from './enums';
import { WindowOptions } from './WindowService';
import Application from './Application';

export class WindowController<T extends Application> {
  static windowId = 0;
  windowId = WindowController.windowId++;
  #drag = false;
  #resizer = WindowResizer.NONE;
  rect?: Rect;
  #windowElement?: HTMLDivElement;

  #mouseShakeDetector?: MouseShakeDetector;

  level$ = new BehaviorSubject<WindowLevel>(WindowLevel.MIDDLE);

  active$ = new BehaviorSubject<boolean>(true);

  windowStatus$ = new BehaviorSubject<WindowStatus>(WindowStatus.NORMAL);

  #zIndex = 0;
  set zIndex(zIndex: number) {
    if (this.#windowElement) {
      this.#windowElement.style.zIndex = zIndex + this.level$.value + '';
    }
    this.#zIndex = zIndex;
  }
  get zIndex() {
    return this.#zIndex;
  }

  constructor(
    private windowService: WindowService,
    public options: Required<WindowOptions>,
    public application: T,
  ) {
    this.#mouseShakeDetector = new MouseShakeDetector(() => windowService.onWindowShake());
    this.level$.next(options.level);
  }

  init(windowElement: HTMLDivElement) {
    this.#windowElement = windowElement;
    this.rect = new Rect(windowElement);
    if (this.options.type === WindowType.FULLSCREEN) {
      this.rect.width = window.innerWidth;
      this.rect.height = window.innerHeight;
      this.rect.left = 0;
      this.rect.top = 0;
    } else {
      let windowWidth = this.windowService.windowContainer!.clientWidth,
        windowHeight = this.windowService.windowContainer!.clientHeight;
      if (this.options.level !== WindowLevel.MIDDLE) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
      }
      this.rect.width = this.options.width;
      this.rect.height = this.options.height;
      if (this.options.position === WindowPosition.CENTER) {
        this.rect.left = Math.max(windowWidth / 2 - this.rect.width / 2, 0);
        this.rect.top = Math.max(windowHeight / 2 - this.rect.height / 2, 0);
        return;
      }
      if (this.options.position & WindowPosition.LEFT) {
        this.rect.left = 0;
      }
      if (this.options.position & WindowPosition.RIGHT) {
        this.rect.left = windowWidth - this.rect.width;
      }
      if (this.options.position & WindowPosition.TOP) {
        this.rect.top = 0;
      }
      if (this.options.position & WindowPosition.BOTTOM) {
        this.rect.top = windowHeight - this.rect.height;
      }
    }
  }

  setWindowActive() {
    this.windowService.setWindowActive(this);
  }

  setStatus(status: WindowStatus) {
    this.windowStatus$.next(status);
  }

  onDragStart(resizer: number) {
    this.#drag = true;
    this.#resizer = resizer;
  }

  onDragMove(event: MouseEvent) {
    if (!this.rect) return;
    if (!this.#drag) return;
    this.#mouseShakeDetector?.move(event);
    const Δx = event.movementX / devicePixelRatio;
    const Δy = event.movementY / devicePixelRatio;
    if (this.#resizer === WindowResizer.NONE) { // drag title bar
      if (this.windowStatus$.value === WindowStatus.MAXIMIZED) {
        this.windowStatus$.next(WindowStatus.NORMAL);
        this.rect.left = event.clientX - this.rect.width / 2;
        this.rect.top = 0;
      }
      this.rect.left += Δx;
      this.rect.top += Δy;
      return;
    }
    if (this.#resizer & WindowResizer.TOP) {
      this.rect.top += Δy;
      this.rect.height -= Δy;
    }
    if (this.#resizer & WindowResizer.RIGHT) {
      this.rect.width += Δx;
    }
    if (this.#resizer & WindowResizer.BOTTOM) {
      this.rect.height += Δy;
    }
    if (this.#resizer & WindowResizer.LEFT) {
      this.rect.left += Δx;
      this.rect.width -= Δx;
    }
  }

  onDragStop(event: MouseEvent) {
    if (!this.rect) return;
    if (!this.#drag) return;
    if (this.#resizer === WindowResizer.NONE) {
      if (event.clientY <= 0) {
        this.windowStatus$.next(WindowStatus.MAXIMIZED);
      }
      if (this.rect.top < 0) {
        this.rect.top = 0;
      }
    }
    if (this.#resizer & WindowResizer.TOP) {
      if (event.clientY <= 0) {
        this.rect.height = this.windowService!.windowContainer!.clientHeight;
      }
    }
    this.#drag = false;
    this.#resizer = 0;
  }
}