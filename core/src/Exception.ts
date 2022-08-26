
import { IDisposable } from "./Disposable/IDisposable";
import { IMap } from "./IMap";
const NAME: string = 'Exception';

// Avoid importing node reference..
 export interface Error {
    name: string;
    message: string;
}

/**
 * Represents errors that occur during application execution.
 */
export class Exception implements Error, IDisposable {
	/**
	 * A string representation of the error type.
	 * The default is 'Error'.
	 */
    readonly name: string;
    readonly stack: string = '';
    readonly data: IMap<any>;

	/**
	 * Initializes a new instance of the Exception class with a specified error message and optionally a reference to the inner exception that is the cause of this exception.
	 * @param message
	 * @param innerException
	 * @param beforeSealing This delegate is used to allow actions to occur just before this constructor finishes.  Since some compilers do not allow the use of 'this' before super.
	 */
    constructor(
        readonly message: string,
        innerException?: Error,
        beforeSealing?: (ex: any) => void) {
        const _ = this;

        this.name = _.getName();
        this.data = {};

        if (innerException) {
            _.data['innerException'] = innerException;
        }


		/* Originally intended to use 'get' accessors for properties,
		 * But debuggers don't display these readily yet.
		 * Object.freeze has to be used carefully, but will prevent overriding values at runtime.
		 */

        if (beforeSealing) beforeSealing(_);

        // Node has a .stack, let's use it...
        try {
            let stack: string = '';/* eval("new Error()").stack; */
            stack = stack
                && stack
                    .replace(/^Error\n/, '')
                    .replace(/(.|\n)+\s+at new.+/, '')
                || '';

            this.stack = _.toStringWithoutBrackets() + stack;
        }
        catch (ex) {
            const error = ex;
        }
    }


	/**
	 * A string representation of the error type.
	 * The default is 'Error'.
	 */
    protected getName(): string { return NAME; }

	/**
	 * The string representation of the Exception instance.
	 */
    ToString(): string {
        return `[${this.toStringWithoutBrackets()}]`;
    }

    protected toStringWithoutBrackets(): string {
        const _ = this;
        const m = _.message;
        return _.name + (m ? (': ' + m) : '');
    }

	/**
	 * Clears the data object.
	 */
    Dispose(): void {
        const data = this.data;
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                delete data[k];
            }

        }
    }
}
