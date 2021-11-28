import { WindowController } from "@/core/WindowController";
import WindowService, { WindowOptions, WindowViewProps } from "@/core/WindowService";
import { Constructor } from "@/utils/interface";
import ApplicationService from "./ApplicationService";

import win11Icon from "@/assets/icons/start.png";

export default abstract class Application {
  public static readonly appIcon: string = win11Icon;
  public static readonly appName: string = 'Application';
  public static readonly appVersion: string = '0.0.1';
  public static readonly appDescription: string = 'Application description';

  windows = new Set<WindowController<typeof this>>();

  launchBy?: Constructor<Application>;

  runInBackground = false;

  private windowService = WindowService.getInstance();
  private appService = ApplicationService.getInstance();

  protected createWindow<P>(
    options: WindowOptions,
    component: React.ComponentType<P & WindowViewProps<typeof this>>,
    props?: P
  ) {
    const controller = this.windowService.createWindow(this, options, component, props);
    this.windows.add(controller);
    return controller;
  }

  protected createWidget(){
    // TODO:
  }

  protected async closeWindow(windowController: WindowController<typeof this>) {
    await this.windowService.closeWindow(windowController);
    this.windows.delete(windowController);
    if (this.windows.size === 0 && !this.runInBackground) {
      await this.exit();
    }
  }

  protected async exit() {
    if(this.windows.size > 0) {
      await Promise.all(Array.from(this.windows).map(async (windowController) => {
        await this.closeWindow(windowController);
      }));
    }
    this.appService.terminate(<Constructor<Application>>this.constructor);
    this.onDestroy();
  }

  abstract launch(args?: string[]): void;

  onCloseWindow(controller: WindowController<typeof this>) {
    this.closeWindow(controller);
  }

  onDestroy() { }

}