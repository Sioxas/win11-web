import { ContextMenuItem, ContextMenuType } from "./interface";

export const MENU_SEPARATOR_HEIGHT = 17;
export const MENU_ITEM_HEIGHT = 32;
export const MENU_PADDING = 4;
export const MENU_BORDER_WIDTH = 1;

export function getMenuHeight(options: ContextMenuItem[]) {
  const itemsHeight = options
    .map(option => option.type === ContextMenuType.Separator ? MENU_SEPARATOR_HEIGHT : MENU_ITEM_HEIGHT)
    .reduce((a, b) => a + b, 0);
  return itemsHeight + MENU_PADDING * 2 + MENU_BORDER_WIDTH * 2;
}

export function getAjustedPosition(x: number, y: number, options: ContextMenuItem[], parentMenuWidth: number = 0) {
  const
    width = 120,
    height = getMenuHeight(options),
    top = Math.min(y, window.innerHeight - height),
    left = x > window.innerWidth - width ? x - width - parentMenuWidth : x + 4;
  return [left, top];
}