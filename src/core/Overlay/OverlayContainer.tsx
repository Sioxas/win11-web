import classNames from "classnames";
import { useObservableState } from "observable-hooks";

import { useService } from "../../utils/useService";
import Overlay from "./Overlay";

export default function OverlayContainer() {
  const overlay = useService(Overlay);

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