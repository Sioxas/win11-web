import React from "react";

import Service from "../Service";
import { ContextMenuItem } from "./interface";
import MenuPanelController from "./MenuPanelController";
import Overlay from "../Overlay/Overlay";
import { ConnectionPositionPair, PositionStrategy } from "../Overlay/PositioinStrategy";
import MenuPanel from "./MenuPanel";
import Point from "@/utils/Point";

export default class ContextMenuService extends Service {

  constructor(private overlay: Overlay) {
    super();
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  show(point: Point, options: ContextMenuItem[]) {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(point)
      .withPositions([
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
      ])
      .withVerticalFlexible();
    this.#apply(positionStrategy, options);
  }

  dropdown(origin: HTMLElement | React.RefObject<HTMLElement>, options: ContextMenuItem[]) {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(origin)
      .withPositions([
        new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
        new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
      ])
      .withHorizontalFlexible();
    this.#apply(positionStrategy, options);
  }

  #apply(positionStrategy: PositionStrategy, options: ContextMenuItem[]) {
    const menuOverlay = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      panelClass: 'dropdown-panel'
    });
    const menuPanelController = new MenuPanelController(options, menuOverlay);
    const subscription = menuOverlay.backdropClick$.subscribe(() => {
      menuPanelController.dispose();
      subscription.unsubscribe();
    });
    const menuElement = React.createElement(MenuPanel, {
      panel: menuPanelController
    });
    menuOverlay.attach(menuElement);
  }
}