import { ICryptoTransform } from "./ICryptoTransform";
import { ByteArray, int, New } from '../float';
import { Virtual } from "../Reflection/Decorators/ClassInfo";
import { TObject } from '../Extensions/TObject';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ObjectDisposedException } from "../Disposable/ObjectDisposedException";
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Stream } from "../IO/Stream";
import { Context } from '../Context/Context';
import { CryptographicException } from "./CryptographicException";
import { Environment } from '../Environment';
import { TArray } from '../Extensions/TArray';
import { is } from "../is";
import { System } from "../SystemTypes";

export abstract class HashAlgorithm extends TObject implements ICryptoTransform {

    protected HashValue: ByteArray = null as any;
    protected HashSizeValue: int = 0;
    protected State: int = 0;
    private disposed: boolean = false;

    protected constructor() {
        super();
        this.disposed = false;
    }

    @Virtual
    protected Get_CanTransformMultipleBlocks(): boolean {
        return true;
    }
    public get CanTransformMultipleBlocks(): boolean {
        return this.Get_CanTransformMultipleBlocks();
    }

    protected Get_CanReuseTransform(): boolean {
        return true;
    }
    public get CanReuseTransform(): boolean {
        return this.Get_CanReuseTransform();
    }

    public Clear(): void {
        // same as System.IDisposable.Dispose() which is documented
        this.dispose(true);
    }

    public ComputeHash(buffer: ByteArray): ByteArray;
    public ComputeHash(buffer: ByteArray, offset: int, count: int): ByteArray;
    public ComputeHash(inputStream: Stream): ByteArray;
    public ComputeHash(...args: any[]): ByteArray {
        if (args.length === 1 && is.ByteArray(args[0])) {
            const buffer: ByteArray = args[0];
            if (buffer == null)
                throw new ArgumentNullException("buffer");

            return this.ComputeHash(buffer, 0, buffer.length);
        } else if (args.length === 3 && is.ByteArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const buffer: ByteArray = args[0];
            const offset: int = args[1];
            const count: int = args[2];
            if (this.disposed)
                throw new ObjectDisposedException("HashAlgorithm");
            if (buffer == null)
                throw new ArgumentNullException("buffer");
            if (offset < 0)
                throw new ArgumentOutOfRangeException("offset", "< 0");
            if (count < 0)
                throw new ArgumentException("count", "< 0");
            // ordered to avoid possible integer overflow
            if (offset > buffer.length - count) {
                throw new ArgumentException("offset + count", Environment.GetResourceString("Overflow"));
            }

            this.HashCore(buffer, offset, count);
            this.HashValue = this.HashFinal();
            this.Initialize();

            return this.HashValue;
        } else if (args.length === 1 && is.typeof<Stream>(args[0], System.Types.IO.Stream)) {
            const inputStream: Stream = args[0];
            // don't read stream unless object is ready to use
            if (this.disposed)
                throw new ObjectDisposedException("HashAlgorithm");

            const buffer: ByteArray = New.ByteArray(4096);
            let len: int = inputStream.Read(buffer, 0, 4096);
            while (len > 0) {
                this.HashCore(buffer, 0, len);
                len = inputStream.Read(buffer, 0, 4096);
            }
            this.HashValue = this.HashFinal();
            this.Initialize();
            return this.HashValue;
        } else {
            throw new ArgumentOutOfRangeException('');
        }
    }

    public static Create(): HashAlgorithm {
        return Context.Current.get('SHA1CryptoServiceProvider');
    }

    /*  public static HashAlgorithm Create(string hashName) {
         return (HashAlgorithm)CryptoConfig.CreateFromName(hashName);
     } */

    @Virtual
    protected Get_Hash(): ByteArray {
        if (this.HashValue == null) {
            throw new CryptographicException(Environment.GetResourceString("No hash value computed."));
        }
        return this.HashValue;
    }
    public get Hash(): ByteArray {
        return this.Get_Hash();
    }

    protected abstract HashCore(array: ByteArray, ibStart: int, cbSize: int): void;

    protected abstract HashFinal(): ByteArray;

    protected Get_HashSize(): int {
        return this.HashSizeValue;
    }
    public get HashSize(): int {
        return this.Get_HashSize();
    }

    public abstract Initialize(): void;

    protected dispose(disposing: boolean): void {
        this.disposed = true;
    }

    @Virtual
    protected Get_InputBlockSize(): int {
        return 1;
    }
    public get InputBlockSize(): int {
        return this.Get_InputBlockSize();
    }

    @Virtual
    protected Get_OutputBlockSize(): int {
        return 1;
    }
    public get OutputBlockSize(): int {
        return this.Get_OutputBlockSize();
    }


    // LAMESPEC: outputBuffer is optional in 2.0 (i.e. can be null).
    // However a null outputBuffer would throw a ExecutionEngineException under 1.x
    public TransformBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int, outputBuffer: ByteArray, outputOffset: int): int {
        if (inputBuffer == null)
            throw new ArgumentNullException("inputBuffer");

        if (inputOffset < 0)
            throw new ArgumentOutOfRangeException("inputOffset", "< 0");
        if (inputCount < 0)
            throw new ArgumentException("inputCount");

        // ordered to avoid possible integer overflow
        if ((inputOffset < 0) || (inputOffset > inputBuffer.length - inputCount))
            throw new ArgumentException("inputBuffer");

        if (outputBuffer != null) {
            if (outputOffset < 0) {
                throw new ArgumentOutOfRangeException("outputOffset", "< 0");
            }
            // ordered to avoid possible integer overflow
            if (outputOffset > outputBuffer.length - inputCount) {
                throw new ArgumentException("outputOffset + inputCount", Environment.GetResourceString("Overflow"));
            }
        }

        this.HashCore(inputBuffer, inputOffset, inputCount);

        if (outputBuffer != null)
            TArray.Copy(inputBuffer, inputOffset, outputBuffer, outputOffset, inputCount);

        return inputCount;
    }

    public TransformFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): ByteArray {
        if (inputBuffer == null)
            throw new ArgumentNullException("inputBuffer");
        if (inputCount < 0)
            throw new ArgumentException("inputCount");
        // ordered to avoid possible integer overflow
        if (inputOffset > inputBuffer.length - inputCount) {
            throw new ArgumentException("inputOffset + inputCount", Environment.GetResourceString("Overflow"));
        }

        const outputBuffer: ByteArray = New.ByteArray(inputCount);

        // note: other exceptions are handled by Buffer.BlockCopy
        TArray.Copy(inputBuffer, inputOffset, outputBuffer, 0, inputCount);

        this.HashCore(inputBuffer, inputOffset, inputCount);
        this.HashValue = this.HashFinal();
        this.Initialize();

        return outputBuffer;
    }
}