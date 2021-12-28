import React from "react";

import Point from "@/utils/Point";
import { ConnectionPositionPair, PositionStrategy } from "./PositioinStrategy";
import OverlayController from "./OverlayController";

/** Possible values that can be set as the origin of a FlexibleConnectedPositionStrategy. */
export type FlexibleConnectedPositionStrategyOrigin =
  HTMLElement |
  React.RefObject<HTMLElement> |
  (Point & {
    width?: number;
    height?: number;
  });

/** Equivalent of `ClientRect` without some of the properties we don't care about. */
type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;

export class FlexibleConnectedPositionStrategy implements PositionStrategy {

  #origin?: FlexibleConnectedPositionStrategyOrigin;

  #overlayRef?: React.RefObject<HTMLElement>;

  get #overlayElement(): HTMLElement | null {
    return this.#overlayRef?.current ?? null;
  }

  #container: HTMLElement | Document = document;

  #preferredPositions: ConnectionPositionPair[] = [];

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

  attach(controller: OverlayController): void {
    this.#overlayRef = controller.overlayRef;
  }
  detach(): void {
    throw new Error("Method not implemented.");
  }
  apply(): void {
    if(!this.#origin || !this.#overlayElement) {
      throw new Error("Origin and overlay must be set before calling apply.");
    }
    const originRect = this.#getOriginRect();
    const overlayRect = this.#overlayElement.getBoundingClientRect();
  }
  dispose(): void {
    throw new Error("Method not implemented.");
  }

  withPositions(positions: ConnectionPositionPair[]): this {
    this.#preferredPositions = positions;
    return this;
  }

  /** Returns the ClientRect of the current origin. */
  #getOriginRect(): Dimensions {
    const origin = this.#origin;
    if(!origin) {
      throw new Error("Origin not set.");
    }

    // Check for Element so SVG elements are also supported.
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }

    if (isRefObject(origin)) {
      if (origin.current)
        return origin.current.getBoundingClientRect();
      else 
        throw new Error("RefObject origin is not a valid HTMLElement");
    }

    const width = origin.width || 0;
    const height = origin.height || 0;

    // If the origin is a point, return a client rect as if it was a 0x0 element at the point.
    return {
      top: origin.y,
      bottom: origin.y + height,
      left: origin.x,
      right: origin.x + width,
      height,
      width,
    };
  }

  #getOriginPoint(originRect: Dimensions, position: ConnectionPositionPair): Point {
    const { originX, originY } = position;
    const x = originX === 'center'
      ? (originRect.left + originRect.right) / 2
      : originX === 'end'
        ? originRect.right
        : originRect.left;
    const y = originY === 'center'
      ? (originRect.top + originRect.bottom) / 2
      : originY === 'bottom'
        ? originRect.bottom
        : originRect.top;
    return {x,y};
  }

}

function isRefObject(ref: any): ref is React.RefObject<HTMLElement> {
  return typeof ref === 'object' && ref.current instanceof HTMLElement;
}

/** Record of measurements for how an overlay (at a given position) fits into the viewport. */
interface OverlayFit {
  /** Whether the overlay fits completely in the viewport. */
  isCompletelyWithinViewport: boolean;

  /** Whether the overlay fits in the viewport on the y-axis. */
  fitsInViewportVertically: boolean;

  /** Whether the overlay fits in the viewport on the x-axis. */
  fitsInViewportHorizontally: boolean;

  /** The total visible area (in px^2) of the overlay inside the viewport. */
  visibleArea: number;
}
