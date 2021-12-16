import { BehaviorSubject } from "rxjs";

import Service from "../Service";
import { ContextMenuItem } from "./interface";
import MenuPanelController from "./MenuPanelController";

export default class ContextMenuService extends Service {
  panels$ = new BehaviorSubject<MenuPanelController[]>([]);
  set panels(panels: MenuPanelController[]) {
    this.panels$.next(panels);
  }
  get panels(): MenuPanelController[] {
    return this.panels$.value;
  }

  path$ = new BehaviorSubject<ContextMenuItem[]>([]);
  set path(path: ContextMenuItem[]) {
    this.path$.next(path);
  }
  get path(): ContextMenuItem[] {
    return this.path$.value;
  }

  constructor() {
    super();
    document.body.addEventListener('contextmenu',(e)=>{
      e.preventDefault();
    });
  }

  show(x: number, y: number, options: ContextMenuItem[]) {
    this.panels = [new MenuPanelController(x, y, options)];
  }

  close() {
    this.panels = [];
    this.path = [];
  }
}