import { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';

import Window from './Window';
import { useApplicationService, useWindowService } from './ServiceHooks';

import './WindowsContainer.less';

export default function WindowsContainer() {

  const windowContainerRef = useRef<HTMLDivElement>(null);

  const appService = useApplicationService();

  const windowService = useWindowService();

  const windows = useObservableState(windowService.windows$);

  useEffect(() => {
    windowService.init(windowContainerRef.current!);
    appService.onStartUp();
  }, []);

  return (
    <div className="windows-container-wrapper">
      <div ref={windowContainerRef} className="windows-container">
        {windows.map(([controller, config]) => (
          <Window key={controller.windowId} controller={controller}>
            <config.component {...config.props} />
          </Window>
        ))}
      </div>
    </div>
  );
}