import { Delegate } from "../Delegate";
import { ThreadExceptionEventArgs } from "./ThreadExceptionEventArgs";

export class ThreadExceptionEventHandler extends Delegate<(sender: any, args: ThreadExceptionEventArgs) => void> { }