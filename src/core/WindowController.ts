import { BehaviorSubject } from 'rxjs';

import RelativePosition from '@/utils/RelativePosition';
import Point from '@/utils/Point';
import WindowService from './WindowService';
import Rect from './WindowRect';
import { WindowResizer, WindowLevel, WindowResizeType, WindowType, WindowPosition } from './enums';
import { WindowOptions } from './WindowService';
import Application from './Application';
import TaskBarService from './TaskBar/TaskBarService';

export class WindowController<T extends Application> {
  static windowId = 0;
  
  /** Window uniq key */
  windowId = WindowController.windowId++;

  /** Window rect, set and get window size or position */
  rect?: Rect;

  level$: BehaviorSubject<WindowLevel>;
  get level() {
    return this.level$.value;
  }
  set level(level: WindowLevel) {
    this.level$.next(level);
  }

  active$ = new BehaviorSubject<boolean>(true);
  get active() {
    return this.active$.value;
  }
  set active(value: boolean) {
    this.active$.next(value);
  }

  windowResizeType$: BehaviorSubject<WindowResizeType>;
  get windowResizeType() {
    return this.windowResizeType$.value;
  }
  set windowResizeType(type: WindowResizeType) {
    this.windowResizeType$.next(type);
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

  /** Whether the window is dragging */
  #drag = false;

  /** The resizer current dragginh */
  #resizer = WindowResizer.NONE;

  /** Window element */
  #windowElement?: HTMLDivElement;

  private windowService = WindowService.getInstance();

  private taskBarService = TaskBarService.getInstance();

  constructor(
    public options: Required<WindowOptions>,
    public application: T,
  ) {
    this.level$ = new BehaviorSubject<WindowLevel>(options.level);
    this.windowResizeType$ = new BehaviorSubject<WindowResizeType>(options.defaultResizeType);
  }

  init(windowElement: HTMLDivElement) {
    this.#windowElement = windowElement;
    this.zIndex = this.#zIndex;
    this.rect = new Rect(windowElement);
    if (this.options.type === WindowType.FULLSCREEN) {
      this.rect.left = 0;
      this.rect.top = 0;
    } else {
      let containerWidth = this.windowService.windowContainer!.clientWidth,
         containerHeight = this.windowService.windowContainer!.clientHeight;
      this.rect.width = this.options.width;
      this.rect.height = this.options.height;
      const position = this.options.position;
      if (position instanceof Point) {
        this.rect.left = position.x;
        this.rect.top = position.y;
      } else if (position instanceof RelativePosition) {
        switch (position.horizontal) {
          case WindowPosition.LEFT:
            this.rect.left = position.offset.x;
            break;
          case WindowPosition.RIGHT:
            this.rect.left = containerWidth - this.rect.width + position.offset.x;
            break;
          case WindowPosition.CENTER:
            this.rect.left = Math.max((containerWidth - this.rect.width) / 2 + position.offset.x, 0);
            break;
        }
        switch (position.vertical) {
          case WindowPosition.TOP:
            this.rect.top = position.offset.y;
            break;
          case WindowPosition.BOTTOM:
            this.rect.top = containerHeight - this.rect.height + position.offset.y;
            break;
          case WindowPosition.CENTER:
            this.rect.top = Math.max((containerHeight - this.rect.height) / 2 + position.offset.y, 0);
            break;
        }
      }
    }
    windowElement.animate(this.options.windowAnimateKeyFrames, {
      duration: 300,
      fill: 'forwards',
      easing: 'cubic-bezier(.14,.61,.37,.91)'
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
        duration: 300,
        fill: 'forwards',
        easing: 'cubic-bezier(.14,.61,.37,.91)'
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
        // easing: 'cubic-bezier(.14,.61,.37,.91)'
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
          easing: 'cubic-bezier(.49,.15,.83,.5)'
        }
      ).finished;
    }
  }

  #prevScreenX = 0;
  #prevScreenY = 0;

  onDragStart(event: React.PointerEvent ,resizer: number) {
    this.#drag = true;
    this.#resizer = resizer;
    this.#prevScreenX = event.screenX;
    this.#prevScreenY = event.screenY;
  }

  onDragMove(event: MouseEvent) {
    if (!this.rect) return;
    if (!this.#drag) return;
    this.windowService.mouseShakeDetector.move(event);
    // let Δx = event.movementX, Δy = event.movementY;
    // chrome bug on Windows https://monorail-prod.appspot.com/p/chromium/issues/detail?id=907309
    // use screenX/Y instead of movementX/Y
    let Δx = event.screenX - this.#prevScreenX, 
        Δy = event.screenY - this.#prevScreenY;
    this.#prevScreenX = event.screenX;
    this.#prevScreenY = event.screenY;
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
