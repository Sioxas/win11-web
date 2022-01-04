import { RefObject } from "react";

import Point from "@/utils/Point";
import { ConnectionPositionPair, PositionStrategy } from "./PositioinStrategy";
import OverlayController from "./OverlayController";

/** Possible values that can be set as the origin of a FlexibleConnectedPositionStrategy. */
export type FlexibleConnectedPositionStrategyOrigin =
  HTMLElement |
  RefObject<HTMLElement> |
  (Point & {
    width?: number;
    height?: number;
  });

/** Equivalent of `ClientRect` without some of the properties we don't care about. */
type Dimensions = Omit<ClientRect, 'x' | 'y' | 'toJSON'>;

export class FlexibleConnectedPositionStrategy implements PositionStrategy {

  #origin?: FlexibleConnectedPositionStrategyOrigin;

  #overlayRef?: RefObject<HTMLElement>;

  get #overlayElement(): HTMLElement | null {
    return this.#overlayRef?.current ?? null;
  }

  #container: HTMLElement | Document = document;

  #getHostElement() {
    return this.#container;
  }

  /** Ordered list of preferred positions, from most to least desirable. */
  #preferredPositions: ConnectionPositionPair[] = [];

  /** 
   * When the space in the vertical direction is insufficient, 
   * whether the coordinates in the vertical direction can be adjusted 
   */
  #verticalFlexible: boolean = false;

  /** 
   * When the space in the horizontal direction is insufficient, 
   * whether the coordinates in the horizontal direction can be adjusted 
   */
  #horizontalFlexible: boolean = false;

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

  /** Attaches this position strategy to an overlay. */
  attach(controller: OverlayController): void {
    this.#overlayRef = controller.overlayRef;
  }

  detach(): void {
    // throw new Error("Method not implemented.");
  }

  /**
   * Apply the position to the element.
   */
  apply(): void {
    if (!this.#origin || !this.#overlayElement) {
      throw new Error("Origin and overlay must be set before calling apply.");
    }
    const originRect = this.#getOriginRect();
    const overlayRect = this.#overlayElement.getBoundingClientRect();

    // Fallback if none of the preferred positions fit within the viewport.
    let fallback: FallbackPosition | undefined;

    for (const pos of this.#preferredPositions) {
      const originPoint = this.#getOriginPoint(originRect, pos);
      const overlayPoint = this.#getOverlayPoint(originPoint, overlayRect, pos);
      const overlayFit = this.#getOverlayFit(overlayPoint, overlayRect, pos);
      // If the overlay, without any further work, fits into the viewport, use this position.
      if (overlayFit.isCompletelyWithinViewport) {
        // this._isPushed = false;
        this.#applyPosition(pos, overlayPoint);
        return;
      }

      // If the overlay has flexible coordinate, we can use this position
      if (this.#canFitWithFlexibleCoordinate(overlayFit, overlayPoint, overlayRect)) {
        const overlayFlexiblePoint = this.#getOverlayFlexiblePoint(overlayFit, overlayPoint, overlayRect);
        this.#applyPosition(pos, overlayFlexiblePoint);
        return;
      }

      // If the current preferred position does not fit on the screen, remember the position
      // if it has more visible area on-screen than we've seen and move onto the next preferred
      // position.
      if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) {
        fallback = { overlayFit, overlayPoint, originPoint, position: pos, overlayRect };
      }
    }

    // All options for getting the overlay within the viewport have been exhausted, so go with the
    // position that went off-screen the least.
    this.#applyPosition(fallback!.position, fallback!.originPoint);
  }

  dispose(): void {
    // throw new Error("Method not implemented.");
  }

  /**
   * Adds new preferred positions.
   * @param positions List of positions options for this overlay.
   */
  withPositions(positions: ConnectionPositionPair[]): this {
    this.#preferredPositions = positions;
    return this;
  }

  withHorizontalFlexible(horizontalFlexible = true): this {
    this.#horizontalFlexible = horizontalFlexible;
    return this;
  }

  withVerticalFlexible(verticalFlexible = true): this {
    this.#verticalFlexible = verticalFlexible;
    return this;
  }

  /** Returns the ClientRect of the current origin. */
  #getOriginRect(): Dimensions {
    const origin = this.#origin;
    if (!origin) {
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

  /**
   * Gets the (x, y) coordinate of a connection point on the origin based on a relative position.
   */
  #getOriginPoint(originRect: Dimensions, position: ConnectionPositionPair): Point {
    const { originX, originY } = position;
    let x: number, y: number;
    if (originX === 'center') {
      x = originRect.left + originRect.width / 2;
    } else {
      x = originX === 'start' ? originRect.left : originRect.right;
    }
    if (originY === 'center') {
      y = originRect.top + originRect.height / 2;
    } else {
      y = originY === 'top' ? originRect.top : originRect.bottom;
    }
    return { x, y };
  }

  /**
   * Gets the (x, y) coordinate of the top-left corner of the overlay given a given position and
   * origin point to which the overlay should be connected.
   */
  #getOverlayPoint(originPoint: Point, overlayRect: Dimensions, position: ConnectionPositionPair): Point {
    const { overlayX, overlayY } = position;
    let x: number, y: number;
    if (overlayX === 'center') {
      x = - overlayRect.width / 2;
    } else {
      x = overlayX === 'start' ? 0 : - overlayRect.width;
    }
    if (overlayY === 'center') {
      y = - overlayRect.height / 2;
    } else {
      y = overlayY === 'top' ? 0 : - overlayRect.height;
    }
    x += originPoint.x + position.offsetX;
    y += originPoint.y + position.offsetY;
    return { x, y };
  }

  #getOverlayFit(
    point: Point,
    overlay: Dimensions,
    position: ConnectionPositionPair
  ): OverlayFit {
    let { x, y } = point;

    // How much the overlay would overflow at this position, on each side.
    let leftOverflow = 0 - x;
    let rightOverflow = x + overlay.width - window.innerWidth;
    let topOverflow = 0 - y;
    let bottomOverflow = y + overlay.height - window.innerHeight;

    // Visible parts of the element on each axis.
    let visibleWidth = this.#subtractOverflows(overlay.width, leftOverflow, rightOverflow);
    let visibleHeight = this.#subtractOverflows(overlay.height, topOverflow, bottomOverflow);
    let visibleArea = visibleWidth * visibleHeight;

    return {
      visibleArea,
      isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
      fitsInViewportVertically: visibleHeight === overlay.height,
      fitsInViewportHorizontally: visibleWidth == overlay.width,
    };
  }

  /** Subtracts the amount that an element is overflowing on an axis from its length. */
  #subtractOverflows(length: number, ...overflows: number[]): number {
    return overflows.reduce((currentValue: number, currentOverflow: number) => {
      return currentValue - Math.max(currentOverflow, 0);
    }, length);
  }

  /**
   * Whether the overlay can fit within the viewport when it may move coordinate horizontally or vertically.
   * @param fit How well the overlay fits in the viewport at some position.
   * @param point The (x, y) coordinates of the overlay at some position.
   * @param overlay The Dimensions of the overlay.
   */
  #canFitWithFlexibleCoordinate(fit: OverlayFit, overlayPoint: Point, overlayRect: Dimensions) {
    if (this.#horizontalFlexible || this.#verticalFlexible) {
      let horizontalFit = fit.fitsInViewportHorizontally;
      let verticalFit = fit.fitsInViewportVertically;
      if (!horizontalFit && !verticalFit) {
        return false;
      }
      if (!horizontalFit && this.#horizontalFlexible) {
        horizontalFit = overlayRect.height <= window.innerHeight;
      }
      if (!verticalFit && this.#verticalFlexible) {
        verticalFit = overlayRect.width <= window.innerWidth;
      }
      return verticalFit && horizontalFit;
    }
    return false;
  }

  /**
   * Gets the (x, y) coordinates of the overlay which is completely within the viewport.
   * @param fit How well the overlay fits in the viewport at some position.
   * @param point The (x, y) coordinates of the overlay at some position.
   * @param overlay The Dimensions of the overlay.
   */
  #getOverlayFlexiblePoint(fit: OverlayFit, overlayPoint: Point, overlayRect: Dimensions): Point {
    let { x, y } = overlayPoint;
    const viewprotRect = this.#getViewportRect();
    if (!fit.fitsInViewportHorizontally) {
      if (x < viewprotRect.left) {
        x = viewprotRect.left;
      }
      if (x + overlayRect.width > viewprotRect.right) {
        x = viewprotRect.right - overlayRect.width;
      }
    }
    if (!fit.fitsInViewportVertically) {
      if (y < viewprotRect.top) {
        y = viewprotRect.top;
      }
      if (y + overlayRect.height > viewprotRect.bottom) {
        y = viewprotRect.bottom - overlayRect.height;
      }
    }
    return { x, y };
  }

  /**
   * Applies a computed position to the overlay.
   * @param position The position preference
   * @param overlayPoint The overlay element start point.
   */
  #applyPosition(position: ConnectionPositionPair, overlayPoint: Point) {
    const overlayElement = this.#overlayElement;
    if (overlayElement) {
      let { x, y } = overlayPoint;
      overlayElement.style.position = 'absolute';
      overlayElement.style.zIndex = '1000';
      overlayElement.style.left = `${x}px`;
      overlayElement.style.top = `${y}px`;
    }
  }

  #getViewportRect(): Dimensions {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
    }
  }
}

function isRefObject(ref: any): ref is RefObject<HTMLElement> {
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

/** Record of the measurments determining whether an overlay will fit in a specific position. */
interface FallbackPosition {
  position: ConnectionPositionPair;
  originPoint: Point;
  overlayPoint: Point;
  overlayFit: OverlayFit;
  overlayRect: Dimensions;
}
