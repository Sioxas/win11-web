import { WindowController } from "@/core/WindowController";
import WindowService, { WindowOptions, WindowViewProps } from "@/core/WindowService";
import { Constructor } from "@/utils/interface";
import ApplicationService from "./ApplicationService";

export default abstract class Application {
  public static readonly appIcon: string = '📦';
  public static readonly appName: string = 'Application';
  public static readonly appVersion: string = '0.0.1';
  public static readonly appDescription: string = 'Application description';

  windows = new Set<WindowController<typeof this>>();

  launchBy?: Constructor<Application>;

  constructor(private windowService: WindowService, private appService: ApplicationService) { }

  protected createWindow<P>(
    options: WindowOptions,
    component: React.ComponentType<P & WindowViewProps<typeof this>>,
    props?: P
  ) {
    const controller = this.windowService.createWindow(this, options, component, props);
    this.windows.add(controller);
    return controller;
  }

  protected closeWindow(windowController: WindowController<typeof this>) {
    this.windowService.closeWindow(windowController);
    this.windows.delete(windowController);
    if (this.windows.size === 0) {
      this.appService.terminate(<Constructor<Application>>this.constructor);
      this.onDestroy();
    }
  }

  abstract launch(args?: string[]): void;

  onClose(controller: WindowController<typeof this>) {
    this.closeWindow(controller);
  }

  onDestroy() { }

}