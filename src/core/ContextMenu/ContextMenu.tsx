import classNames from "classnames";

import { useContextMenuService } from "../Services";
import { ContextMenuItem, ContextMenuType } from "./interface";
import { getMenuHeight } from "./utils";

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuItem[];
  path: ContextMenuItem[];
}

export default function ContextMenu(props: ContextMenuProps) {
  const { x, y, options } = props;

  const contextMenuService = useContextMenuService();

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
    height = getMenuHeight(options),
    top = Math.min(y, window.innerHeight - height) + 'px', // FIXME: window.innerHeight
    left = (x > window.innerWidth - width ? x - width : x) + 4 + 'px'; // FIXME: window.innerWidth

  return (
    <ul className="context-menu" style={{ left, top }}>
      {options.map((option, index) => {

        const { type, text, icon, shortcut, checked, disabled, children } = option;

        switch (type) {
          case ContextMenuType.Separator:
            return <li key={`separator-${index}`} className="context-menu-separator">
              {text
                ? <div className="context-menu-separator-text">{text}</div>
                : <div className="context-menu-separator-line" />
              }
            </li>;
          case ContextMenuType.QuickActions:
            return <li key={`quick-actions-${index}`} className="context-menu-item-quick-actions"> 
              {children?.map(child => <div className="context-menu-item-quick-action-icon">
                {child.icon && <img src={child.icon} />}  
              </div>)}
            </li>;
          default:
            return (
              <li key={`item-${index}`} 
                onPointerEnter={(event) => contextMenuService.onPointerEnter(event, [...props.path, option])}
                className={classNames('context-menu-item', {
                  'context-menu-item-disabled': disabled,
                })}
              >
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
        }
      })}
    </ul>
  );
}


