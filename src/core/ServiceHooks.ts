import { useRef } from "react";

import Service from "@/utils/Service";
import ApplicationService from "./ApplicationService";
import CanvasService from "./Canvas/CanvasService";
import { ContextMenuService } from "./ContextMenu";
import WindowService from "./WindowService";
import TaskBarService from "./TaskBar/TaskBarService";
import Overlay from "./Overlay/Overlay";

function createServiceHooks<T extends Service>(service: T) {
  return () => useRef(service).current;
}

export const useWindowService = createServiceHooks(new WindowService());

export const useApplicationService = createServiceHooks(new ApplicationService());

export const useTaskBarService = createServiceHooks(new TaskBarService(WindowService.getInstance(), ApplicationService.getInstance()));

// export const useCanvasService = serviceHooksFactory(new CanvasService());

export const useOverlay = createServiceHooks(new Overlay());

export const useContextMenuService = createServiceHooks(new ContextMenuService(Overlay.getInstance()));
