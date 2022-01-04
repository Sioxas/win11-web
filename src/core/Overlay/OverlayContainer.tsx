import classNames from "classnames";
import { useObservableState } from "observable-hooks";

import { useOverlay } from "../ServiceHooks";

export default function OverlayContainer() {
  const overlay = useOverlay();

  const overlays = useObservableState(overlay.overlays$);

  const nodes: React.ReactNode[] = [];

  for (const controller of overlays) {
    if (controller.config.hasBackdrop) {
      nodes.push(
        <div style={{ zIndex: 1000 }} className={classNames(controller.config.backdropClass)} onClick={(event) => {
          event.stopPropagation();
          controller._backdropClick.next(event.nativeEvent);
        }} />
      );
    }
    nodes.push(controller.node);
  }

  return <>
    {nodes}
  </>;
}