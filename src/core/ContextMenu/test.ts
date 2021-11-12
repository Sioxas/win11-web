import { ContextMenuItem } from "./interface";

export const menus: ContextMenuItem[] = [
  { text: 'Menu 1' },
  { text: 'Menu 2' },
  { text: 'Menu 3' },
  { text: 'Menu 4', disabled: true },
  {
    text: 'Menu 5',
    children: [
      { text: 'Menu 5.1' },
      { text: 'Menu 5.2' },
      { text: 'Menu 5.3' },
      { text: 'Menu 5.4', disabled: true },
    ]
  },
  { text: 'Menu 6' },
  { text: 'Menu 7' },
];