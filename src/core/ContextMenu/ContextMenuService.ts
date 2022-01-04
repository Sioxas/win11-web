import React from "react";
import { Service } from "typedi";

import Point from "@/utils/Point";
import { ContextMenuItem } from "./interface";
import MenuPanelController from "./MenuPanelController";
import Overlay from "../Overlay/Overlay";
import { ConnectionPositionPair, PositionStrategy } from "../Overlay/PositioinStrategy";
import MenuPanel from "./MenuPanel";

@Service()
export default class ContextMenuService {
  #menuPanelController?: MenuPanelController;

  constructor(private overlay: Overlay) {
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
      ]);
    this.#apply(positionStrategy, options);
  }

  dispose() {
    this.#menuPanelController?.dispose();
    this.#menuPanelController = undefined;
  }

  #apply(positionStrategy: PositionStrategy, options: ContextMenuItem[]) {
    const menuOverlay = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      panelClass: 'dropdown-panel'
    });
    this.#menuPanelController = new MenuPanelController(options, menuOverlay);
    const menuElement = React.createElement(MenuPanel, {
      panel: this.#menuPanelController
    });
    menuOverlay.attach(menuElement);
    const subscription = menuOverlay.backdropClick$.subscribe(() => {
      this.dispose();
      subscription.unsubscribe();
    });
  }
}