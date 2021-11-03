import { WindowController } from "@/core/WindowController";
import Application, { LuanchSource } from "../../core/Application";
import ExplorerView from "./ExplorerView";

import icon from './explorer.png';

export default class Explorer extends Application{
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'Explorer';
  public static readonly appVersion: string = '0.0.1';
  public static readonly appDescription: string = '文件资源管理器';

  #windows = new Set<WindowController>();

  luanch(from: LuanchSource, args: string[]): void {
    const controller = this.windowService.createWindow({
      title: 'Explorer',
    }, ExplorerView);
    this.#windows.add(controller);
  }

  onClose(controller: WindowController): void {
    this.windowService.closeWindow(controller);
    this.#windows.delete(controller);
  }
  
}