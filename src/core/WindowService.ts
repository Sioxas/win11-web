import React from "react";
import { BehaviorSubject } from "rxjs";
import { omitBy, isNil } from "lodash-es";

import Application from "./Application";
import { WindowController } from "./WindowController";
import { WindowType, WindowLevel, WindowStatus, WindowControlButton, WindowPosition } from './enums';
import Service from "./Service";

interface WindowTitleBar{
  title: string;
  icon: string;
}

export interface WindowOptions {
  type?: WindowType;
  level?: WindowLevel;
  width?: number;
  height?: number;
  position?: number;
  resizeable?: boolean;
  titleBar?: false | WindowTitleBar;
  controlButton?: number;
}

const defaultOptions: WindowOptions = {
  type: WindowType.NORMAL,
  level: WindowLevel.MIDDLE,
  width: 800,
  height: 600,
  position: WindowPosition.CENTER,
  resizeable: true,
  controlButton: WindowControlButton.CLOSE | WindowControlButton.MINIMIZE | WindowControlButton.MAXIMIZE
};

export interface WindowViewProps<T extends Application> {
  controller: WindowController<T>;
  application: T;
}

export interface WindowViewConfig<T extends Application = Application, P = any> {
  component: React.ComponentType<P & WindowViewProps<T>>;
  props?: P;
}

export default class WindowService extends Service {

  #windows = new Map<WindowController<Application>, WindowViewConfig>();

  #activeWindow: WindowController<Application> | null = null;

  windowContainer?: HTMLDivElement;

  windowsChange$ = new BehaviorSubject<[WindowController<Application>, WindowViewConfig][]>([]);

  constructor() {
    super();
    document.body.addEventListener('pointermove', (event) => this.#onDragMove(event));
    document.body.addEventListener('pointerup', (event) => this.#onDragStop(event));
    document.body.addEventListener('pointerleave', (event) => this.#onDragStop(event));
  }

  init(windowContainer: HTMLDivElement) {
    this.windowContainer = windowContainer;
  }

  createWindow<T extends Application, P>(
    application: T,
    options: WindowOptions,
    component: React.ComponentType<P & WindowViewProps<T>>,
    props?: P
  ) {
    const windowOptions = { ...defaultOptions, ...omitBy(options, isNil) } as Required<WindowOptions>;
    if(options.titleBar === undefined){
      windowOptions.titleBar = {
        title: (<typeof Application>application.constructor).appName,
        icon: (<typeof Application>application.constructor).appIcon
      }
    }
    const controllers = this.#getControllersByLevel(windowOptions.level);
    const windowController = new WindowController(this, windowOptions, application);
    windowController.zIndex = controllers.length;
    this.#windows.set(windowController, { component, props });
    if (this.#activeWindow) {
      this.#activeWindow.active$.next(false);
    }
    windowController.active$.next(true);
    this.#activeWindow = windowController;
    this.#triggerViewsChange();
    return windowController;
  }

  closeWindow(windowController: WindowController<Application>) {
    const controllers = this.#getControllersByLevel(windowController.level$.value);
    const startIndex = windowController.zIndex;
    // remove windowController from windows
    controllers.splice(startIndex, 1);
    this.#windows.delete(windowController);
    // update zIndex
    for (let i = startIndex; i < controllers.length; i++) {
      controllers[i].zIndex = i;
      // set last window active
      if (i === controllers.length - 1) {
        controllers[i].active$.next(true);
        this.#activeWindow = controllers[i];
      }
    }
    this.#triggerViewsChange();
  }

  setWindowInactive(windowController: WindowController<Application>) {
    const controllers = this.#getControllersByLevel(windowController.level$.value);
    if (this.#activeWindow === windowController) {
      // find last non-minimized window
      for (let i = controllers.length - 1; i >= 0; i--) {
        if (controllers[i].windowStatus$.value !== WindowStatus.MINIMIZED) {
          this.setWindowActive(controllers[i]);
          break;
        }
      }
    }
  }

  setWindowActive(windowController: WindowController<Application>) {
    const controllers = this.#getControllersByLevel(windowController.level$.value);
    const startIndex = windowController.zIndex;
    // remove window from this.#windows
    controllers.splice(startIndex, 1);
    if (this.#activeWindow) {
      this.#activeWindow.active$.next(false);
    }
    controllers.push(windowController);
    // update zIndex
    for (let i = startIndex; i < controllers.length; i++) {
      controllers[i].zIndex = i;
    }
    windowController.active$.next(true);
    this.#activeWindow = windowController;
  }

  #triggerViewsChange() {
    this.windowsChange$.next(Array.from(this.#windows.entries()));
  }

  #windowsStatus = new Map<WindowController<Application>, WindowStatus>();

  onWindowShake() {
    if (this.#windows.size < 1) return;

    // if there is any window not minimized except the active window
    let anyWindowNotMinimized = false;
    for (const [controller] of this.#windows) {
      if (controller.windowStatus$.value !== WindowStatus.MINIMIZED && controller !== this.#activeWindow) {
        anyWindowNotMinimized = true;
        break;
      }
    }

    if (anyWindowNotMinimized) {
      // store windows status
      for (const [controller] of this.#windows) {
        this.#windowsStatus.set(controller, controller.windowStatus$.value);
        if (controller !== this.#activeWindow) {
          controller.windowStatus$.next(WindowStatus.MINIMIZED);
        }
      }
    } else {
      // restore windows status
      for (const [constroller, status] of this.#windowsStatus) {
        constroller.windowStatus$.next(status);
      }
      this.#windowsStatus.clear();
    }
  }

  #getControllersByLevel(level: WindowLevel) {
    return Array.from(this.#windows.keys())
      .filter(controller => controller.level$.value === level)
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  #onDragMove(event: MouseEvent) {
    this.#activeWindow?.onDragMove(event);
  }

  #onDragStop(event: MouseEvent) {
    this.#activeWindow?.onDragStop(event);
  }
}