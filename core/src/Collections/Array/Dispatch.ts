import {copy} from "./copy";
import {Selector} from "../../FunctionTypes";
import { Type } from "../../Reflection/Type";
import { is } from "../../is";

const VOID0:undefined = void 0;

export interface DispatchErrorHandler
{
	(ex:any, index:number):void
}

/**
 * Simply takes a payload and passes it to all the listeners.
 * Makes a arrayCopy of the listeners before calling dispatchUnsafe.
 *
 * @param listeners
 * @param payload
 * @param trap
 */
export function dispatch<T>(
	listeners:ArrayLike<Selector<T,any>>,
	payload:T, trap?:boolean|DispatchErrorHandler):void
{
	dispatch.unsafe(copy(listeners), payload, trap);
}

export namespace dispatch {

	/**
	 * Simply takes a payload and passes it to all the listeners.
	 *
	 * While dispatching:
	 * * This is an unsafe method if by chance any of the listeners modify the array.
	 * * It cannot prevent changes to the payload.
	 *
	 * Improving safety:
	 * * Only use a local array that isn't exposed to the listeners.
	 * * Use the dispatch method instead as it makes a arrayCopy of the listeners array.
	 * * Freeze the listeners array so it can't be modified.
	 * * Freeze the payload.
	 *
	 * Specifying trap will catch any errors and pass them along if trap is a function.
	 * A payload is used instead of arguments for easy typing.
	 *
	 *
	 * @param listeners
	 * @param payload
	 * @param trap
	 */
	export function unsafe<T>(
		listeners:ArrayLike<Selector<T,any>>,
		payload:T, trap?:boolean|DispatchErrorHandler):void
	{
		if(listeners && listeners.length)
		{
			for(let i = 0, len = listeners.length; i<len; i++)
			{
				let fn:Function = listeners[i];
				if(!fn) continue; // Ignore null refs.
				try
				{
					fn(payload);
				}
				catch(ex)
				{
					if(!trap)
						throw ex;
					else if(is.function(trap))
						trap(ex, i);
				}
			}
		}
	}

	/**
	 * Simply takes a payload and passes it to all the listeners.
	 * Returns the results in an array that matches the indexes of the listeners.
	 *
	 * @param listeners
	 * @param payload
	 * @param trap
	 * @returns {any}
	 */
	export function mapped<T,TResult>(
		listeners:ArrayLike<Selector<T,TResult>>,
		payload:T, trap?:boolean|DispatchErrorHandler):TResult[]
	{

		if(!listeners) return <any>listeners;
		// Reuse the arrayCopy as the array result.
		const result:any[] = copy(listeners);
		if(listeners.length)
		{

			for(let i = 0, len = result.length; i<len; i++)
			{
				let fn:Function = result[i];
				try
				{
					result[i] = fn // Ignore null refs.
						? fn(payload)
						: VOID0;
				}
				catch(ex)
				{
					result[i] = VOID0;
					if(!trap)
						throw ex;
					else if(is.function(trap))
						trap(ex, i);
				}
			}
		}

		return result;
	}
}
