import React from "react";

import CanvasService from "./Canvas/CanvasService";
import { ContextMenuService } from "./ContextMenu";
import Service from "./Service";

function serviceHooksFactory<T extends Service>(service: T) {
  const ServiceContext = React.createContext<T>(service);
  return () => React.useContext(ServiceContext);
}

export const useCanvasService = serviceHooksFactory(new CanvasService());

export const useContextMenuService = serviceHooksFactory(new ContextMenuService());
