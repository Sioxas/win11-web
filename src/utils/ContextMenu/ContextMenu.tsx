import classNames from "classnames";
import { ContextMenuItem, ContextMenuType } from "./interface";

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuItem[];
  path: ContextMenuItem[];
  onHover: (event: React.MouseEvent<HTMLElement>, path: ContextMenuItem[]) => void;
  onSelect: (path: ContextMenuItem[]) => void;
}

export default function ContextMenu(props: ContextMenuProps) {
  const { x, y, options } = props;

  let
    hasCheckbox = false,
    hasIcon = false;

  for (const option of options) {
    if (option.type !== ContextMenuType.Menu)
      continue;
    if (option.checked)
      hasCheckbox = true;
    if (option.icon)
      hasIcon = true;
    if (hasCheckbox && hasIcon)
      break;
  }

  const
    width = 120,
    height = options
      .map(option => option.type === ContextMenuType.Separator ? 17 : 24)
      .reduce((a, b) => a + b, 0) + 20,
    top = Math.min(y, window.innerHeight - height) + 'px', // FIXME: window.innerHeight
    left = (x > window.innerWidth - width ? x - width : x) + 4 + 'px'; // FIXME: window.innerWidth

  return (
    <ul className="context-menu" style={{ left, top }}>
      {options.map((option) => {

        const { type, key, text, icon, shortcut, checked, disabled, children } = option;

        switch (type) {
          case ContextMenuType.Menu:
            return (
              <li key={key} className={classNames('context-menu-item', {
                'context-menu-item-disabled': disabled,
              })}>
                {hasCheckbox && <span className="context-menu-item-checkmark">{checked ? '√' : ''}</span>}
                {hasIcon && <div className="context-menu-item-icon">
                  {icon && <img src={icon} />}
                </div>}
                <div className="context-menu-item-title">
                  {text}
                </div>
                {shortcut && <span className="context-menu-item-shortcut">{shortcut}</span>}
                {children && children.length > 0 && <span className="context-menu-item-children-mark">{'>'}</span>}
              </li>
            );
          case ContextMenuType.Separator:
            return <li key={key} className="context-menu-separator">
              {text
                ? <div className="contextmenu-separator-text">{text}</div>
                : <div className="contextmenu-separator-line" />
              }
            </li>;
          case ContextMenuType.QuickActions:
            return <li key={key} className="context-menu-item-quick-actions"> 
              {children?.map(child => <div className="context-menu-item-quick-action-icon">
                {child.icon && <img src={child.icon} />}  
              </div>)}
            </li>;
        }
      })}
    </ul>
  );
}


