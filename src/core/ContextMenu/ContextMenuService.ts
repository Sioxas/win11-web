import React from "react";

import Service from "@/utils/Service";
import Point from "@/utils/Point";
import { ContextMenuItem } from "./interface";
import MenuPanelController from "./MenuPanelController";
import Overlay from "../Overlay/Overlay";
import { ConnectionPositionPair, PositionStrategy } from "../Overlay/PositioinStrategy";
import MenuPanel from "./MenuPanel";

export default class ContextMenuService extends Service {
  #menuPanelController?: MenuPanelController;

  constructor(private overlay: Overlay) {
    super();
    document.body.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  show(point: Point, options: ContextMenuItem[]) {
    if(!Array.isArray(options)) {
      throw new Error('options must be array of ContextMenuItem');
    }
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
    if(!(origin instanceof HTMLElement || origin.current instanceof HTMLElement)) {
      throw new Error('origin must be HTMLElement or React.RefObject<HTMLElement>');
    }
    if(!Array.isArray(options)) {
      throw new Error('options must be array of ContextMenuItem');
    }
    const positionStrategy = this.overlay.position().flexibleConnectedTo(origin);
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
