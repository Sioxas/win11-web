import { WindowLevel, WindowType } from "@/core/enums";
import { WindowController } from "@/core/WindowController";
import Application, { LuanchSource } from "../../core/Application";
import StartMenuView from "./StartMenuView";

import icon from "./icon.png";

export default class StartMenu extends Application {
  public static readonly appIcon: string = icon;
  public static readonly appName: string = 'StartMenu';
  public static readonly appDescription: string = '开始菜单';

  #controller?: WindowController;

  luanch(from: LuanchSource, args: string[]): void {
    this.#controller = this.windowService.createWindow({
      type: WindowType.BORDER_LESS,
      level: WindowLevel.TOP
    }, StartMenuView);
  }

  onClose(): void {
    if (this.#controller) {
      this.windowService.closeWindow(this.#controller);
      this.#controller = undefined;
    }
  }
}