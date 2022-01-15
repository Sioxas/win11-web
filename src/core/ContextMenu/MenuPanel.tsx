import classNames from "classnames";

import { ColoredIcon, ColoredIconGlyph, Icon } from "@/components/Icon";
import { ContextMenuType } from "./interface";
import MenuPanelController from "./MenuPanelController";

import './style.less';

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

        const hasChildren = children && children.length > 0;

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
                {child.icon && <ConetxtMenuIcon icon={child.icon} />}
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
                  if (!option.disabled && !hasChildren) {
                    panel.onSelect(option);
                  }
                }}
              >
                {hasCheckbox && <span className="context-menu-item-checkmark">{checked ? '√' : ''}</span>}
                {hasIcon && <div className="context-menu-item-icon">
                  {icon && <ConetxtMenuIcon icon={icon} />}
                </div>}
                <div className="context-menu-item-title">
                  {text}
                </div>
                {shortcut && <div className="context-menu-item-shortcut">{shortcut}</div>}
                {hasChildren && <div className="context-menu-item-children-mark">
                  <Icon name="right" />
                </div>}
              </li>
            );
        }
      })}
    </ul>
  );
}

interface ConetxtMenuIconProps {
  icon?: ColoredIconGlyph | string;
  image?: string;
}

function ConetxtMenuIcon({ icon, image }: ConetxtMenuIconProps) {
  if (image) {
    return <img src={image} />;
  } else if (typeof icon === 'string') {
    return <Icon name={icon} />;
  } else if (icon instanceof ColoredIconGlyph) {
    return <ColoredIcon glyph={icon} style={{ fontSize: '16px' }} />
  }
  return null;
}
