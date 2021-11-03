import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { WindowController } from './WindowController';
import { WindowOptions } from './WindowService';
import { WindowStatus, CropFlag } from './enums';

import explorer from '@/assets/icons/explorer.png';

import './Window.less';

interface WindowProps {
  children: React.ReactNode;
  controller: WindowController;
  options: WindowOptions;
}

function Window({ children, controller, options }: WindowProps) {
  const [status, setStatus] = useState(WindowStatus.NORMAL);
  const [active, setActive] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    controller.init(windowRef.current!, setActive, setStatus);
  }, []);

  return <div ref={windowRef}
    className={classNames('window', {
      'window-minimize': status === WindowStatus.MINIMIZED,
      'window-maximize': status === WindowStatus.MAXIMIZED,
      'window-active': active,
      'window-inactive': !active,
    })}
    onMouseDown={() => controller.setWindowActive()}
  >
    <div className="window-title-bar">
      <div className="window-title-bar-dragable"
        onPointerDown={() => controller.onDragStart(0)}
        onDoubleClick={() => controller.setStatus(status ^ WindowStatus.MAXIMIZED)}
      >
        <div className="window-title-bar-icon" draggable="false">
          <img width='16' src={explorer} alt='File Explorer' draggable="false" />
        </div>
        <div className="window-title-bar-name" draggable="false">File Explorer</div>
      </div>
      <div className="window-title-bar-resizer"
        onClick={() => controller.setStatus(WindowStatus.MINIMIZED)}
      >
        <span className="iconfont icon-minimize" />
      </div>
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
      <div className="window-title-bar-resizer">
        <span className="iconfont icon-close" />
      </div>
    </div>
    <div className="crop">
      <div className="crop-line crop-top-line" onPointerDown={() => controller.onDragStart(CropFlag.TOP)} />
      <div className="crop-line crop-right-line" onPointerDown={() => controller.onDragStart(CropFlag.RIGHT)} />
      <div className="crop-line crop-bottom-line" onPointerDown={() => controller.onDragStart(CropFlag.BOTTOM)} />
      <div className="crop-line crop-left-line" onPointerDown={() => controller.onDragStart(CropFlag.LEFT)} />

      <div className="crop-corner crop-top-left-corner" onPointerDown={() => controller.onDragStart(CropFlag.TOP | CropFlag.LEFT)} />
      <div className="crop-corner crop-top-right-corner" onPointerDown={() => controller.onDragStart(CropFlag.TOP | CropFlag.RIGHT)} />
      <div className="crop-corner crop-bottom-right-corner" onPointerDown={() => controller.onDragStart(CropFlag.BOTTOM | CropFlag.RIGHT)} />
      <div className="crop-corner crop-bottom-left-corner" onPointerDown={() => controller.onDragStart(CropFlag.BOTTOM | CropFlag.LEFT)} />
    </div>
    {children}
  </div>;
}

export default React.memo(Window);
