import React from "react";
import { Observable } from "rxjs";
import { OverlayConfig } from "./OverlayConfig";

export interface OverlayReference {
  attach: (component: React.Component) => any;
  detach: () => any;
  dispose: () => void;
  overlayElement: HTMLElement;
  hostElement: HTMLElement;
  backdropElement: HTMLElement | null;
  getConfig: () => any;
  hasAttached: () => boolean;
  updateSize: (config: any) => void;
  updatePosition: () => void;
  backdropClick: () => Observable<MouseEvent>;
  attachments: () => Observable<void>;
  detachments: () => Observable<void>;
  keydownEvents: () => Observable<KeyboardEvent>;
  outsidePointerEvents: () => Observable<MouseEvent>;
  addPanelClass: (classes: string | string[]) => void;
  removePanelClass: (classes: string | string[]) => void;
}

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export class OverlayRef implements OverlayReference {
  constructor(
    public overlayElement: HTMLElement,
    public hostElement: HTMLElement,
    public config: OverlayConfig,
  ) { }

  /** Gets the current overlay configuration, which is immutable. */
  getConfig(): OverlayConfig {
    return this.config;
  }
}
