import React from "react";
import { BehaviorSubject } from "rxjs";
import { omitBy, isNil } from "lodash-es";
import { Service } from 'typedi';

import MouseShakeDetector from "@/utils/MouseShakeDetector";
import RelativePosition from "@/utils/RelativePosition";
import Point from "@/utils/Point";
import LRU from "@/utils/LRUCache";
import Application from "./Application";
import { WindowController } from "./WindowController";
import { WindowType, WindowLevel, WindowResizeType, WindowControlButton, WindowPosition } from './enums';

interface WindowTitleBar {
  title: string;
  icon: string;
}

export interface WindowOptions {
  type?: WindowType;
  level?: WindowLevel;
  width?: number;
  height?: number;
  position?: Point | RelativePosition;
  resizeable?: boolean;
  titleBar?: false | WindowTitleBar;
  controlButton?: number;
  availableResizeType?: number;
  defaultResizeType?: WindowResizeType;
  windowAnimateKeyFrames?: Keyframe[];
}

export const defaultOptions: WindowOptions = {
  type: WindowType.NORMAL,
  level: WindowLevel.MIDDLE,
  width: 800,
  height: 600,
  position: new RelativePosition(WindowPosition.CENTER, WindowPosition.CENTER),
  resizeable: true,
  controlButton: WindowControlButton.CLOSE | WindowControlButton.MINIMIZE | WindowControlButton.MAXIMIZE,
  availableResizeType: WindowResizeType.NORMAL | WindowResizeType.MINIMIZED | WindowResizeType.MAXIMIZED,
  defaultResizeType: WindowResizeType.NORMAL,
  windowAnimateKeyFrames: [
    { transform: 'scale(0.8)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 },
  ]
};

export interface WindowViewProps<T extends Application> {
  controller: WindowController<T>;
  application: T;
}

export interface WindowViewConfig<T extends Application = Application, P = any> {
  component: React.ComponentType<P & WindowViewProps<T>>;
  props?: P;
}

@Service()
export default class WindowService {

  #windows = new Map<WindowController<Application>, WindowViewConfig>();

  #recentlyUsedWindows = new LRU<WindowController<Application>, null>(Infinity);

  #activeWindow$ = new BehaviorSubject<WindowController<Application> | null>(null);
  get activeWindow$() {
    return this.#activeWindow$.asObservable();
  }
  get activeWindow() {
    return this.#activeWindow$.value;
  }
  set activeWindow(windowController: WindowController<Application> | null) {
    this.#activeWindow$.next(windowController);
    if (windowController) {
      this.#recentlyUsedWindows.set(windowController, null);
    }
  }

  windowContainer?: HTMLDivElement;

  #windows$ = new BehaviorSubject<[WindowController<Application>, WindowViewConfig][]>([]);
  get windows$() {
    return this.#windows$.asObservable();
  }
  get windows() {
    return Array.from(this.#windows.entries());
  }

  mouseShakeDetector = new MouseShakeDetector();

  constructor() {
    document.body.addEventListener('pointermove', (event) => {
      this.activeWindow?.onDragMove(event);
    });
    document.body.addEventListener('pointerup', (event) => {
      this.activeWindow?.onDragStop(event);
    });
    document.body.addEventListener('pointerleave', (event) => {
      this.activeWindow?.onDragStop(event);
    });
    this.mouseShakeDetector.mouseShake$.subscribe(() => {
      this.onWindowShake();
    });
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
    if (options.titleBar === undefined) {
      windowOptions.titleBar = {
        title: (<typeof Application>application.constructor).appName,
        icon: (<typeof Application>application.constructor).appIcon
      }
    }
    const controllers = this.#getControllersByLevel(windowOptions.level);
    const windowController = new WindowController(windowOptions, application);
    windowController.zIndex = controllers.length;
    this.#windows.set(windowController, { component, props });
    if (this.activeWindow) {
      this.activeWindow.active = false;
    }
    windowController.active = true;
    this.activeWindow = windowController;
    this.#windows$.next(this.windows);
    return windowController;
  }

  async closeWindow(windowController: WindowController<Application>) {
    await windowController._close();
    this.#windows.delete(windowController);
    this.#recentlyUsedWindows.remove(windowController);
    this.activeWindow = this.#recentlyUsedWindows.mostUsed ?? null;
    if(this.activeWindow) {
      this.activeWindow.active = true;
    }
    this.#windows$.next(this.windows);
  }

  setWindowInactive(windowController: WindowController<Application>) {
    const controllers = Array.from(this.#recentlyUsedWindows.cache.keys());
    if (this.activeWindow === windowController) {
      // find first non-minimized window
      const controller = controllers.find(controller =>
        controller.windowResizeType !== WindowResizeType.MINIMIZED
        &&
        controller !== windowController
      );
      if (controller) {
        this.setWindowActive(controller);
      } else {
        this.setDesktopActive();
      }
    }
  }

  setTaskBarActive() {
    if (this.activeWindow === null) return;
    this.activeWindow.active = false;
    this.activeWindow = null;
  }

  setDesktopActive() {
    if (this.activeWindow === null) return;
    this.activeWindow.active = false;
    this.activeWindow = null;
  }

  setWindowActive(windowController: WindowController<Application>) {
    if (this.activeWindow === windowController) return;
    const controllers = this.#getControllersByLevel(windowController.level);
    const startIndex = windowController.zIndex;
    // remove window from this.#windows
    controllers.splice(startIndex, 1);
    if (this.activeWindow) {
      this.activeWindow.active = false;
    }
    controllers.push(windowController);
    // update zIndex
    for (let i = startIndex; i < controllers.length; i++) {
      controllers[i].zIndex = i;
    }
    windowController.active = true;
    this.activeWindow = windowController;
  }

  #windowsStatus = new Map<WindowController<Application>, WindowResizeType>();

  onWindowShake() {
    if (this.#windows.size < 1) return;

    // if there is any window not minimized except the active window
    let anyWindowNotMinimized = false;
    for (const [controller] of this.#windows) {
      if (controller.windowResizeType !== WindowResizeType.MINIMIZED && controller !== this.activeWindow) {
        anyWindowNotMinimized = true;
        break;
      }
    }

    if (anyWindowNotMinimized) {
      // store windows status
      for (const [controller] of this.#windows) {
        this.#windowsStatus.set(controller, controller.windowResizeType);
        if (controller !== this.activeWindow) {
          controller.windowResizeType = WindowResizeType.MINIMIZED;
        }
      }
    } else {
      // restore windows status
      for (const [constroller, status] of this.#windowsStatus) {
        constroller.windowResizeType = status;
      }
      this.#windowsStatus.clear();
    }
  }

  #getControllersByLevel(level: WindowLevel) {
    return Array.from(this.#windows.keys())
      .filter(controller => controller.level === level)
      .sort((a, b) => a.zIndex - b.zIndex);
  }
}
