import { RefObject } from "react";

import { PositionStrategy } from "@/core/Overlay/PositioinStrategy";
import Point from "@/utils/Point";

export default class SelectOptionsPositionStrategy implements PositionStrategy {

  private overlayRef?: RefObject<HTMLElement>

  private optionIndex = 0;

  private verticalFlexible = false;

  private horizontalFlexible = false;

  private offset = new Point(0, 0);

  constructor(private origin: RefObject<HTMLButtonElement>) { }

  alignWith(optionIndex: number) {
    this.optionIndex = optionIndex;
    return this;
  }

  withVertivalFlexible(verticalFlexible = true) {
    this.verticalFlexible = verticalFlexible;
    return this;
  }

  withHorizontalFlexible(horizontalFlexible = true) {
    this.horizontalFlexible = horizontalFlexible;
    return this;
  }

  withOffset(offsetX: number, offsetY: number) {
    this.offset = { x: offsetX, y: offsetY };
    return this;
  }

  attach(overlayRef: RefObject<HTMLElement>): void {
    this.overlayRef = overlayRef;
  }

  apply(): void {
    if (!this.origin.current || !this.overlayRef?.current) {
      throw new Error("origin and overlayRef must be set before apply position strategy");
    }

    let
      originRect = this.origin.current.getBoundingClientRect(),
      overlayRect = this.overlayRef.current.getBoundingClientRect();

    const overlayPosition = this.getOverlayPosition(this.overlayRef.current, overlayRect, originRect);
    this.adjustOverlayPosition(overlayPosition, overlayRect);
    this.applyPosition(overlayPosition);
  }

  dispose(): void {
  }

  private getOverlayPosition(overlayElement: HTMLElement, overlayRect: DOMRect, originRect: DOMRect): Point {
    let
      index = this.optionIndex >= 0 && this.optionIndex < overlayElement.children.length ? this.optionIndex : 0,
      option = overlayElement.children[index],
      optionRect = option.getBoundingClientRect(),
      /** Position of option relative to overlay */
      optionRelativePosition = new Point(optionRect.left - overlayRect.left, optionRect.top - overlayRect.top);

    return new Point(
      originRect.left - optionRelativePosition.x + this.offset.x,
      originRect.top - optionRelativePosition.y + this.offset.y
    );
  }

  private adjustOverlayPosition(overlayPoint: Point, overlayRect: DOMRect) {
    const { width, height } = overlayRect;
    if (this.horizontalFlexible) {
      if (overlayPoint.x < 0) {
        overlayPoint.x = 0;
      } else if (overlayPoint.x + width > window.innerWidth) {
        overlayPoint.x = window.innerWidth - width;
      }
    }
    if (this.verticalFlexible) {
      if (overlayPoint.y < 0) {
        overlayPoint.y = 0;
      } else if (overlayPoint.y + height > window.innerHeight) {
        overlayPoint.y = window.innerHeight - height;
      }
    }
  }

  /**
   * Applies a computed position to the overlay.
   * @param overlayPoint The overlay element start point.
   */
  private applyPosition(overlayPoint: Point) {
    const overlayElement = this.overlayRef?.current;
    if (overlayElement) {
      let { x, y } = overlayPoint;
      overlayElement.style.position = 'absolute';
      overlayElement.style.zIndex = '1000';
      overlayElement.style.left = `${x}px`;
      overlayElement.style.top = `${y}px`;
    }
  }
}
