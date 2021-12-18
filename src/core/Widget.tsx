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
    }
  }, []);

  return <div ref={widgetRef}
    className="window window-border window-active widget"
    onPointerDown={(e) => {
      controller.setWindowActive(); 
      e.stopPropagation();
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}
  >
    {children}
  </div>
}