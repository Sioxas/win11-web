import { ColoredIconGlyph } from "@/components/Icon";

export enum ContextMenuType {
  Menu,
  Separator,
  QuickActions,
}

export interface ContextMenuItem {
  text?: string;
  type?: ContextMenuType;
  icon?: string | ColoredIconGlyph;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  children?: ContextMenuItem[];
  onSelect?: (option: ContextMenuItem) => void;
}
