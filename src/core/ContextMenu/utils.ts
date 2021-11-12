import { ContextMenuItem, ContextMenuType } from "./interface";

export function getMenuHeight(options: ContextMenuItem[]){
  return options
  .map(option => option.type === ContextMenuType.Separator ? 17 : 24)
  .reduce((a, b) => a + b, 0) + 20;
}