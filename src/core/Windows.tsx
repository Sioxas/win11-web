import { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';
import { groupBy } from 'lodash-es';

import Window from './Window';
import Widget from './Widget';
import { useService } from '../utils/useService';
import TaskBar from './TaskBar/TaskBar';
import { WindowType } from './enums';
import { menus } from './ContextMenu/test';
import OverlayContainer from './Overlay/OverlayContainer';
import Point from '@/utils/Point';
import ApplicationService from './ApplicationService';
import WindowService from './WindowService';
import { ContextMenuService } from './ContextMenu';

import './Windows.less';

export default function Windows() {

  const windowContainerRef = useRef<HTMLDivElement>(null);

  const appService = useService(ApplicationService);

  const windowService = useService(WindowService);

  const contextMenuService = useService(ContextMenuService);

  const windows = useObservableState(windowService.windows$);

  useEffect(() => {
    windowService.init(windowContainerRef.current!);
    appService.onStartUp();
  }, []);

  const windowGroup = groupBy(windows, ([controller]) => controller.options.type);

  return (
    <>
      <div className="windows">
        <div
          ref={windowContainerRef}
          className="windows-container"
          onPointerDown={() => windowService.setDesktopActive()}
          onContextMenu={(e) => {
            e.preventDefault();
            contextMenuService.show(new Point(e.clientX, e.clientY), menus);
          }}
        >
          {
            [
              ...(windowGroup[WindowType.NORMAL] ?? []),
              ...(windowGroup[WindowType.BORDER_LESS] ?? []),
            ].map(([controller, config]) => (
              <Window key={controller.windowId} controller={controller}>
                <config.component {...config.props} />
              </Window>
            ))
          }
          {
            (windowGroup[WindowType.WIDGET] ?? []).map(([controller, config]) => (
              <Widget key={controller.windowId} controller={controller}>
                <config.component {...config.props} />
              </Widget>
            ))
          }
          {
            // TODO: add fullscreen window
          }
        </div>
        <TaskBar />
      </div>
      <OverlayContainer />
    </>
  );
}
