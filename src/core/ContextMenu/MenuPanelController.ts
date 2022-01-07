import React from "react";

import Point from "@/utils/Point";
import pointInTriangle from "@/utils/pointInTrangle";
import Overlay from "../Overlay/Overlay";
import OverlayController from "../Overlay/OverlayController";
import { ConnectionPositionPair } from "../Overlay/PositioinStrategy";
import MenuPanel from "./MenuPanel";
import { ContextMenuItem } from "./interface";
import { ContextMenuService } from ".";


export default class MenuPanelController {

  #overlay = Overlay.getInstance();

  #contextMenu = ContextMenuService.getInstance();

  #childMenuPanel?: MenuPanelController;

  #menuItem?: ContextMenuItem;

  constructor(
    public options: ContextMenuItem[],
    private overlayController: OverlayController,
    private parent?: MenuPanelController
  ) { }

  /**
   * When the mouse enters the element of ContextMenuItem, determine if the submenu is 
   * displayed according to the mouse position.
   */
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
    option.onSelect?.(option);
    this.#contextMenu.dispose();
  }

  dispose() {
    this.overlayController.detach();
    this.#childMenuPanel?.dispose();
  }

  #p0: Point = { x: 0, y: 0 };
  #p1: Point = { x: 0, y: 0 };

  /**
   * Judging whether the mouse is in the quadrangular area composed of the submenu triggered by the options and options.
   */
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

  /**
   * Attach MenuPanel overlay.
   */
  #showChildPanel(event: React.PointerEvent<HTMLLIElement>, menuItem: ContextMenuItem) {
    const element = (event.target as HTMLElement).closest('.context-menu-item');
    if (!element) {
      return;
    }

    const rect = (element as HTMLElement).getBoundingClientRect();
    this.#p0 = { x: event.clientX, y: rect.top };
    this.#p1 = { x: event.clientX, y: rect.bottom };

    const positionStrategy = this.#overlay.position()
      .flexibleConnectedTo(element as HTMLElement)
      .withPositions([
        new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }, 0, -4),
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }, 0, -4),
      ])
      .withVerticalFlexible();

    const menuOverlay = this.#overlay.create({ positionStrategy });

    this.#childMenuPanel = new MenuPanelController(menuItem.children!, menuOverlay, this);

    const menuElement = React.createElement(MenuPanel, {
      panel: this.#childMenuPanel
    });

    menuOverlay.attach(menuElement);
  }
}