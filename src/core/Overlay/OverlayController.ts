import React from "react";
import { Observable, Subject, Subscription } from "rxjs";
import classNames from "classnames";

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

  #applySubscrption?: Subscription;

  constructor(
    public config: OverlayConfig
  ) { }

  attach(node: React.ReactNode) {
    if (this.attached) {
      throw new Error("Overlay is already attached.");
    }

    this.node = React.createElement(
      'div', 
      { ref: this.overlayRef, className: classNames(this.config.panelClass) },
      node
    );

    this.#overlay.append(this);

    this.config.positionStrategy?.attach(this);

    this.#applySubscrption = this.overlayRef.observable.subscribe((element) => {
      if (element) {
        this.config.positionStrategy?.apply();
      }
    });

    this.attached = true;

    return this;
  }

  detach() {
    this.#overlay.remove(this);
    this.attached = false;
    this.#applySubscrption?.unsubscribe();
  }
}
