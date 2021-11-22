import Desktop from "./Desktop";
import Explorer from "./Explorer";
import StartMenu from "./StartMenu";

export const INSTALLED = [
  Desktop,
  StartMenu,
  Explorer,
];

export const LAUNCH_ON_STARTUP = [
  Desktop,
  Explorer,
];

export const PIN_TO_TASKBAR = [
  StartMenu,
  Explorer,
];