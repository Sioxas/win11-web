import { BehaviorSubject } from "rxjs";

import Service from "../Service";
import { OverlayConfig } from "./OverlayConfig";
import OverlayController from "./OverlayController";
import { OverlayPositionBuilder } from "./OverlayPositionBuilder";

import './style.less';

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

  append(overlay: OverlayController){
    this.overlays$.next([...this.overlays$.getValue(), overlay]);
  }

  remove(overlay: OverlayController){
    this.overlays$.next(this.overlays$.getValue().filter((o) => o !== overlay));
  }

}