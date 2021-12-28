import OverlayController from "./OverlayController";
import { PositionStrategy } from "./PositioinStrategy";

export class GlobalPositionStrategy implements PositionStrategy {
  attach(overlayRef: OverlayController): void {
    throw new Error("Method not implemented.");
  }
  detach(): void {
    throw new Error("Method not implemented.");
  }
  apply(): void {
    throw new Error("Method not implemented.");
  }
  dispose(): void {
    throw new Error("Method not implemented.");
  }
  
}