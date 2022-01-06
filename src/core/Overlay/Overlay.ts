import { BehaviorSubject } from "rxjs";

import Service from "@/utils/Service";
import { OverlayConfig } from "./OverlayConfig";
import OverlayController from "./OverlayController";
import { OverlayPositionBuilder } from "./OverlayPositionBuilder";

import './style.less';

export default class Overlay extends Service {

  overlays$ = new BehaviorSubject<OverlayController[]>([]);

  #positionBuilder = new OverlayPositionBuilder();

  constructor() {
    super();
  }

  position(){
    return this.#positionBuilder;
  }

  create(config?: OverlayConfig){
    const overlayConfig = new OverlayConfig(config);
    return new OverlayController(overlayConfig);
  }

  append(overlay: OverlayController){
    this.overlays$.next([...this.overlays$.getValue(), overlay]);
  }

  remove(overlay: OverlayController){
    this.overlays$.next(this.overlays$.getValue().filter((o) => o !== overlay));
  }

}