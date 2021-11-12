import { useEffect } from 'react';
import { useObservableState } from 'observable-hooks'

import ContextMenu from './ContextMenu';
import { useContextMenuService } from '../ServiceHooks';

import { menus } from './test';

import './style.less';

export default function ContextMenuContainer() {

  const contextMenuService = useContextMenuService();

  const menuPanels = useObservableState(contextMenuService.menuPanels$);

  const path = useObservableState(contextMenuService.path$);

  useEffect(() => {
    function handleContextmenu(e: MouseEvent) {
      e.preventDefault();
      contextMenuService.show(e.clientX, e.clientY, menus);
    }
    document.body.addEventListener('contextmenu', handleContextmenu);
    return () => {
      document.body.removeEventListener('contextmenu', handleContextmenu);
    }
  }, []);

  if (!menuPanels.length) return null;

  return (
    <div className="fullscreen-prevent-events" onClick={() => contextMenuService.close()}>
      {
        menuPanels.map((panel, index) => <ContextMenu
          key={index}
          x={panel.x}
          y={panel.y}
          options={panel.options}
          path={path.slice(0, index)}
        />)
      }
    </div>
  );
}
