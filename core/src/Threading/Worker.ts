import { isNodeJS } from "../Environment";
import { WorkerConstructor } from "./WorkerType";

export const Worker: WorkerConstructor = isNodeJS ? (<any>require)('./NodeJSWorker').default : (<any>self).Worker;