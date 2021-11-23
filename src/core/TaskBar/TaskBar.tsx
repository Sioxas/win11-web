import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import { useTaskBarService, useWindowService } from '@/core/ServiceHooks';

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

export default function TaskBar() {

  const windowService = useWindowService();

  const taskBarService = useTaskBarService();

  const buttons = useObservableState(taskBarService.buttons$, []);

  return <div className="task-bar" onMouseDown={() => windowService.setTaskBarActive()}>
    {buttons.map((button) => (
      <button key={button.App.appName}
        ref={button.ref}
        onClick={() => taskBarService.onClickButton(button.App)}
        onMouseDown={(e) => e.stopPropagation()}
        className={classNames('task-bar-app-btn', {
          'task-bar-app-btn-active': button.active,
          'task-bar-app-btn-running': button.running,
        })}
      >
        <img width="22" src={button.App.appIcon} alt={button.App.appName} />
        <div className="task-bar-app-btn-indicator" />
      </button>
    ))}
  </div>
}