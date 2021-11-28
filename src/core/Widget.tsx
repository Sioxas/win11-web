import { useEffect, useRef } from "react";

import Application from "./Application";
import { WindowController } from "./WindowController";

interface WidgetProps<T extends Application> {
  children: React.ReactNode;
  controller: WindowController<T>;
}

export default function Widget<T extends Application>({ children, controller }: WidgetProps<T>) {

  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowElement = widgetRef.current;
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

  return <div ref={widgetRef}
    className="window window-border window-active"
    onPointerDown={(e) => { 
      controller.setWindowActive(); 
      e.stopPropagation();
    }}
  >
    {children}
  </div>
}