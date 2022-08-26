import { PrintPageEventArgs } from "./PrintPageEventArgs";
import { Delegate } from "@tuval/core";

export class PrintPageEventHandler extends Delegate<(sender: any, e: PrintPageEventArgs) => void> {

}