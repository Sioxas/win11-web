import React from "react";
import { omitBy, isNil } from "lodash-es";

import Application from "./Application";
import { WindowController } from "./WindowController";
import { WindowType, WindowLevel, WindowStatus } from "./enums";

export interface WindowOptions {
  type?: WindowType;
  level?: WindowLevel;
  title: string;
  width?: number;
  height?: number;
  resizeable?: boolean;
}

const defaultOptions = {
  type: WindowType.NORMAL,
  level: WindowLevel.MIDDLE,
  width: 800,
  height: 600,
  resizeable: true
};

export interface WindowViewProps<T extends Application> {
  controller: WindowController;
  application: T;
}

export interface WindowViewConfig<T extends Application = Application, P = any> {
  options: WindowOptions;
  component: React.ComponentType<P & WindowViewProps<T>>;
  props?: P;
}

export default class WindowService {

  #windows = new Map<WindowController, WindowViewConfig>();

  #activeWindow: WindowController | null = null;

  public windowContainer?: HTMLDivElement;

  constructor(private onViewsChange?: (windows: [WindowController, WindowViewConfig][]) => void) {
    document.body.addEventListener('pointermove', (event) => this.#onDragMove(event));
    document.body.addEventListener('pointerup', (event) => this.#onDragStop(event));
    document.body.addEventListener('pointerleave', (event) => this.#onDragStop(event));
  }

  init(windowContainer: HTMLDivElement) {
    this.windowContainer = windowContainer;
  }

  setWindowInactive(windowController: WindowController) {
    const controllers = this.#getControllersByLevel(windowController.level);
    if (this.#activeWindow === windowController) {
      // find last non-minimized window
      for (let i = controllers.length - 1; i >= 0; i--) {
        if (controllers[i].status !== WindowStatus.MINIMIZED) {
          this.setWindowActive(controllers[i]);
          break;
        }
      }
    }
  }

  setWindowActive(windowController: WindowController) {
    const controllers = this.#getControllersByLevel(windowController.level);
    const startIndex = windowController.zIndex;
    // remove window from this.#windows
    controllers.splice(startIndex, 1);
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    controllers.push(windowController);
    // update zIndex
    for (let i = startIndex; i < controllers.length; i++) {
      controllers[i].zIndex = i;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
  }

  #triggerViewsChange() {
    this.onViewsChange?.(Array.from(this.#windows.entries()));
  }

  createWindow<T extends Application, P>(
    options: WindowOptions,
    component: React.ComponentType<P & WindowViewProps<T>>,
    props?: P
  ) {
    const windowOptions = { ...defaultOptions, ...omitBy(options, isNil) };
    const controllers = this.#getControllersByLevel(windowOptions.level);
    const windowController = new WindowController(this);
    windowController.level = windowOptions.level;
    windowController.zIndex = controllers.length;
    this.#windows.set(windowController, { options, component, props });
    if (this.#activeWindow) {
      this.#activeWindow.active = false;
    }
    windowController.active = true;
    this.#activeWindow = windowController;
    this.#triggerViewsChange();
    return windowController;
  }

  closeWindow(windowController: WindowController) {
    const controllers = this.#getControllersByLevel(windowController.level);
    const startIndex = windowController.zIndex;
    // remove windowController from windows
    controllers.splice(startIndex, 1);
    this.#windows.delete(windowController);
    // update zIndex
    for (let i = startIndex; i < controllers.length; i++) {
      controllers[i].zIndex = i;
      // set last window active
      if (i === controllers.length - 1) {
        controllers[i].active = true;
        this.#activeWindow = controllers[i];
      }
    }
    this.#triggerViewsChange();
  }

  #windowsStatus = new Map<WindowController, WindowStatus>();

  onWindowShake() {
    if (this.#windows.size < 1) return;

    // if there is any window not minimized except the active window
    let anyWindowNotMinimized = false;
    for (const [controller] of this.#windows) {
      if (controller.status !== WindowStatus.MINIMIZED && controller !== this.#activeWindow) {
        anyWindowNotMinimized = true;
        break;
      }
    }

    if (anyWindowNotMinimized) {
      // store windows status
      for (const [controller] of this.#windows) {
        this.#windowsStatus.set(controller, controller.status);
        if (controller !== this.#activeWindow) {
          controller.status = WindowStatus.MINIMIZED;
        }
      }
    } else {
      // restore windows status
      for (const [constroller, status] of this.#windowsStatus) {
        constroller.status = status;
      }
      this.#windowsStatus.clear();
    }
  }

  #getControllersByLevel(level: WindowLevel) {
    return Array.from(this.#windows.keys())
      .filter(controller => controller.level === level)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  #onDragMove(event: MouseEvent) {
    this.#activeWindow?.onDragMove(event);
  }

  #onDragStop(event: MouseEvent) {
    this.#activeWindow?.onDragStop(event);
  }
}