import { WindowLevel, WindowType } from "@/core/enums";
import { WindowController } from "@/core/WindowController";
import Application, { LuanchSource } from "../../core/Application";

import TaskBarView from "./TaskBarView";

export default class TaskBar extends Application{
  public static readonly appName: string = 'TaskBar';
  public static readonly appDescription: string = '任务栏';

  #windows = new Set<WindowController>();

  luanch(from: LuanchSource, args: string[]): void {
    const controller = this.windowService.createWindow({
      type: WindowType.BORDER_LESS,
      level: WindowLevel.TOP
    }, TaskBarView);
    this.#windows.add(controller);
  }

  onClose(controller: WindowController): void {
    this.windowService.closeWindow(controller);
    this.#windows.delete(controller);
  }
  
}