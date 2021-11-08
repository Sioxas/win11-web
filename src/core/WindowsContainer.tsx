import { useEffect, useMemo, useRef, useState } from 'react';

import WindowService, { WindowViewConfig } from './WindowService';
import { WindowController } from './WindowController';
import Window from './Window';

import './WindowsContainer.less';

export default function WindowsContainer() {

  const [windows, setWindows] = useState<[WindowController, WindowViewConfig][]>([]);

  const windowContainerRef = useRef<HTMLDivElement>(null);

  const windowService = useMemo(() => new WindowService(setWindows), []);

  useEffect(() => {
    windowService.init(windowContainerRef.current!);
  }, []);

  return (
    <div className="windows-container-wrapper">
      <div ref={windowContainerRef} className="windows-container">
        {windows.map(([controller, config]) => (
          <Window controller={controller}>
            <config.component {...config.props} />
          </Window>
        ))}
      </div>
    </div>
  );
}