import { useEffect } from 'react';
import { useObservableState } from 'observable-hooks'

import MenuPanel from './MenuPanel';
import { useContextMenuService } from '../ServiceHooks';

import { menus } from './test';

import './style.less';

export default function ContextMenuContainer() {

  const contextMenuService = useContextMenuService();

  const panels = useObservableState(contextMenuService.panels$);

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

  if (!panels.length) return null;

  return (
    <div className="fullscreen-prevent-events" onClick={() => contextMenuService.close()}>
      {
        panels.map((panel, index) => <MenuPanel
          key={index}
          panel={panel}
          path={path.slice(0, index)}
        />)
      }
    </div>
  );
}
