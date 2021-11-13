import { ContextMenuItem, ContextMenuType } from "./interface";

export function getMenuHeight(options: ContextMenuItem[]){
  return options
  .map(option => option.type === ContextMenuType.Separator ? 17 : 24)
  .reduce((a, b) => a + b, 0) + 20;
}

export function getAjustedPosition(x:number, y:number, options: ContextMenuItem[]){
  const
    width = 120,
    height = getMenuHeight(options),
    top = Math.min(y, window.innerHeight - height),
    left = (x > window.innerWidth - width ? x - width : x) + 4;
  return [left, top];
}