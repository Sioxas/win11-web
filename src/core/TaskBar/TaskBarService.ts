import ApplicationService from "../ApplicationService";
import WindowService from "../WindowService";
import Service from "../Service";

export default class TaskBarService extends Service {
  constructor(private windowService: WindowService, private appService: ApplicationService) {
    super();
  }
}