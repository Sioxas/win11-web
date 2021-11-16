import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import Application from '@/core/Application';
import { useApplicationService, useWindowService } from '@/core/ServiceHooks';
import { Constructor } from '@/utils/interface';
import { WindowStatus } from '@/core/enums';
import TaskBar from '.';
import { PIN_TO_TASKBAR } from '..';

import start from '@/assets/icons/start.png';
import search from '@/assets/icons/search-dark.png';
import widget from '@/assets/icons/widget.png';
import settings from '@/assets/icons/settings.png';
import explorer from '@/assets/icons/explorer.png';
import edge from '@/assets/icons/edge.png';
import store from '@/assets/icons/store-light.png';
import vscode from '@/assets/icons/vscode.png';

import './TaskBar.less';


const apps = [
  { name: 'start', icon: start, },
  { name: 'search', icon: search, },
  { name: 'widget', icon: widget, },
  { name: 'settings', icon: settings, },
  { name: 'explorer', icon: explorer, },
  { name: 'edge', icon: edge, },
  { name: 'store', icon: store, },
  { name: 'vscode', icon: vscode, },
];

export default function TaskBarView() {

  const windowService = useWindowService();

  const appService = useApplicationService();

  const windows = useObservableState(windowService.windows$);

  const activeWindow = useObservableState(windowService.activeWindow$);

  const runningApps = windows.map(([controller]) => controller.application.constructor);

  function handleClick(App: typeof Application) {
    const controller = windows.map(([controller]) => controller).find(controller => controller.application.constructor === App);
    if(controller) {
      if(activeWindow === controller) {
        controller.setStatus(WindowStatus.MINIMIZED);
        windowService.setWindowInactive(controller);
      }else{
        controller.setStatus(WindowStatus.NORMAL);
        windowService.setWindowActive(controller);
      }
    } else {
      appService.launch(App as unknown as Constructor<Application>, TaskBar);
    };
  }

  return <div className="task-bar">
    {PIN_TO_TASKBAR.map((App) => (
      <button key={App.appName} 
        onClick={() => handleClick(App)}
        onMouseDown={(e) => e.stopPropagation()}
        className={classNames('task-bar-app-btn', {
          'task-bar-app-btn-active': activeWindow?.application.constructor === App,
          'task-bar-app-btn-running': runningApps.includes(App),
        })}
      >
        <img width="22" src={App.appIcon} alt={App.appName} />
        <div className="task-bar-app-btn-indicator" />
      </button>
    ))}
  </div>
}