export enum WindowType {
  NORMAL,
  BORDER_LESS,
  FULLSCREEN,
}

export enum WindowLevel {
  TOP = 1000,
  MIDDLE = 100,
  BOTTOM = 0,
}

export enum WindowStatus {
  NORMAL,
  MINIMIZED,
  MAXIMIZED,
}

export enum WindowControlButton {
  NONE = 0,
  MINIMIZE = 1,
  MAXIMIZE = 2,
  CLOSE = 4,
}

export enum WindowResizer {
  NONE = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 4,
  LEFT = 8,
}