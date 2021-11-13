import { WindowLevel, WindowType } from "@/core/enums";
import Application, { LuanchSource } from "../../core/Application";
import StartMenuView from "./StartMenuView";

import icon from "./start.png";

export default class StartMenu extends Application {
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'StartMenu';
  public static readonly appDescription: string = '开始菜单';

  luanch(from: LuanchSource, args?: string[]): void {
    this.createWindow({
      type: WindowType.BORDER_LESS,
      level: WindowLevel.TOP
    }, StartMenuView);
  }

  onClose(): void {
    
  }
}