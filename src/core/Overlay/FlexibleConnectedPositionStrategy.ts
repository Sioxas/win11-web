import React from "react";

import Point from "@/utils/Point";
import { PositionStrategy } from "./PositioinStrategy";
import OverlayController from "./OverlayController";

/** Possible values that can be set as the origin of a FlexibleConnectedPositionStrategy. */
export type FlexibleConnectedPositionStrategyOrigin = HTMLElement | React.RefObject<HTMLElement> | Point;

export class FlexibleConnectedPositionStrategy implements PositionStrategy {

  #origin: FlexibleConnectedPositionStrategyOrigin;

  constructor(connectedTo: FlexibleConnectedPositionStrategyOrigin) {
    this.setOrigin(connectedTo);
  }

  /**
   * Sets the origin, relative to which to position the overlay.
   * Using an element origin is useful for building components that need to be positioned
   * relatively to a trigger (e.g. dropdown menus or tooltips), whereas using a point can be
   * used for cases like contextual menus which open relative to the user's pointer.
   * @param origin Reference to the new origin.
   */
  setOrigin(origin: FlexibleConnectedPositionStrategyOrigin): this {
    this.#origin = origin;
    return this;
  }

  attach(overlayRef: OverlayController): void {
    throw new Error("Method not implemented.");
  }
  apply(): void {
    throw new Error("Method not implemented.");
  }
  dispose(): void {
    throw new Error("Method not implemented.");
  }

}