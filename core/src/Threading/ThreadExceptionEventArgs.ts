import { EventArgs } from "../EventArgs";
import { Exception } from "../Exception";

export class ThreadExceptionEventArgs extends EventArgs {
    private exception: Exception = undefined as any;

    /// <summary>Gets the <see cref="T:System.Exception" /> that occurred.</summary>
    /// <returns>The <see cref="T:System.Exception" /> that occurred.</returns>
    /// <filterpriority>1</filterpriority>
    public get Exception(): Exception {
        return this.exception;
    }

    /// <summary>Initializes a new instance of the <see cref="T:System.Threading.ThreadExceptionEventArgs" /> class.</summary>
    /// <param name="t">The <see cref="T:System.Exception" /> that occurred. </param>
    public constructor(t: Exception) {
        super();
        this.exception = t;
    }
}