import { BehaviorSubject } from 'rxjs';

import WindowService from './WindowService';
import Rect from './WindowRect';
import { WindowResizer, WindowLevel, WindowResizeType, WindowType, WindowPosition } from './enums';
import { WindowOptions } from './WindowService';
import Application from './Application';
import TaskBarService from './TaskBar/TaskBarService';

export class WindowController<T extends Application> {
  static windowId = 0;
  windowId = WindowController.windowId++;
  #drag = false;
  #resizer = WindowResizer.NONE;
  rect?: Rect;
  #windowElement?: HTMLDivElement;

  #level$: BehaviorSubject<WindowLevel>;
  get level$() {
    return this.#level$.asObservable();
  }
  get level() {
    return this.#level$.value;
  }
  set level(level: WindowLevel) {
    this.#level$.next(level);
  }

  #active$ = new BehaviorSubject<boolean>(true);
  get active$() {
    return this.#active$.asObservable();
  }
  get active() {
    return this.#active$.value;
  }
  set active(value: boolean) {
    this.#active$.next(value);
  }

  #windowResizeType$: BehaviorSubject<WindowResizeType>;
  get windowResizeType$() {
    return this.#windowResizeType$.asObservable();
  }
  get windowResizeType() {
    return this.#windowResizeType$.value;
  }
  set windowResizeType(type: WindowResizeType) {
    this.#windowResizeType$.next(type);
  }

  #zIndex = 0;
  set zIndex(zIndex: number) {
    if (this.#windowElement) {
      this.#windowElement.style.zIndex = zIndex + this.level + '';
    }
    this.#zIndex = zIndex;
  }
  get zIndex() {
    return this.#zIndex;
  }

  private windowService = WindowService.getInstance();

  private taskBarService = TaskBarService.getInstance();

  constructor(
    public options: Required<WindowOptions>,
    public application: T,
  ) {
    this.#level$ = new BehaviorSubject<WindowLevel>(options.level);
    this.#windowResizeType$ = new BehaviorSubject<WindowResizeType>(options.defaultResizeType);
  }

  init(windowElement: HTMLDivElement) {
    this.#windowElement = windowElement;
    this.zIndex = this.#zIndex;
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
      } else {
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
    windowElement.animate(this.options.windowAnimateKeyFrames, {
      duration: 200,
      fill: 'forwards',
    });
  }

  setWindowActive() {
    this.windowService.setWindowActive(this);
  }

  #resizeTypeBeforeMinimized = WindowResizeType.NORMAL;

  #minimizeAnimation?: Animation;

  minimize() {
    if (!this.#windowElement) return;
    if (this.options.availableResizeType & WindowResizeType.MINIMIZED) {
      // animate to min
      const windowRect = this.#windowElement.getBoundingClientRect();
      const buttonRect = this.taskBarService.getButtonRectByApp(this.application.constructor as typeof Application);
      if (buttonRect) {
        this.#windowElement.style.transformOrigin = `${buttonRect.left - windowRect.left}px ${buttonRect.top - windowRect.top}px`;
      }
      this.#minimizeAnimation = this.#windowElement.animate([{
        transform: 'scale(0.1)',
        opacity: 0,
      }], {
        duration: 200,
        fill: 'forwards',
      });
      this.#resizeTypeBeforeMinimized = this.windowResizeType;
      this.windowResizeType = WindowResizeType.MINIMIZED;
      this.windowService.setWindowInactive(this);
    }
  }

  #maximizeAnimation?: Animation;

  async maximize() {
    if (!this.#windowElement) return;
    if (this.options.availableResizeType & WindowResizeType.MAXIMIZED) {
      this.#maximizeAnimation = this.#windowElement.animate([{
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }], {
        duration: 200,
        fill: 'forwards',
      });
      await this.#maximizeAnimation.finished;
      this.windowResizeType = WindowResizeType.MAXIMIZED;
      this.windowService.setWindowActive(this);
    }
  }

  async normalize() {
    if (!this.#windowElement) return;
    if (this.options.availableResizeType & WindowResizeType.NORMAL) {
      if (this.windowResizeType === WindowResizeType.MAXIMIZED) {
        this.#maximizeAnimation?.reverse();
        await this.#maximizeAnimation?.finished;
      }
      this.windowResizeType = WindowResizeType.NORMAL;
      this.windowService.setWindowActive(this);
    }
  }

  async restoreWindow() {
    if (!this.#windowElement) return;
    if (this.windowResizeType === WindowResizeType.MINIMIZED) {
      this.windowResizeType = this.#resizeTypeBeforeMinimized;
      this.#minimizeAnimation?.reverse();
      await this.#minimizeAnimation?.finished;
      this.#windowElement.style.transformOrigin = 'center center';
    }
    this.windowService.setWindowActive(this);
  }

  close() {
    this.application.onCloseWindow(this);
  }

  async _close() {
    if (this.#windowElement) {
      await this.#windowElement.animate(
        [...this.options.windowAnimateKeyFrames].reverse(), 
        {
          duration: 200,
          fill: 'forwards',
        }
      ).finished;
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
      if (this.windowResizeType === WindowResizeType.MAXIMIZED) {
        this.#maximizeAnimation?.cancel();
        this.windowResizeType = WindowResizeType.NORMAL;
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
        this.maximize();
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
