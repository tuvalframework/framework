import { Environment } from "../Environment";
import { SystemException } from "../Exceptions/SystemException";
import { int } from "../float";

export class IOException extends SystemException {

    public constructor(message: string, id:int = 0) {
        super(message == null ? Environment.GetResourceString("Arg_IOException") : message)
        // this.SetErrorCode(-2146232800);
    }
}