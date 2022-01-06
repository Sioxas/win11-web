import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import { useTaskBarService, useWindowService } from '../ServiceHooks';

import './TaskBar.less';

export default function TaskBar() {

  const windowService = useWindowService();

  const taskBarService = useTaskBarService();

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
