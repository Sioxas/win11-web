import React from "react";

import CanvasService from "./Canvas/CanvasService";
import { ContextMenuService } from "./ContextMenu";

const CanvasServiceContext = React.createContext<CanvasService>(new CanvasService());

export function useCanvasService() {
  return React.useContext(CanvasServiceContext);
}

const ConetxtMenuServiceContext = React.createContext<ContextMenuService>(new ContextMenuService(CanvasService.getInstance()));

export function useContextMenuService(): ContextMenuService {
  return React.useContext(ConetxtMenuServiceContext);
}