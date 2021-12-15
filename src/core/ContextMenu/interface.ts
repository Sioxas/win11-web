export enum ContextMenuType {
  Menu,
  Separator,
  QuickActions,
}

export interface ContextMenuItem {
  text: string;
  type?: ContextMenuType;
  icon?: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  children?: ContextMenuItem[];
  onSelect?: (path: ContextMenuItem[]) => void;
}
