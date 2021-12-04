import { WindowLevel, WindowType } from "@/core/enums";
import Application from "../../core/Application";
import StartMenuView from "./StartMenu";

import icon from "./start.png";

export default class StartMenu extends Application {
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'StartMenu';
  public static readonly appDescription: string = '开始菜单';

  launch(args?: string[]): void {
    const controller = this.createWindow({
      type: WindowType.WIDGET,
      level: WindowLevel.TOP,
    }, StartMenuView);
    const subscription = controller.active$.subscribe((active) => {
      if(!active) {
        controller.close();
        subscription.unsubscribe();
      }
    });
  }
}