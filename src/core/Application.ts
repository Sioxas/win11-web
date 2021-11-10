import { WindowController } from "@/core/WindowController";
import WindowService, { WindowOptions, WindowViewProps } from "@/core/WindowService";

export enum LuanchSource {
  StartUp,
  Desktop,
  Taskbar,
  StartMenu,
  Application,
  File,
  Url,
}

export default abstract class Application {
  public static readonly appIcon: string = '📦';
  public static readonly appName: string = 'Application';
  public static readonly appVersion: string = '0.0.1';
  public static readonly appDescription: string = 'Application description';

  constructor(private windowService: WindowService) {}

  windows = new Set<WindowController<typeof this>>();

  protected createWindow<P>(
    options: WindowOptions,
    component: React.ComponentType<P & WindowViewProps<typeof this>>,
    props?: P
  ){
    const controller = this.windowService.createWindow(this, options, component, props);
    this.windows.add(controller);
    return controller;
  }

  protected closeWindow(windowController: WindowController<typeof this>) {
    this.windowService.closeWindow(windowController);
    this.windows.delete(windowController);
  }

  abstract luanch(from: LuanchSource, args?: string[]): void;

  abstract onClose(controller: WindowController<typeof this>): void;

}