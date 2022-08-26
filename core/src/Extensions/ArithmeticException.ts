import { SystemException } from "../Exceptions/SystemException";

export class ArithmeticException extends SystemException {
    /* public ArithmeticException() : base(Environment.GetResourceString("Arg_ArithmeticException"))
    {
        base.SetErrorCode(-2147024362);
    } */

    public constructor(message: string) {
        super(message);
        //base.SetErrorCode(-2147024362);
    }

    /* public ArithmeticException(string message, Exception innerException) : base(message, innerException)
    {
        base.SetErrorCode(-2147024362);
    }

    protected ArithmeticException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    } */
}