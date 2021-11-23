import { createRef, RefObject } from "react";
import { BehaviorSubject, combineLatest, map } from "rxjs";

import { PIN_TO_TASKBAR } from "@/applications";
import ApplicationService from "../ApplicationService";
import WindowService from "../WindowService";
import Service from "../Service";
import Application from "../Application";
import { Constructor } from "@/utils/interface";

export interface TaskBarButton {
  App: typeof Application;
  active: boolean;
  running: boolean;
  ref: RefObject<HTMLButtonElement>;
}

export default class TaskBarService extends Service {

  #buttons$ = new BehaviorSubject<TaskBarButton[]>([]);
  get buttons$() {
    return this.#buttons$.asObservable();
  }
  get #buttons() {
    return this.#buttons$.value;
  }

  constructor(
    private windowService: WindowService,
    private appService: ApplicationService
  ) {
    super();
    combineLatest([windowService.activeWindow$, appService.apps$]).pipe(
      map(([activeWindow, apps]) => {
        const runnigApps = apps.map(([App]) => App) as unknown as (typeof Application)[];
        const buttons: TaskBarButton[] = [];
        for (const App of PIN_TO_TASKBAR) {
          const index = runnigApps.findIndex(app => app === App);
          buttons.push({
            App,
            active: activeWindow?.constructor === App,
            running: index !== -1,
            ref: createRef()
          });
          if (index !== -1) {
            runnigApps.splice(index, 1);
          }
        }
        for (const App of runnigApps) {
          buttons.push({
            App,
            active: activeWindow?.constructor === App,
            running: true,
            ref: createRef()
          });
        }
        return buttons;
      })
    ).subscribe(this.#buttons$);
  }

  getButtonByApp(App: typeof Application) {
    return this.#buttons.find(button => button.App === App);
  }

  getButtonRectByApp(App: typeof Application) {
    const button = this.getButtonByApp(App);
    if (button) {
      return button.ref.current?.getBoundingClientRect();
    }
  }

  onClickButton(App: typeof Application) {
    const controller = this.windowService.windows
      .map(([controller]) => controller)
      .find(controller => controller.application.constructor === App);
    if (controller) {
      this.windowService.activeWindow === controller ? controller.minimize() : controller.normalize();
    } else {
      this.appService.launch(App as unknown as Constructor<Application>);
    };
  }
}