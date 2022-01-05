import { BehaviorSubject } from "rxjs";
import { Service } from 'typedi';

import Application from "./Application";
import { LAUNCH_ON_STARTUP } from "../applications";
import { Constructor } from "@/utils/interface";

@Service()
export default class ApplicationService {

  #apps = new Map<Constructor<Application>, Application>();

  #apps$: BehaviorSubject<[Constructor<Application>, Application][]>;

  get apps$() {
    return this.#apps$.asObservable();
  }

  constructor() {
    this.#apps$ = new BehaviorSubject(Array.from(this.#apps.entries()));
  }

  onStartUp() {
    for (const App of LAUNCH_ON_STARTUP) {
      this.launch(App);
    }
  }

  terminate(App: Constructor<Application>) {
    const app = this.#apps.get(App);
    if (app) {
      app.onDestroy();
      this.#apps.delete(App);
      this.#triggerAppsChange();
    }
  }

  launch(App: Constructor<Application>, launchBy?: Constructor<Application>) {
    let app = this.#apps.get(App);
    if (!app) {
      app = new App();
      this.#apps.set(App, app);
      this.#triggerAppsChange();
    }
    app.launch();
    app.launchBy = launchBy;
  }

  #triggerAppsChange() {
    this.#apps$.next(Array.from(this.#apps.entries()));
  }
}