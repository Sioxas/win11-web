export enum ContextMenuType {
  Menu,
  Separator,
  QuickActions,
}

export interface ContextMenuItem {
  type: ContextMenuType;
  key: string;
  text: string;
  icon?: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  children?: ContextMenuItem[];
  onSelect?: (path: ContextMenuItem[]) => void;
}

export interface MenuPanel{
  x: number;
  y: number;
  options: ContextMenuItem[];
}