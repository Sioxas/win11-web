import React from "react";

import Service from "./Service";
import ApplicationService from "./ApplicationService";
import CanvasService from "./Canvas/CanvasService";
import { ContextMenuService } from "./ContextMenu";
import WindowService from "./WindowService";
import TaskBarService from "./TaskBar/TaskBarService";

function serviceHooksFactory<T extends Service>(service: T) {
  const ServiceContext = React.createContext<T>(service);
  return () => React.useContext(ServiceContext);
}

export const useWindowService = serviceHooksFactory(new WindowService());

export const useApplicationService = serviceHooksFactory(new ApplicationService(WindowService.getInstance()));

export const useTaskBarService = serviceHooksFactory(new TaskBarService(WindowService.getInstance(), ApplicationService.getInstance()));

// export const useCanvasService = serviceHooksFactory(new CanvasService());

export const useContextMenuService = serviceHooksFactory(new ContextMenuService());
