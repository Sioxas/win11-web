import classNames from "classnames";

import { ContextMenuItem, ContextMenuType } from "./interface";
import MenuPanelController from "./MenuPanelController";

interface ContextMenuProps {
  panel: MenuPanelController;
  path: ContextMenuItem[];
}

export default function MenuPanel({ panel, path }: ContextMenuProps) {
  const { x, y, width, options, hasCheckbox, hasIcon } = panel;

  const [left, top] = [x, y].map(v => v + "px");

  return (
    <ul className="context-menu" style={{ left, top, width: `${width}px` }}>
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
                onPointerEnter={(event) => panel.onPointerEnter(event, [...path, option])}
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


