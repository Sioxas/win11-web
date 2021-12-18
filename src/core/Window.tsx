import React, { useEffect, useRef } from 'react';
import { useObservableState } from 'observable-hooks';
import classNames from 'classnames';

import { WindowController } from './WindowController';
import { WindowResizeType, WindowResizer, WindowControlButton, WindowType } from './enums';
import Application from './Application';
import { useContextMenuService } from './ServiceHooks';
import { ContextMenuItem, ContextMenuType } from './ContextMenu';

import './Window.less';

interface WindowProps<T extends Application> {
  children: React.ReactNode;
  controller: WindowController<T>;
}

function Window<T extends Application>({ children, controller }: WindowProps<T>) {

  const resizeType = useObservableState(controller.windowResizeType$);

  const active = useObservableState(controller.active$);

  const windowRef = useRef<HTMLDivElement>(null);

  const contextMenuService = useContextMenuService();

  useEffect(() => {
    const windowElement = windowRef.current;
    if (windowElement) {
      controller.init(windowElement);
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

  const titleBarContextMenu: ContextMenuItem[] = [
    {
      text: '还原',
      disabled: !(Boolean(controlButton & WindowControlButton.MAXIMIZE) && resizeType === WindowResizeType.MAXIMIZED),
      icon: 'icon-restore',
      onSelect: () => controller.normalize(),
    },
    {
      text: '最小化',
      disabled: !Boolean(controlButton & WindowControlButton.MINIMIZE),
      icon: 'icon-minimize',
      onSelect: () => controller.minimize(),
    },
    {
      text: '最大化',
      disabled: !(Boolean(controlButton & WindowControlButton.MAXIMIZE) && resizeType === WindowResizeType.NORMAL),
      icon: 'icon-maximize',
      onSelect: () => controller.maximize(),
    },
    {
      type: ContextMenuType.Separator,
    },
    {
      text: '关闭',
      disabled: !Boolean(controlButton & WindowControlButton.CLOSE),
      icon: 'icon-close',
      onSelect: () => controller.close(),
    }
  ];

  return <div ref={windowRef}
    className={classNames('window', {
      'window-minimize': resizeType === WindowResizeType.MINIMIZED,
      'window-maximize': resizeType === WindowResizeType.MAXIMIZED,
      'window-border': type === WindowType.NORMAL,
      'window-fullscreen': type === WindowType.FULLSCREEN,
      'window-active': active,
      'window-inactive': !active,
    })}
    onPointerDown={(e) => { 
      controller.setWindowActive(); 
      e.stopPropagation();
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {
      type === WindowType.NORMAL && <>
        {
          titleBar
            ? <div className="window-title-bar">
              <div className="window-title-bar-dragable"
                onPointerDown={(event) => controller.onDragStart(event, 0)}
                onDoubleClick={() => {
                  if (controlButton & WindowControlButton.MAXIMIZE)
                    resizeType! & WindowResizeType.MAXIMIZED ? controller.normalize() : controller.maximize();
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  contextMenuService.show(e.clientX, e.clientY, titleBarContextMenu);
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
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.TOP)} />
          <div className="crop-line crop-right-line"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.RIGHT)} />
          <div className="crop-line crop-bottom-line"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.BOTTOM)} />
          <div className="crop-line crop-left-line"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.LEFT)} />

          <div className="crop-corner crop-top-left-corner"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.TOP | WindowResizer.LEFT)} />
          <div className="crop-corner crop-top-right-corner"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.TOP | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-right-corner"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.BOTTOM | WindowResizer.RIGHT)} />
          <div className="crop-corner crop-bottom-left-corner"
            onPointerDown={(event) => controller.onDragStart(event, WindowResizer.BOTTOM | WindowResizer.LEFT)} />
        </div>
      )
    }
    {children}
  </div>;
}

export default React.memo(Window);
