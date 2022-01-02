import React from "react";

import Point from "@/utils/Point";
import pointInTriangle from "@/utils/pointInTrangle";
import Overlay from "../Overlay/Overlay";
import OverlayController from "../Overlay/OverlayController";
import { ConnectionPositionPair } from "../Overlay/PositioinStrategy";
import MenuPanel from "./MenuPanel";
import { ContextMenuItem } from "./interface";


export default class MenuPanelController {

  private overlay = Overlay.getInstance();

  #childMenuPanel?: MenuPanelController;

  #menuItem?: ContextMenuItem;

  constructor(
    public options: ContextMenuItem[],
    private overlayController: OverlayController,
    private parent?: MenuPanelController
  ) { }

  onPointerEnter(event: React.PointerEvent<HTMLLIElement>, menuItem: ContextMenuItem) {
    if (this.#childMenuPanel) {
      if (!this.#shouldChangeChildPanel(event)) {
        return;
      }
      this.#childMenuPanel.dispose();
      this.#childMenuPanel = undefined;
      this.#menuItem = undefined;
    }
    if (menuItem.children) {
      this.#menuItem = menuItem;
      this.#showChildPanel(event, menuItem);
    }
  }

  onSelect(option: ContextMenuItem) {
    // FIXME: 选择后销毁菜单
  }

  dispose() {
    this.overlayController.detach();
    this.#childMenuPanel?.dispose();
  }

  #p0: Point = { x: 0, y: 0 };
  #p1: Point = { x: 0, y: 0 };

  #shouldChangeChildPanel(event: React.PointerEvent<HTMLLIElement>) {
    if (this.#childMenuPanel) {
      const childElement = this.#childMenuPanel.overlayController.overlayRef.current;
      if (childElement) {
        const rect = childElement.getBoundingClientRect(),
          // mouse position
          p = new Point(event.clientX, event.clientY),
          a = new Point(p.x < rect.left ? rect.left : rect.right, rect.top),
          b = new Point(p.x < rect.left ? rect.left : rect.right, rect.bottom);
        return !(pointInTriangle(p, this.#p0, a, b) || pointInTriangle(p, this.#p0, this.#p1, b));
      }
    }
    return true;
  }

  #showChildPanel(event: React.PointerEvent<HTMLLIElement>, menuItem: ContextMenuItem) {
    const element = (event.target as HTMLElement).closest('.context-menu-item');
    if (!element) {
      return;
    }

    const rect = (element as HTMLElement).getBoundingClientRect();
    this.#p0 = { x: event.clientX, y: rect.top };
    this.#p1 = { x: event.clientX, y: rect.bottom };

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(element as HTMLElement)
      .withPositions([
        new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
      ])
      .withVerticalFlexible();

    const menuOverlay = this.overlay.create({ positionStrategy, panelClass: 'dropdown-panel' });

    this.#childMenuPanel = new MenuPanelController(menuItem.children!, menuOverlay, this);

    const menuElement = React.createElement(MenuPanel, {
      panel: this.#childMenuPanel
    });

    menuOverlay.attach(menuElement);
  }
}