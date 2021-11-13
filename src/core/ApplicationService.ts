import Application, { LuanchSource } from "./Application";
import Service from "./Service";
import WindowService from "./WindowService";
import { LUNCH_ON_STARTUP } from "../applications";

export default class ApplicationService extends Service{
  #applications = new Set<Application>();

  constructor(private windowService: WindowService){
    super();
  }

  onStartUp(){
    for(const App of LUNCH_ON_STARTUP){
      const app = new App(this.windowService);
      this.#applications.add(app);
      app.luanch(LuanchSource.StartUp);
    }
  }
}