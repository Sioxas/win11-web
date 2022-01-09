import { RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import { useOverlay } from '@/core/ServiceHooks';
import { ConnectionPositionPair } from '@/core/Overlay/PositioinStrategy';

interface ConnectedOverlayProps {
  connectedTo: RefObject<HTMLElement>;
  positions?: ConnectionPositionPair[];
  verticalFlexable?: boolean;
  horizontalFlexable?: boolean;
  panelClass?: string | string[];
  hasBackdrop?: boolean;
  backdropClass?: string | string[];
  onBackdropClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

export default function ConnectedOverlay({
  connectedTo,
  positions,
  verticalFlexable,
  horizontalFlexable,
  panelClass = 'overlay-panel',
  hasBackdrop = false,
  backdropClass = 'overlay-transparent-backdrop',
  onBackdropClick,
  children
}: ConnectedOverlayProps) {
  const overlay = useOverlay();

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const positionStrategy = overlay.position().flexibleConnectedTo(connectedTo);
    if (Array.isArray(positions) && positions.length > 0) {
      positionStrategy.withPositions(positions);
    }
    if (verticalFlexable) {
      positionStrategy.withVerticalFlexible(true);
    }
    if (horizontalFlexable) {
      positionStrategy.withHorizontalFlexible(true);
    }
    positionStrategy.attach(overlayRef);
    positionStrategy.apply();
    return () => {
      positionStrategy.detach();
    }
  }, []);

  return createPortal(<>
    {hasBackdrop && <div style={{ zIndex: 1000 }} className={classNames(backdropClass)} onClick={onBackdropClick} />}
    <div ref={overlayRef} style={{ zIndex: 1000 }} className={classNames(panelClass)}>
      {children}
    </div>
  </>, document.body);
}