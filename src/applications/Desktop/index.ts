import { WindowLevel, WindowType } from '@/core/enums';
import { WindowController } from '@/core/WindowController';
import Application from '../../core/Application';
import Wallpaper from './Wallpaper';

export default class Desktop extends Application {

  #wallpaper?: WindowController<this>;

  launch(args?: string[]): void {
    this.#wallpaper = this.createWindow({
      type: WindowType.FULLSCREEN,
      level:WindowLevel.BOTTOM,
      titleBar: false,
    }, Wallpaper);
    
  }

  onClose(controller: WindowController<Desktop>): void {
    if (this.#wallpaper === controller) {
      this.closeWindow(this.#wallpaper);
    }
  }
}