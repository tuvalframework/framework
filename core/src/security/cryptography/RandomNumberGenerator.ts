import { IDisposable } from "../../Disposable/IDisposable";
import { int } from "../../float";
import { ArgumentNullException } from "../../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../../Exceptions/ArgumentOutOfRangeException";
import { Environment } from "../../Environment";
import { ArgumentException } from "../../Exceptions/ArgumentException";
import { TArray } from "../../Extensions/TArray";
import { NotImplementedException } from "../../Exceptions/NotImplementedException";
import { random } from "../../Math";

export abstract class RandomNumberGenerator implements IDisposable {
    protected constructor() {
    }

    public static Create(): RandomNumberGenerator {
        return new class extends RandomNumberGenerator {
            public getBytes(data: Uint8Array): void {
                const buffer = new ArrayBuffer(1024);
                const fa = new Float64Array(buffer);

                for (let i = 0; i < 127; i++) {
                    const ranNumber = random(1, 10090987837632 * i);
                    fa[i] = ranNumber;
                }
                const idView = new Uint8Array(buffer);
                TArray.Copy(idView, 0, data, 0, 1024);
            }
        }
    }


    public /* virtual */  Dispose(): void {
    }


    public abstract getBytes(data: Uint8Array): void;

    public /* virtual */  GetBytes(data: Uint8Array, offset: int, count: int): void {
        if (data == null) {
            throw new ArgumentNullException("data");
        }
        if (offset < 0) {
            throw new ArgumentOutOfRangeException("offset", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count", Environment.GetResourceString("ArgumentOutOfRange_NeedNonNegNum"));
        }
        if (offset + count > data.length) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidOffLen"));
        }
        if (count > 0) {
            const numArray: Uint8Array = new Uint8Array(count);
            this.getBytes(numArray);
            TArray.Copy(numArray, 0, data, offset, count);
        }
    }

    /// <summary>When overridden in a derived class, fills an array of bytes with a cryptographically strong random sequence of nonzero values.</summary>
    /// <param name="data">The array to fill with cryptographically strong random nonzero bytes. </param>
    public /* virtual */  getNonZeroBytes(data: Uint8Array): void {
        throw new NotImplementedException('getNonZeroBytes');
    }
}