import { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';

import Window from './Window';
import { useApplicationService, useWindowService } from './ServiceHooks';
import { ContextMenuContainer } from './ContextMenu';
import TaskBar from './TaskBar/TaskBar';

import './Windows.less';

export default function Windows() {

  const windowContainerRef = useRef<HTMLDivElement>(null);

  const appService = useApplicationService();

  const windowService = useWindowService();

  const windows = useObservableState(windowService.windows$);

  useEffect(() => {
    windowService.init(windowContainerRef.current!);
    appService.onStartUp();
  }, []);

  return (
    <>
      <div className="windows">
        <div ref={windowContainerRef} className="windows-container" onPointerDown={()=>windowService.setDesktopActive()}>
          {windows?.map(([controller, config]) => (
            <Window key={controller.windowId} controller={controller}>
              <config.component {...config.props} />
            </Window>
          ))}
        </div>
        <TaskBar />
      </div>
      <ContextMenuContainer />
    </>
  );
}
