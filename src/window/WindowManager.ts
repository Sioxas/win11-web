import { WindowController, WindowStatus, Z_INDEX_BASE } from "./WindowController";

export default class WindowManager {

  #windows = new Array<WindowController>();

  #activeWindow: WindowController | null = null;
  public windowContainer?: HTMLDivElement;

  constructor() {
    document.body.addEventListener('pointermove', (event) => this.#onDragMove(event));
    document.body.addEventListener('pointerup',  (event) => this.#onDragStop(event));
    document.body.addEventListener('pointerleave',  (event) => this.#onDragStop(event));
  }

  init(windowContainer: HTMLDivElement) {
    this.windowContainer = windowContainer;
  }

  setWindowInactive(windowController: WindowController) {
    if(this.#activeWindow === windowController) {
      // find last non-minimized window
      for(let i = this.#windows.length - 1; i >= 0; i--) {
        if(this.#windows[i].status !== WindowStatus.MINIMIZED) {
          this.setWindowActive(this.#windows[i]);
          break;
        }
      }
    }
  }

  setWindowActive(windowController: WindowController) {
    const startIndex = windowController.zIndex - Z_INDEX_BASE;
    // remove window from this.#windows
    this.#windows.splice(startIndex, 1);
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    this.#windows.push(windowController);
    // update zIndex
    for (let i = startIndex; i < this.#windows.length; i++) {
      this.#windows[i].zIndex = i + Z_INDEX_BASE;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
  }

  registerWindow(windowController: WindowController) {
    windowController.zIndex = this.#windows.length + Z_INDEX_BASE;
    this.#windows.push(windowController);
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
    windowController.onRegister(this);
  }

  unregisterWindow(windowController: WindowController) {
    const startIndex = windowController.zIndex - Z_INDEX_BASE;
    // remove windowController from windows
    this.#windows.splice(startIndex, 1);
    // update zIndex
    for (let i = startIndex; i < this.#windows.length; i++) {
      this.#windows[i].zIndex = i + Z_INDEX_BASE;
    }
    // set last window active
    if (this.#windows.length > 0) {
      const lastWindow = this.#windows[this.#windows.length - 1];
      lastWindow.active = true;
      this.#activeWindow = lastWindow;
    }
  }

  #onDragMove(event: MouseEvent) {
    this.#activeWindow?.onDragMove(event);
  }

  #onDragStop(event: MouseEvent) {
    this.#activeWindow?.onDragStop(event);
  }
}