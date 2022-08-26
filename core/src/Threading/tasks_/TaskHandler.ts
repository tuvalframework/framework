import { TaskHandlerBase } from "./TaskHandlerBase";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { Closure } from "../../FunctionTypes";

export class TaskHandler extends TaskHandlerBase {

	constructor(private readonly _action: Closure) {
		super();
		if (!_action) throw new ArgumentNullException('action');
	}

	protected _onExecute(): void {
		this._action();
	}

	protected _onDispose(): void {
		super._onDispose();
		(<any>this)._action = null;
	}
}