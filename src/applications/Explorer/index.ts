import { WindowController } from "@/core/WindowController";
import Application from "../../core/Application";
import ExplorerView from "./ExplorerView";

import icon from './explorer.png';

export default class Explorer extends Application{
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'Explorer';
  public static readonly appVersion: string = '0.0.1';
  public static readonly appDescription: string = '文件资源管理器';

  launch(args?: string[]): void {
    this.createWindow({}, ExplorerView);
  }

  onCloseWindow(controller: WindowController<this>): void {
    this.closeWindow(controller);
  }
  
}