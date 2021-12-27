import React, { ComponentClass, FunctionComponent } from "react";
import { Observable, Subject } from "rxjs";

import Overlay from "./Overlay";
import { OverlayConfig } from "./OverlayConfig";

export default class OverlayController {

  private overlay = Overlay.getInstance();

  overlayRef = React.createRef<HTMLElement>();

  node: React.ReactNode;

  _backdropClick = new Subject<MouseEvent>();

  constructor(
    public config: OverlayConfig,
  ) { }

  attach<P extends { ref: React.RefObject<HTMLElement> }>(component: FunctionComponent<P> | ComponentClass<P>, props?: Omit<P, 'ref'>) {
    const newProps = { ...props, ref: this.overlayRef };
    this.node = React.createElement(component, newProps as P);
    this.overlay.overlays$.next([...this.overlay.overlays$.getValue(), this]);
    this.config.positionStrategy?.attach(this);
  }

  /** Gets an observable that emits when the backdrop has been clicked. */
  backdropClick(): Observable<MouseEvent> {
    return this._backdropClick;
  }
}