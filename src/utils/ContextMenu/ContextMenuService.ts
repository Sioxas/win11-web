import { Observable } from "rxjs";
import { createSignal } from "@react-rxjs/utils";
import { MenuPanel, ContextMenuItem } from "./interface";

export default class ContextMenuService {
  contextMenuChange$: Observable<MenuPanel>;

  #next: (panel:MenuPanel) => void;

  constructor() {
    [this.contextMenuChange$, this.#next] = createSignal<MenuPanel>()
  }

  show(x: number, y: number, options: ContextMenuItem[]) {
    this.#next({ x, y, options });
  }
}