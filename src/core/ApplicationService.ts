import Application, { LuanchSource } from "./Application";
import { LUNCH_ON_STARTUP } from "./config";
import WindowService from "./WindowService";

export default class ApplicationService{
  #applications = new Set<Application>();

  constructor(private windowService: WindowService){}

  onStartUp(){
    for(const App of LUNCH_ON_STARTUP){
      const app = new App(this.windowService);
      this.#applications.add(app);
      app.luanch(LuanchSource.StartUp);
    }
  }
}