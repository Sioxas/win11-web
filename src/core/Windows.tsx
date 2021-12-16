import { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';
import { groupBy } from 'lodash-es';

import Window from './Window';
import Widget from './Widget';
import { useApplicationService, useContextMenuService, useWindowService } from './ServiceHooks';
import { ContextMenuContainer } from './ContextMenu';
import TaskBar from './TaskBar/TaskBar';
import { WindowType } from './enums';
import { menus } from './ContextMenu/test';

import './Windows.less';

export default function Windows() {

  const windowContainerRef = useRef<HTMLDivElement>(null);

  const appService = useApplicationService();

  const windowService = useWindowService();

  const contextMenuService = useContextMenuService();

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
            contextMenuService.show(e.clientX, e.clientY, menus);
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
      <ContextMenuContainer />
    </>
  );
}
