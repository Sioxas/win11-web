import { WindowController } from "@/core/WindowController";
import WindowService from "@/core/WindowService";

export enum LuanchSource {
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

  constructor(protected windowService: WindowService) {
  }

  abstract luanch(from: LuanchSource, args: string[]): void;

  abstract onClose(controller: WindowController): void;

}