import { FlexibleConnectedPositionStrategy, FlexibleConnectedPositionStrategyOrigin } from "./FlexibleConnectedPositionStrategy";
import { GlobalPositionStrategy } from "./GlobalPositionStrategy";

export class OverlayPositionBuilder {

  /**
   * Creates a global position strategy.
   */
  global(): GlobalPositionStrategy {
    return new GlobalPositionStrategy();
  }

  /**
   * Creates a flexible position strategy.
   * @param origin Origin relative to which to position the overlay.
   */
  flexibleConnectedTo(
    origin: FlexibleConnectedPositionStrategyOrigin,
  ): FlexibleConnectedPositionStrategy {
    return new FlexibleConnectedPositionStrategy(
      origin,
    );
  }
}