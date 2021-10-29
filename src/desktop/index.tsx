import WindowsContainer from '@/window/WindowsContainer';

import TaskBar from './TaskBar';
import Wallpaper from './Wallpaper';

export default function Desktop() {
  return <>
    <Wallpaper />
    <TaskBar />
    <WindowsContainer />
  </>;
}