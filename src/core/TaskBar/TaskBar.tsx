import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import { useService } from '@/utils/useService';
import WindowService from '../WindowService';
import TaskBarService from './TaskBarService';

import './TaskBar.less';

export default function TaskBar() {

  const windowService = useService(WindowService);

  const taskBarService = useService(TaskBarService);

  const buttons = useObservableState(taskBarService.buttons$, []);

  return <div className="task-bar" onPointerDown={() => windowService.setTaskBarActive()}>
    {buttons.map((button) => (
      <button key={button.App.appName}
        ref={button.ref}
        onClick={() => taskBarService.onClickButton(button.App)}
        onPointerDown={(e) => e.stopPropagation()}
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
