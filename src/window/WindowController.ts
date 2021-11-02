import MouseShakeDetector from '@/utils/MouseShakeDetector';
import WindowService from './WindowService';
import Rect from './WindowRect';

export const Z_INDEX_BASE = 100;

export enum WindowStatus {
  NORMAL,
  MINIMIZED,
  MAXIMIZED,
}

export enum CropFlag {
  TITLE_BAR = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 4,
  LEFT = 8,
}

export class WindowController {
  #drag = false;
  #cropFlag = CropFlag.TITLE_BAR;
  #windowStatus = WindowStatus.NORMAL;
  #zIndex = Z_INDEX_BASE;
  #active = true;
  #rect?: Rect;
  #windowElement?: HTMLDivElement;
  #onActiveChange?: (active: boolean) => void;
  #onStatusChange?: (status: WindowStatus) => void;
  #mouseShakeDetector?: MouseShakeDetector;

  set zIndex(zIndex: number) {
    if(this.#windowElement) {
      this.#windowElement.style.zIndex = zIndex.toString();
    }
    this.#zIndex = zIndex;
  }
  get zIndex() {
    return this.#zIndex;
  }

  set active(value: boolean) {
    this.#onActiveChange?.(this.#active = value);
  }
  get active() {
    return this.#active;
  }

  get status() {
    return this.#windowStatus;
  }

  set status(value: WindowStatus) {
    this.#windowStatus = value;
    this.#onStatusChange?.(value);
  }

  constructor(private windowService: WindowService) {
    this.#mouseShakeDetector = new MouseShakeDetector(() => windowService.onWindowShake());
  }

  init(windowElement: HTMLDivElement,
    onActiveChange?: (active: boolean) => void,
    onStatusChange?: (status: WindowStatus) => void
  ) {
    this.#windowElement = windowElement;
    this.#onActiveChange = onActiveChange;
    this.#onStatusChange = onStatusChange;
    this.#rect = new Rect(windowElement);
    this.#rect.width = 800;
    this.#rect.height = 600;
    this.#rect.left = Math.max(this.windowService.windowContainer!.clientWidth / 2 - this.#rect.width / 2, 0);
    this.#rect.top = Math.max(this.windowService.windowContainer!.clientHeight / 2 - this.#rect.height / 2, 0);
  }

  setWindowActive(){
    this.windowService.setWindowActive(this);
  }

  setStatus(status: WindowStatus) {
    this.status = status;
  }

  onDragStart(flag: number) {
    this.#drag = true;
    this.#cropFlag = flag;
  }

  onDragMove(event: MouseEvent) {
    if(!this.#rect) return;
    if (!this.#drag) return;
    this.#mouseShakeDetector?.move(event);
    const Δx = event.movementX / devicePixelRatio;
    const Δy = event.movementY / devicePixelRatio;
    if (this.#cropFlag === CropFlag.TITLE_BAR) {
      if (this.status === WindowStatus.MAXIMIZED) {
        this.status = WindowStatus.NORMAL;
        this.#rect.left = event.clientX - this.#rect.width / 2;
        this.#rect.top = 0;
      }
      this.#rect.left += Δx;
      this.#rect.top += Δy;
      return;
    }
    if (this.#cropFlag & CropFlag.TOP) {
      this.#rect.top += Δy;
      this.#rect.height -= Δy;
    }
    if (this.#cropFlag & CropFlag.RIGHT) {
      this.#rect.width += Δx;
    }
    if (this.#cropFlag & CropFlag.BOTTOM) {
      this.#rect.height += Δy;
    }
    if (this.#cropFlag & CropFlag.LEFT) {
      this.#rect.left += Δx;
      this.#rect.width -= Δx;
    }
  }

  onDragStop(event: MouseEvent) {
    if(!this.#rect) return;
    if (!this.#drag) return;
    if (this.#cropFlag === CropFlag.TITLE_BAR) {
      if (event.clientY <= 0) {
        this.status = WindowStatus.MAXIMIZED;
      }
      if (this.#rect.top < 0) {
        this.#rect.top = 0;
      }
    }
    if (this.#cropFlag & CropFlag.TOP) {
      if (event.clientY <= 0) {
        this.#rect.height = this.windowService!.windowContainer!.clientHeight;
      }
    }
    this.#drag = false;
    this.#cropFlag = 0;
  }
}