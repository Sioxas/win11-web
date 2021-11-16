import Application from "./Application";
import Service from "./Service";
import WindowService from "./WindowService";
import { LAUNCH_ON_STARTUP } from "../applications";
import { Constructor } from "@/utils/interface";

export default class ApplicationService extends Service {

  #apps = new Map<Constructor<Application>, Application>();

  constructor(private windowService: WindowService) {
    super();
  }

  onStartUp() {
    for (const App of LAUNCH_ON_STARTUP) {
      this.#launch(App);
    }
  }

  launch(App: Constructor<Application>, launchBy: Constructor<Application>) {
    this.#launch(App, launchBy);
  }

  terminate(App: Constructor<Application>) {
    const app = this.#apps.get(App);
    if (app) {
      app.onDestroy();
      this.#apps.delete(App);
    }
  }

  #launch(App: Constructor<Application>, launchBy?: Constructor<Application>) {
    let app = this.#apps.get(App);
    if (!app) {
      app = new App(this.windowService, this);
      this.#apps.set(App, app);
    }
    app.launch();
    app.launchBy = launchBy;
  }
}