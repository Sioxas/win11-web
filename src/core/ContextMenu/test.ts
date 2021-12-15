import { ContextMenuItem } from "./interface";

export const menus: ContextMenuItem[] = [
  { text: 'Menu 1' },
  { text: '一二三四五' },
  { text: 'Menu 3' },
  { text: 'Menu 4', disabled: true },
  {
    text: '这个菜单就很长长长',
    children: [
      { text: 'Menu 5.1' },
      { text: 'Menu 5.2' },
      { text: '看看长长的菜单文字有多长' },
      { text: 'Menu 5.4', disabled: true },
    ]
  },
  { text: 'Menu 6' },
  { text: 'Menu 7' },
];