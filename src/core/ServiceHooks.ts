import React from "react";

import Service from "./Service";
import ApplicationService from "./ApplicationService";
import CanvasService from "./Canvas/CanvasService";
import { ContextMenuService } from "./ContextMenu";
import WindowService from "./WindowService";

function serviceHooksFactory<T extends Service>(service: T) {
  const ServiceContext = React.createContext<T>(service);
  return () => React.useContext(ServiceContext);
}

export const useCanvasService = serviceHooksFactory(new CanvasService());

export const useContextMenuService = serviceHooksFactory(new ContextMenuService());

export const useWindowService = serviceHooksFactory(new WindowService());

export const useApplicationService = serviceHooksFactory(new ApplicationService(WindowService.getInstance()));