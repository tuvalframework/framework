import { IDisposable } from "../Disposable/IDisposable"
import { Virtual } from "../Reflection";
import { ByteArray, int, New } from '../float';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { TArray } from "../Extensions/TArray";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { Context } from "../Context/Context";
import { Exception } from "../Exception";

export abstract class RandomNumberGenerator implements IDisposable
// On Orcas RandomNumberGenerator is not disposable, so we cannot add the IDisposable implementation to the
// CoreCLR mscorlib.  However, this type does need to be disposable since subtypes can and do hold onto
// native resources. Therefore, on desktop mscorlibs we add an IDisposable implementation.

{
    protected constructor() {
    }

    //
    // public methods
    //

    public static Create(): RandomNumberGenerator {
        const rng = Context.Current.get('RandomNumberGenerator');
        if (rng != null) {
            return rng();
        }
        throw new Exception('No provider for AES');
    }

    public Dispose(): void {
        this.dispose(true);
    }

    @Virtual
    protected dispose(disposing: boolean): void {
        return;
    }

    public /* abstract */ GetBytes(data: ByteArray): void;
    public GetBytes(data: ByteArray, offset: int, count: int): void;
    public GetBytes(...args: any[]): void {
        if (args.length === 1) {

        } else if (args.length === 3) {
            const data: ByteArray = args[0];
            const offset: int = args[1];
            const count: int = args[2];
            if (data == null) throw new ArgumentNullException("data");
            if (offset < 0) throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (count < 0) throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
            if (offset + count > data.length) throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));

            if (count > 0) {
                const tempData: ByteArray = New.ByteArray(count);
                this.GetBytes(tempData);
                TArray.Copy(tempData, 0, data, offset, count);
            }
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    @Virtual
    public GetNonZeroBytes(data: ByteArray): void {
        // This method does not exist on Silverlight, so for compatibility we cannot have it be abstract
        // on the desktop (otherwise any type deriving from RandomNumberGenerator on Silverlight cannot
        // compile against the desktop CLR).  Since this technically is an abstract method with no
        // implementation, we'll just throw NotImplementedException.
        throw new NotImplementedException('');
    }
}