import { ArithmeticException } from "./ArithmeticException";

export class OverflowException extends ArithmeticException {
    /* public OverflowException() : base(Environment.GetResourceString("Arg_OverflowException"))
    {
        base.SetErrorCode(-2146233066);
    }
*/
    public constructor(message: string) {
        super(message);
        //base.SetErrorCode(-2146233066);
    }

    /*  public OverflowException(string message, Exception innerException) : base(message, innerException)
     {
         base.SetErrorCode(-2146233066);
     }

     protected OverflowException(SerializationInfo info, StreamingContext context) : base(info, context)
     {
     } */
}