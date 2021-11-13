import { WindowLevel, WindowPosition, WindowType } from "@/core/enums";
import { WindowController } from "@/core/WindowController";
import Application, { LuanchSource } from "../../core/Application";

import TaskBarView from "./TaskBarView";

export default class TaskBar extends Application{
  public static readonly appName: string = 'TaskBar';
  public static readonly appDescription: string = '任务栏';

  luanch(from: LuanchSource, args?: string[]): void {
    const controller = this.createWindow({
      type: WindowType.BORDER_LESS,
      level: WindowLevel.TOP,
      position: WindowPosition.LEFT | WindowPosition.BOTTOM,
      width: window.innerWidth,
      height: 40,
    }, TaskBarView);
    window.addEventListener('resize', () => {
      controller.rect!.width = window.innerWidth;
    });
  }

  onClose(controller: WindowController<this>): void {
    this.closeWindow(controller);
  }
}