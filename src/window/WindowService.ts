import React from "react";
import Application from "@/application/Application";
import { WindowController, WindowStatus, Z_INDEX_BASE } from "./WindowController";

export enum WindowType {
  NORMAL,
  FULLSCREEN,
  BORDER_LESS,
}

export enum WindowLevel {
  TOP,
  MIDDLE,
  BOTTOM,
}

export interface WindowOptions {
  type?: WindowType;
  level?: WindowLevel;
  title?: string;
  width?: number;
  height?: number;
}

export interface WindowViewProps<T extends Application>{
  controller: WindowController;
  application: T;
}

export interface WindowViewConfig<T extends Application = Application, P = any> {
  options: WindowOptions;
  component: React.ComponentType<P & WindowViewProps<T>>;
  props?: P;
}

export default class WindowService {

  #controllers = new Array<WindowController>();

  #views = new Map<WindowController, WindowViewConfig>();

  #activeWindow: WindowController | null = null;

  public windowContainer?: HTMLDivElement;

  constructor(private onViewsChange?: (windows: [WindowController, WindowViewConfig][]) => void) {
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
      for(let i = this.#controllers.length - 1; i >= 0; i--) {
        if(this.#controllers[i].status !== WindowStatus.MINIMIZED) {
          this.setWindowActive(this.#controllers[i]);
          break;
        }
      }
    }
  }

  setWindowActive(windowController: WindowController) {
    const startIndex = windowController.zIndex - Z_INDEX_BASE;
    // remove window from this.#windows
    this.#controllers.splice(startIndex, 1);
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    this.#controllers.push(windowController);
    // update zIndex
    for (let i = startIndex; i < this.#controllers.length; i++) {
      this.#controllers[i].zIndex = i + Z_INDEX_BASE;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
  }

  #triggerViewsChange() {
    if(this.onViewsChange) {
      this.onViewsChange(Array.from(this.#views.entries()));
    }
  }

  createWindow<T extends Application, P>(
    options: WindowOptions, 
    component: React.ComponentType<P & WindowViewProps<T>>, 
    props?: P
  ) {
    const windowController = new WindowController(this);
    this.#views.set(windowController, { options, component, props });
    windowController.zIndex = this.#controllers.length + Z_INDEX_BASE;
    this.#controllers.push(windowController);
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
    this.#triggerViewsChange();
    return windowController;
  }

  closeWindow(windowController: WindowController) {
    const startIndex = windowController.zIndex - Z_INDEX_BASE;
    // remove windowController from windows
    this.#controllers.splice(startIndex, 1);
    this.#views.delete(windowController);
    // update zIndex
    for (let i = startIndex; i < this.#controllers.length; i++) {
      this.#controllers[i].zIndex = i + Z_INDEX_BASE;
    }
    // set last window active
    if (this.#controllers.length > 0) {
      const lastWindow = this.#controllers[this.#controllers.length - 1];
      lastWindow.active = true;
      this.#activeWindow = lastWindow;
    }
    this.#triggerViewsChange();
    }

  #windowsStatus = new Array<WindowStatus>();

  onWindowShake(){
    if(this.#controllers.length < 1) return;

    // if there is any window not minimized except the active window
    let anyWindowNotMinimized = false;
    for(let i = 0; i < this.#controllers.length - 1; i++) {
      if(this.#controllers[i].status !== WindowStatus.MINIMIZED) {
        anyWindowNotMinimized = true;
        break;
      }
    }

    if(anyWindowNotMinimized) {
      // store windows status
      this.#windowsStatus = this.#controllers.map(window => window.status);

      // set all windows minimized except last one
      for(let i = 0; i < this.#controllers.length - 1; i++) {
        this.#controllers[i].status = WindowStatus.MINIMIZED;
      }
    } else {
      // restore windows status
      for(let i = 0; i < this.#controllers.length - 1; i++) {
        this.#controllers[i].status = this.#windowsStatus[i];
      }
    }
  }

  #onDragMove(event: MouseEvent) {
    this.#activeWindow?.onDragMove(event);
  }

  #onDragStop(event: MouseEvent) {
    this.#activeWindow?.onDragStop(event);
  }
}