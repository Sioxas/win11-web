import { WindowLevel, WindowResizeType, WindowType } from "@/core/enums";
import Application from "../../core/Application";
import StartMenuView from "./StartMenuView";

import icon from "./start.png";

export default class StartMenu extends Application {
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'StartMenu';
  public static readonly appDescription: string = '开始菜单';

  launch(args?: string[]): void {
    this.createWindow({
      type: WindowType.BORDER_LESS,
      level: WindowLevel.TOP,
      availableResizeType: WindowResizeType.NORMAL,
    }, StartMenuView);
  }

  onClose(): void {
    
  }
}