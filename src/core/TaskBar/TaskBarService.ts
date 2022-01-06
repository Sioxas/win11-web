import { createRef, RefObject } from "react";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { uniq } from "lodash-es";

import { PIN_TO_TASKBAR } from "@/applications";
import { Constructor } from "@/utils/interface";
import ApplicationService from "../ApplicationService";
import WindowService from "../WindowService";
import Application from "../Application";
import { WindowType } from "../enums";
import Service from "@/utils/Service";

export interface TaskBarButton {
  App: typeof Application;
  active: boolean;
  running: boolean;
  ref: RefObject<HTMLButtonElement>;
}

export default class TaskBarService extends Service {

  readonly buttons$ = new BehaviorSubject<TaskBarButton[]>([]);
  get buttons() {
    return this.buttons$.value;
  }
  set buttons(buttons: TaskBarButton[]) {
    this.buttons$.next(buttons);
  }

  constructor(
    private windowService: WindowService,
    private appService: ApplicationService
  ) {
    super();
    combineLatest([windowService.activeWindow$, windowService.windows$]).pipe(
      map(([activeWindow, windows]) => {
        const apps = uniq(
          windows.filter(([controller]) => controller.options.type !== WindowType.WIDGET)
            .map(([controller]) => controller.application.constructor)
        );
        const activeApp = activeWindow?.application.constructor;
        const buttons: TaskBarButton[] = [];
        for (const App of PIN_TO_TASKBAR) {
          const index = apps.findIndex(app => app === App);
          buttons.push({
            App,
            active: activeApp === App,
            running: index !== -1,
            ref: createRef()
          });
          if (index !== -1) {
            apps.splice(index, 1);
          }
        }
        for (const App of apps) {
          buttons.push({
            App: App as typeof Application,
            active: activeApp === App,
            running: true,
            ref: createRef()
          });
        }
        return buttons;
      })
    ).subscribe((buttons) => {
      this.buttons = buttons;
    });
  }

  getButtonByApp(App: typeof Application) {
    return this.buttons.find(button => button.App === App);
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
      if(this.windowService.activeWindow === controller) {
        if(controller.options.type === WindowType.WIDGET) {
          controller.close();
        }else{
          controller.minimize();
        }
      } else {
        controller.restoreWindow();
      } 
    } else {
      this.appService.launch(App as unknown as Constructor<Application>);
    };
  }
}