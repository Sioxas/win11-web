import React, { useEffect, useState } from 'react';
import ContextMenu from './ContextMenu';
import ContextMenuService from './ContextMenuService';
import { MenuPanel, ContextMenuItem } from './interface';

import './style.less';

interface ContextMenuContainerProps {
  contextMenuService: ContextMenuService;
}

export default function ContextMenuContainer({ contextMenuService }: ContextMenuContainerProps) {

  const [menuPanels, setMenuPanels] = useState<MenuPanel[]>([]);

  const [path, setPath] = useState<ContextMenuItem[]>([]);

  useEffect(()=>{
    const subscription = contextMenuService.contextMenuChange$.subscribe((panel) => {
      setMenuPanels([panel]);
      setPath([]);
    });
    return () => subscription.unsubscribe();
  },[]);

  function onHover(event: React.MouseEvent<HTMLElement>, path: ContextMenuItem[]) {
    if(!path.length) return;
    const last = path[path.length - 1];
    if (last.children && last.children.length > 0) {
      // TODO: 判断鼠标位置
      const x = event.clientX; // FIXME: 取元素位置
      const y = event.clientY;
      setMenuPanels(panels => [...panels, { x, y, options: last.children! }]);
      setPath(path);
    } 
  }

  function onSelect(path: ContextMenuItem[]) {
    if(!path.length) return;
    const last = path[path.length - 1];
    if (last.onSelect) {
      last.onSelect(path);
    }
    close();
  }

  function close() {
    setMenuPanels([]);
    setPath([]);
  }

  return (
    menuPanels.length && <div className="fullscreen-prevent-events" onClick={close}>
      {
        menuPanels.map((panel, index) => <ContextMenu
          key={index}
          x={panel.x}
          y={panel.y}
          options={panel.options}
          path={path.slice(0, index)}
          onHover={onHover}
          onSelect={onSelect}
        />)
      }
    </div>
  );
}
