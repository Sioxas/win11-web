import React from "react";
import { BehaviorSubject } from "rxjs";

import Service from "../Service";
import { OverlayConfig } from "./OverlayConfig";
import OverlayController from "./OverlayController";
import { OverlayPositionBuilder } from "./OverlayPositionBuilder";

export default class Overlay extends Service {

  overlays$ = new BehaviorSubject<OverlayController[]>([]);

  #positionBuilder = new OverlayPositionBuilder();

  constructor(){
    super();
  }

  position(){
    return this.#positionBuilder;
  }

  create(config?: OverlayConfig){
    const overlayConfig = new OverlayConfig(config);
    const overlay = new OverlayController(overlayConfig);
    return overlay;
  }

}