import { Environment } from "../Environment";
import { SystemException } from "../Exceptions/SystemException";

export class FormatException extends SystemException {
    /*  public constructor()
     {
         super((Environment.GetResourceString("Arg_FormatException")));
         super.SetErrorCode(-2146233033);
     } */

    public constructor(message: string) {
        super(message);
        //base.SetErrorCode(-2146233033);
    }

    /* public FormatException(string message, Exception innerException) : base(message, innerException)
    {
        base.SetErrorCode(-2146233033);
    }

    protected FormatException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    } */
}