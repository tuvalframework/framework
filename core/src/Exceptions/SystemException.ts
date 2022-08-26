import { Exception, Error } from "../Exception";

const NAME: string = 'SystemException';

export class SystemException extends Exception {
	/*
		constructor(
			message:string = null,
			innerException:Error = null,
			beforeSealing?:(ex:any)=>void)
		{
			super(message, innerException, beforeSealing);
		}
	*/

	protected getName(): string {
		return NAME;
	}
}
