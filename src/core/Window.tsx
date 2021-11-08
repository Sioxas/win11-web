import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { WindowController } from './WindowController';
import { WindowStatus, WindowResizer, WindowControlButton, WindowType } from './enums';

import './Window.less';

interface WindowProps {
  children: React.ReactNode;
  controller: WindowController;
}

function Window({ children, controller }: WindowProps) {
  const [status, setStatus] = useState(WindowStatus.NORMAL);
  const [active, setActive] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controller.init(windowRef.current!, setActive, setStatus);
  }, []);

  const { type, titleBar, resizeable, controlButton } = controller.options;

  return <div ref={windowRef}
    className={classNames('window', {
      'window-minimize': status === WindowStatus.MINIMIZED,
      'window-maximize': status === WindowStatus.MAXIMIZED,
      'window-border': type === WindowType.NORMAL,
      'window-active': active,
      'window-inactive': !active,
    })}
    onMouseDown={() => controller.setWindowActive()}
  >
    {
      type === WindowType.NORMAL && <>
        {
          titleBar && <div className="window-title-bar">
            <div className="window-title-bar-dragable"
              onPointerDown={() => controller.onDragStart(0)}
              onDoubleClick={() => controlButton & WindowControlButton.MAXIMIZE && controller.setStatus(status ^ WindowStatus.MAXIMIZED)}
            >
              <div className="window-title-bar-icon" draggable="false">
                <img width='16' src={titleBar.icon} alt={titleBar.title} draggable="false" />
              </div>
              <div className="window-title-bar-name" draggable="false">{titleBar.title}</div>
            </div>
          </div>
        }
        {
          controlButton & WindowControlButton.MINIMIZE && <div className="window-title-bar-resizer"
            onClick={() => controller.setStatus(WindowStatus.MINIMIZED)}
          >
            <span className="iconfont icon-minimize" />
          </div>
        }
        {
          controlButton & WindowControlButton.MAXIMIZE && <>
            {status === WindowStatus.MAXIMIZED && <div className="window-title-bar-resizer"
              onClick={() => controller.setStatus(WindowStatus.NORMAL)}
            >
              <span className="iconfont icon-restore" />
            </div>}
            {status === WindowStatus.NORMAL && <div className="window-title-bar-resizer"
              onClick={() => controller.setStatus(WindowStatus.MAXIMIZED)}
            >
              <span className="iconfont icon-maximize" />
            </div>}
          </>
        }
        {
          controlButton & WindowControlButton.CLOSE && <div className="window-title-bar-resizer">
            <span className="iconfont icon-close" />
          </div>
        }
      </>
    }
    {
      resizeable && type !== WindowType.FULLSCREEN && (
        <div className="crop">
          <div className="crop-line crop-top-line" onPointerDown={() => controller.onDragStart(WindowResizer.TOP)} />
          <div className="crop-line crop-right-line" onPointerDown={() => controller.onDragStart(WindowResizer.RIGHT)} />
          <div className="crop-line crop-bottom-line" onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM)} />
          <div className="crop-line crop-left-line" onPointerDown={() => controller.onDragStart(WindowResizer.LEFT)} />

          <div className="crop-corner crop-top-left-corner" onPointerDown={() => controller.onDragStart(WindowResizer.TOP | WindowResizer.LEFT)} />
          <div className="crop-corner crop-top-right-corner" onPointerDown={() => controller.onDragStart(WindowResizer.TOP | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-right-corner" onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-left-corner" onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM | WindowResizer.LEFT)} />
        </div>
      )
    }
    {children}
  </div>;
}

export default React.memo(Window);
