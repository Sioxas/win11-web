import { WindowLevel, WindowType } from '@/core/enums';
import { WindowController } from '@/core/WindowController';
import Application, { LuanchSource } from '../../core/Application';
import Wallpaper from './Wallpaper';

export default class Desktop extends Application {

  #wallpaper?: WindowController;

  luanch(from: LuanchSource, args: string[]): void {
    this.#wallpaper = this.windowService.createWindow({
      type: WindowType.FULLSCREEN,
      level:WindowLevel.BOTTOM,
      titleBar: false,
    }, Wallpaper);
    
  }

  onClose(controller: WindowController): void {
    if (this.#wallpaper === controller) {
      this.windowService.closeWindow(this.#wallpaper);
    }
  }

}