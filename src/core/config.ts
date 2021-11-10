import Application from "./Application";

export const INSTALLED: Array<new (...args: ConstructorParameters<typeof Application>) => Application>[] = [];

export const LUNCH_ON_STARTUP: Array<new (...args: ConstructorParameters<typeof Application>) => Application> = [];