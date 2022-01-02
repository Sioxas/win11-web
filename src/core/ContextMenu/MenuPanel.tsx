import classNames from "classnames";

import { ContextMenuItem, ContextMenuType } from "./interface";
import MenuPanelController from "./MenuPanelController";

interface ContextMenuProps {
  panel: MenuPanelController;
}

export default function MenuPanel({ panel }: ContextMenuProps) {

  const { options } = panel;

  let hasCheckbox = false, hasIcon = false;

  for (const option of options) {
    if (option.type === ContextMenuType.Separator)
      continue;
    if (option.checked)
      hasCheckbox = true;
    if (option.icon)
      hasIcon = true;
    if (hasCheckbox && hasIcon)
      break;
  }

  return (
    <ul className="context-menu">
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
                onPointerEnter={(event) => panel.onPointerEnter(event, option)}
                className={classNames('context-menu-item', {
                  'context-menu-item-disabled': disabled,
                })}
                onClick={() => {
                  if(!option.disabled){
                    option.onSelect?.(option);
                    
                  }
                }}
              >
                {hasCheckbox && <span className="context-menu-item-checkmark">{checked ? '√' : ''}</span>}
                {hasIcon && <div className="context-menu-item-icon">
                  {icon && (icon.startsWith('icon') ? <i className={`iconfont ${icon}`} /> : <img src={icon} />)}
                </div>}
                <div className="context-menu-item-title">
                  {text}
                </div>
                {shortcut && <div className="context-menu-item-shortcut">{shortcut}</div>}
                {children && children.length > 0 && <div className="context-menu-item-children-mark">
                  <i className="iconfont icon-right"></i>
                </div>}
              </li>
            );
        }
      })}
    </ul>
  );
}


