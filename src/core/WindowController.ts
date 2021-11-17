import { BehaviorSubject } from 'rxjs';

import WindowService from './WindowService';
import Rect from './WindowRect';
import { WindowResizer, WindowLevel, WindowResizeType, WindowType, WindowPosition } from './enums';
import { WindowOptions } from './WindowService';
import Application from './Application';

export class WindowController<T extends Application> {
  static windowId = 0;
  windowId = WindowController.windowId++;
  #drag = false;
  #resizer = WindowResizer.NONE;
  rect?: Rect;
  #windowElement?: HTMLDivElement;

  level$: BehaviorSubject<WindowLevel>;

  active$ = new BehaviorSubject<boolean>(true);

  windowResizeType$: BehaviorSubject<WindowResizeType>;

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
    this.level$ = new BehaviorSubject<WindowLevel>(options.level);
    this.windowResizeType$ = new BehaviorSubject<WindowResizeType>(options.defaultResizeType);
  }

  init(windowElement: HTMLDivElement) {
    this.#windowElement = windowElement;
    this.rect = new Rect(windowElement);
    if (this.options.type === WindowType.FULLSCREEN) {
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

  minimize() {
    if(this.options.availableResizeType & WindowResizeType.MINIMIZED) {
      this.windowResizeType$.next(WindowResizeType.MINIMIZED);
      this.windowService.setWindowInactive(this);
    }
  }

  maximize() {
    if(this.options.availableResizeType & WindowResizeType.MAXIMIZED) {
      this.windowResizeType$.next(WindowResizeType.MAXIMIZED);
      this.windowService.setWindowActive(this);
    }
  }

  normalize() {
    if(this.options.availableResizeType & WindowResizeType.NORMAL) {
      this.windowResizeType$.next(WindowResizeType.NORMAL);
      this.windowService.setWindowActive(this);
    }
  }

  async close() {
    if(this.#windowElement){
      await this.#windowElement.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0.8)', opacity: 0 },
      ], {
        duration: 200,
        easing: 'ease-in-out',
        fill: 'forwards',
      }).finished;
      this.windowService.closeWindow(this);
    }
  }

  onDragStart(resizer: number) {
    this.#drag = true;
    this.#resizer = resizer;
  }

  onDragMove(event: MouseEvent) {
    if (!this.rect) return;
    if (!this.#drag) return;
    this.windowService.mouseShakeDetector.move(event);
    const Δx = event.movementX / devicePixelRatio;
    const Δy = event.movementY / devicePixelRatio;
    if (this.#resizer === WindowResizer.NONE) { // drag title bar
      if (this.windowResizeType$.value === WindowResizeType.MAXIMIZED) {
        this.windowResizeType$.next(WindowResizeType.NORMAL);
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
        this.windowResizeType$.next(WindowResizeType.MAXIMIZED);
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