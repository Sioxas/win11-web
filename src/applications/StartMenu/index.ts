import { WindowLevel, WindowPosition, WindowType } from "@/core/enums";
import RelativePosition from "@/utils/RelativePosition";
import Point from "@/utils/Point";
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
      width: 620,
      height: 700,
      position: new RelativePosition(WindowPosition.CENTER, WindowPosition.BOTTOM, new Point(0, -10)),
      windowAnimateKeyFrames: [
        { transform: 'translateY(100%)' },
        { transform: 'translateY(0)' },
      ]
    }, StartMenuView);
    const subscription = controller.active$.subscribe((active) => {
      if(!active) {
        controller.close();
        subscription.unsubscribe();
      }
    });
  }
}