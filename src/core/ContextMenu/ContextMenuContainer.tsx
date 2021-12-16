import { useObservableState } from 'observable-hooks'

import MenuPanel from './MenuPanel';
import { useContextMenuService } from '../ServiceHooks';

import './style.less';

export default function ContextMenuContainer() {

  const contextMenuService = useContextMenuService();

  const panels = useObservableState(contextMenuService.panels$);

  const path = useObservableState(contextMenuService.path$);

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
