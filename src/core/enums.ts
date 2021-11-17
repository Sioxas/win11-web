export enum WindowType {
  NORMAL,
  BORDER_LESS,
  FULLSCREEN,
}

export enum WindowLevel {
  TOP = 200,
  MIDDLE = 100,
  BOTTOM = 0,
}

export enum WindowResizeType {
  NORMAL = 1,
  MINIMIZED = 2,
  MAXIMIZED = 4,
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

export enum WindowPosition {
  CENTER = 0,
  TOP = 1,
  RIGHT = 2,
  BOTTOM = 4,
  LEFT = 8,
}