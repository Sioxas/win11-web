import React, { ComponentClass, FunctionComponent } from "react";
import { Observable, Subject } from "rxjs";

import { ObservableRef } from "@/utils/ObservableRef";
import Overlay from "./Overlay";
import { OverlayConfig } from "./OverlayConfig";

export default class OverlayController {

  /** Overlay element ref */
  overlayRef = new ObservableRef<HTMLElement>(null);

  node: React.ReactNode;

  /** Weather overlay is attached to DOM */
  attached = false;

  /** Gets an observable that emits when the backdrop has been clicked. */
  get backdropClick$(): Observable<MouseEvent> {
    return this._backdropClick.asObservable();
  }

  /** @internal */
  _backdropClick = new Subject<MouseEvent>();

  /** Overlay Service */
  #overlay = Overlay.getInstance();

  constructor(
    public config: OverlayConfig
  ) {

  }

  attach<P extends { ref: React.RefObject<HTMLElement> }>(
    component: FunctionComponent<P> | ComponentClass<P>, 
    props?: Omit<P, 'ref'>
  ) {
    if (this.attached) {
      throw new Error("Overlay is already attached.");
    }

    this.node = React.createElement(component, { ...props, ref: this.overlayRef } as unknown as P);

    this.#overlay.append(this);

    this.config.positionStrategy?.attach(this);

    this.attached = true;

    return this;
  }

  detach() {
    this.#overlay.remove(this);
    this.attached = false;
  }
}
