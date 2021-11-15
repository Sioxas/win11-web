import Desktop from "./Desktop";
import Explorer from "./Explorer";
import StartMenu from "./StartMenu";
import TaskBar from "./TaskBar";

export const INSTALLED = [
  Desktop,
  TaskBar,
  StartMenu,
  Explorer,
];

export const LAUNCH_ON_STARTUP = [
  Desktop,
  TaskBar,
  Explorer,
];

export const PIN_TO_TASKBAR = [
  StartMenu,
  Explorer,
];