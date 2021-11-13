import { BehaviorSubject } from "rxjs";

import CanvasService from "../Canvas/CanvasService";
import Service from "../Service";
import { MenuPanel, ContextMenuItem } from "./interface";
import { getAjustedPosition, getMenuHeight } from "./utils";

export default class ContextMenuService extends Service {
  menuPanels$ = new BehaviorSubject<MenuPanel[]>([]);
  set #menuPanels(panels: MenuPanel[]) {
    this.menuPanels$.next(panels);
  }
  get #menuPanels(): MenuPanel[] {
    return this.menuPanels$.value;
  }

  path$ = new BehaviorSubject<ContextMenuItem[]>([]);
  set #path(path: ContextMenuItem[]) {
    this.path$.next(path);
  }
  get #path(): ContextMenuItem[] {
    return this.path$.value;
  }

  constructor() {
    super();
  }

  show(x: number, y: number, options: ContextMenuItem[]) {
    this.#menuPanels = [{ x, y, options }];
  }

  #p0 = [0, 0];
  #v1 = [0, 0];
  #v2 = [0, 0];

  onPointerEnter(event: React.PointerEvent<HTMLLIElement>, path: ContextMenuItem[]) {
    if (!path.length) return;
    let panels = this.#menuPanels;
    if(panels.length > path.length) {
      const p = [event.clientX, event.clientY],
        A = this.#v1, C = this.#v2,
        B = [p[0] - this.#p0[0], p[1] - this.#p0[1]],
        // cross product of A and B
        AxB = A[0] * B[1] - A[1] * B[0],
        AxC = A[0] * C[1] - A[1] * C[0],
        CxB = C[0] * B[1] - C[1] * B[0],
        CxA = C[0] * A[1] - C[1] * A[0];
      if (AxB * AxC >= 0 && CxB * CxA >= 0){
        // B is inside of A and C
        return;
      }
      panels = panels.slice(0, path.length);
    }
    const last = path[path.length - 1];
    if (last.children && last.children.length > 0) {
      // find element parent which has context-menu-item class
      const element = (event.target as HTMLElement).closest('.context-menu-item');
      if (element) {
        const rect = (element as HTMLElement).getBoundingClientRect(),
          [x, y] = getAjustedPosition(rect.right - 8, rect.top, last.children!);
        panels = [...panels, { x, y, options: last.children! }];
        this.#path = path;
        const p1 = [event.clientX, rect.top], p2 = [x, y], 
          p3 = [event.clientX, rect.bottom], p4 = [x, y + getMenuHeight(last.children!)],
          a1 = p2[1] - p1[1], b1 = p1[0] - p2[0], c1 = p2[0] * p1[1] - p1[0] * p2[1],
          a2 = p4[1] - p3[1], b2 = p3[0] - p4[0], c2 = p4[0] * p3[1] - p3[0] * p4[1],
          x0 = (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1),
          y0 = (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1);
        this.#p0 = [x0, y0];
        this.#v1 = [p2[0] - x0, p2[1] - y0];
        this.#v2 = [p4[0] - x0, p4[1] - y0];
      }
    }
    if(panels !== this.#menuPanels)
      this.#menuPanels = panels;
  }

  onSelect(path: ContextMenuItem[]) {
    if (!path.length) return;
    const last = path[path.length - 1];
    last.onSelect?.(path);
    close();
  }

  close() {
    this.#menuPanels = [];
    this.#path = [];
  }
}