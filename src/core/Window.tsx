import React, { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import { WindowController } from './WindowController';
import { WindowResizeType, WindowResizer, WindowControlButton, WindowType } from './enums';
import Application from './Application';

import './Window.less';

interface WindowProps<T extends Application> {
  children: React.ReactNode;
  controller: WindowController<T>;
}

function Window<T extends Application>({ children, controller }: WindowProps<T>) {

  const resizeType = useObservableState(controller.windowResizeType$);

  const active = useObservableState(controller.active$);

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowElement = windowRef.current;
    if (windowElement) {
      controller.init(windowElement);
      windowElement.animate([
        { transform: 'scale(0.8)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
      ], {
        duration: 200,
        fill: 'forwards',
      });
    }
  }, []);

  const { type, titleBar, resizeable, controlButton } = controller.options;

  const resizerClass = classNames('window-resizer', {
    'window-resizer-without-title-bar': Boolean(titleBar)
  });

  const resizers = [
    controlButton & WindowControlButton.MINIMIZE && <div className={resizerClass}
      onClick={() => controller.minimize()}
    >
      <span className="iconfont icon-minimize" />
    </div>,
    controlButton & WindowControlButton.MAXIMIZE && <>
      {resizeType === WindowResizeType.MAXIMIZED && <div className={resizerClass}
        onClick={() => controller.normalize()}
      >
        <span className="iconfont icon-restore" />
      </div>}
      {resizeType === WindowResizeType.NORMAL && <div className={resizerClass}
        onClick={() => controller.maximize()}
      >
        <span className="iconfont icon-maximize" />
      </div>}
    </>,
    controlButton & WindowControlButton.CLOSE && <div className={classNames(resizerClass, 'window-resizer-close')}
      onClick={() => controller.close()}
    >
      <span className="iconfont icon-close" />
    </div>,
  ].filter(Boolean);

  return <div ref={windowRef}
    className={classNames('window', {
      'window-minimize': resizeType === WindowResizeType.MINIMIZED,
      'window-maximize': resizeType === WindowResizeType.MAXIMIZED,
      'window-border': type === WindowType.NORMAL,
      'window-fullscreen': type === WindowType.FULLSCREEN,
      'window-active': active,
      'window-inactive': !active,
    })}
    onMouseDown={() => controller.setWindowActive()}
  >
    {
      type === WindowType.NORMAL && <>
        {
          titleBar
            ? <div className="window-title-bar">
              <div className="window-title-bar-dragable"
                onPointerDown={() => controller.onDragStart(0)}
                onDoubleClick={() => {
                  if (controlButton & WindowControlButton.MAXIMIZE)
                    resizeType! & WindowResizeType.MAXIMIZED ? controller.normalize() : controller.maximize();
                }}
              >
                <div className="window-title-bar-icon" draggable="false">
                  <img width='16' src={titleBar.icon} alt={titleBar.title} draggable="false" />
                </div>
                <div className="window-title-bar-name" draggable="false">{titleBar.title}</div>
              </div>
              {resizers}
            </div>
            : resizers.reverse()
        }
      </>
    }
    {
      resizeable && type !== WindowType.FULLSCREEN && (
        <div className="crop">
          <div className="crop-line crop-top-line"
            onPointerDown={() => controller.onDragStart(WindowResizer.TOP)} />
          <div className="crop-line crop-right-line"
            onPointerDown={() => controller.onDragStart(WindowResizer.RIGHT)} />
          <div className="crop-line crop-bottom-line"
            onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM)} />
          <div className="crop-line crop-left-line"
            onPointerDown={() => controller.onDragStart(WindowResizer.LEFT)} />

          <div className="crop-corner crop-top-left-corner"
            onPointerDown={() => controller.onDragStart(WindowResizer.TOP | WindowResizer.LEFT)} />
          <div className="crop-corner crop-top-right-corner"
            onPointerDown={() => controller.onDragStart(WindowResizer.TOP | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-right-corner"
            onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-left-corner"
            onPointerDown={() => controller.onDragStart(WindowResizer.BOTTOM | WindowResizer.LEFT)} />
        </div>
      )
    }
    {children}
  </div>;
}

export default React.memo(Window);
