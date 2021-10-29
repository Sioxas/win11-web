import { useEffect, useMemo, useRef, createContext, createRef } from 'react';
import { WindowController, WindowStatus, Z_INDEX_BASE } from './WindowController';
import WindowManager from './WindowManager';

export const WindowManagerContext = createContext<WindowManager | null>(null);

interface WindowManagerProviderProps {
  children: React.ReactNode;
}

export default function WindowManagerProvider({ children }: WindowManagerProviderProps) {
  const windowContainerRef = useRef<HTMLDivElement>(null);

  const windowManager = useMemo(() => new WindowManager(), []);

  useEffect(() => {
    console.log('WindowManagerProvider: useEffect');
    windowManager.init(windowContainerRef.current!);
  }, []);

  return <WindowManagerContext.Provider value={windowManager}>
    <div className="windows-container-wrapper">
      <div ref={windowContainerRef} className="windows-container">
        {children}
      </div>
    </div>
  </WindowManagerContext.Provider>;

}