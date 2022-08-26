import { ICryptoTransform } from "./ICryptoTransform";
import { TObject } from '../Extensions/TObject';
import { CipherMode, PaddingMode, SymmetricAlgorithm } from "./SymmetricAlgorithm";
import { int, ByteArray, New } from '../float';
import { KeyBuilder } from "./KeyBuilder";
import { TArray } from '../Extensions/TArray';
import { TString } from '../Text/TString';
import { CryptographicException } from "./CryptographicException";
import { Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { NotImplementedException } from "../Exceptions/NotImplementedException";
import { Convert } from '../convert';
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { Environment } from "../Environment";
import { ObjectDisposedException } from "../Disposable/ObjectDisposedException";
import { RandomNumberGenerator } from "./RandomNumberGenerator";
import { byte } from "../byte";

export abstract class SymmetricTransform extends TObject implements ICryptoTransform {
    protected algo: SymmetricAlgorithm = null as any;
    protected encrypt: boolean = false;
    protected BlockSizeByte: int = 0;
    protected temp: ByteArray = null as any;
    protected temp2: ByteArray = null as any;
    private workBuff: ByteArray = null as any;
    private workout: ByteArray = null as any;
    protected padmode: PaddingMode;

    protected FeedBackByte: int = 0;
    private m_disposed: boolean = false;
    protected lastBlock: boolean = false;

    public constructor(symmAlgo: SymmetricAlgorithm, encryption: boolean, rgbIV: ByteArray) {
        super();
        this.algo = symmAlgo;
        this.encrypt = encryption;
        this.BlockSizeByte = (this.algo.BlockSize >> 3);

        if (rgbIV == null) {
            rgbIV = KeyBuilder.IV(this.BlockSizeByte);
        }
        else {
            rgbIV = TArray.Clone(rgbIV);
        }
        // compare the IV length with the "currently selected" block size and *ignore* IV that are too big
        if (rgbIV.length < this.BlockSizeByte) {
            const msg: string = TString.Format("IV is too small ({0} bytes), it should be {1} bytes long.", rgbIV.length, this.BlockSizeByte);
            throw new CryptographicException(msg);
        }
        this.padmode = this.algo.Padding;
        // mode buffers
        this.temp = New.ByteArray(this.BlockSizeByte);
        TArray.Copy(rgbIV, 0, this.temp, 0, Math.min(this.BlockSizeByte, rgbIV.length));
        this.temp2 = New.ByteArray(this.BlockSizeByte);
        this.FeedBackByte = (this.algo.FeedbackSize >> 3);
        // transform buffers
        this.workBuff = New.ByteArray(this.BlockSizeByte);
        this.workout = New.ByteArray(this.BlockSizeByte);
    }

    /* 		~SymmetricTransform()
    {
        Dispose(false);
    }

    void IDisposable.Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);  // Finalization is now unnecessary
    } */

    // MUST be overriden by classes using unmanaged ressources
    // the override method must call the base class
    @Override
    protected dispose(disposing: boolean): void {
        if (!this.m_disposed) {
            if (disposing) {
                // dispose managed object: zeroize and free
                TArray.Clear(this.temp, 0, this.BlockSizeByte);
                this.temp = null as any;
                TArray.Clear(this.temp2, 0, this.BlockSizeByte);
                this.temp2 = null as any;
            }
            this.m_disposed = true;
        }
    }

    @Virtual
    protected Get_CanTransformMultipleBlocks() {
        return true;
    }
    public get CanTransformMultipleBlocks(): boolean {
        return true;
    }

    protected Get_CanReuseTransform(): boolean {
        return false;
    }
    public get CanReuseTransform(): boolean {
        return this.Get_CanReuseTransform();
    }

    @Virtual
    protected Get_InputBlockSize(): int {
        return this.BlockSizeByte;
    }
    public get InputBlockSize(): int {
        return this.Get_InputBlockSize();
    }

    protected Get_OutputBlockSize(): int {
        return this.BlockSizeByte;
    }
    public get OutputBlockSize(): int {
        return this.Get_OutputBlockSize();
    }

    // Selim Not : Each block must be BlockSizeValue in size!!!
    // Any padding must be done before calling this method.
    @Virtual
    protected Transform(input: ByteArray, output: ByteArray): void {
        switch (this.algo.Mode) {
            case CipherMode.ECB:
                this.ECB(input, output);
                break;
            case CipherMode.CBC:
                this.CBC(input, output);
                break;
            case CipherMode.CFB:
                this.CFB(input, output);
                break;
            case CipherMode.OFB:
                this.OFB(input, output);
                break;
            case CipherMode.CTS:
                this.CTS(input, output);
                break;
            default:
                throw new NotImplementedException("Unkown CipherMode" + (this.algo as any).Mode.toString());
        }
    }

    // Electronic Code Book (ECB)
    protected abstract ECB(input: ByteArray, output: ByteArray): void;

    // Cipher-Block-Chaining (CBC)
    @Virtual
    protected CBC(input: ByteArray, output: ByteArray): void {
        if (this.encrypt) {
            for (let i: int = 0; i < this.BlockSizeByte; i++)
                this.temp[i] ^= input[i];
            this.ECB(this.temp, output);
            TArray.Copy(output, 0, this.temp, 0, this.BlockSizeByte);
        }
        else {
            TArray.Copy(input, 0, this.temp2, 0, this.BlockSizeByte);
            this.ECB(input, output);
            for (let i: int = 0; i < this.BlockSizeByte; i++)
                output[i] ^= this.temp[i];
            TArray.Copy(this.temp2, 0, this.temp, 0, this.BlockSizeByte);
        }
    }

    // Cipher-FeedBack (CFB)
    // this is how *CryptoServiceProvider implements CFB
    // only AesCryptoServiceProvider support CFB > 8
    // RijndaelManaged is incompatible with this implementation (and overrides it in it's own transform)
    @Virtual
    protected CFB(input: ByteArray, output: ByteArray): void {
        if (this.encrypt) {
            for (let x: int = 0; x < this.BlockSizeByte; x++) {
                // temp is first initialized with the IV
                this.ECB(this.temp, this.temp2);
                output[x] = Convert.ToByte(this.temp2[0] ^ input[x]);
                TArray.Copy(this.temp, 1, this.temp, 0, this.BlockSizeByte - 1);
                TArray.Copy(output, x, this.temp, this.BlockSizeByte - 1, 1);
            }
        }
        else {
            for (let x: int = 0; x < this.BlockSizeByte; x++) {
                // we do not really decrypt this data!
                this.encrypt = true;
                // temp is first initialized with the IV
                this.ECB(this.temp, this.temp2);
                this.encrypt = false;

                TArray.Copy(this.temp, 1, this.temp, 0, this.BlockSizeByte - 1);
                TArray.Copy(input, x, this.temp, this.BlockSizeByte - 1, 1);
                output[x] = Convert.ToByte(this.temp2[0] ^ input[x]);
            }
        }
    }

    // Output-FeedBack (OFB)
    @Virtual
    protected OFB(input: ByteArray, output: ByteArray): void {
        throw new CryptographicException("OFB isn't supported by the framework");
    }

    // Cipher Text Stealing (CTS)
    @Virtual
    protected CTS(input: ByteArray, output: ByteArray): void {
        throw new CryptographicException("CTS isn't supported by the framework");
    }

    private CheckInput(inputBuffer: ByteArray, inputOffset: int, inputCount: int): void {
        if (inputBuffer == null)
            throw new ArgumentNullException("inputBuffer");
        if (inputOffset < 0)
            throw new ArgumentOutOfRangeException("inputOffset", "< 0");
        if (inputCount < 0)
            throw new ArgumentOutOfRangeException("inputCount", "< 0");
        // ordered to avoid possible integer overflow
        if (inputOffset > inputBuffer.length - inputCount)
            throw new ArgumentException("inputBuffer", Environment.GetResourceString("Overflow"));
    }

    // this method may get called MANY times so this is the one to optimize
    @Virtual
    public TransformBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int, outputBuffer: ByteArray, outputOffset: int): int {
        if (this.m_disposed)
            throw new ObjectDisposedException("Object is disposed");
        this.CheckInput(inputBuffer, inputOffset, inputCount);
        // check output parameters
        if (outputBuffer == null)
            throw new ArgumentNullException("outputBuffer");
        if (outputOffset < 0)
            throw new ArgumentOutOfRangeException("outputOffset", "< 0");

        // ordered to avoid possible integer overflow
        let len: int = outputBuffer.length - inputCount - outputOffset;
        if (!this.encrypt && (0 > len) && ((this.padmode === PaddingMode.None) || (this.padmode === PaddingMode.Zeros))) {
            throw new CryptographicException("outputBuffer " + Environment.GetResourceString("Overflow"));
        }
        else if (this.KeepLastBlock) {
            if (0 > len + this.BlockSizeByte) {
                throw new CryptographicException("outputBuffer: " + Environment.GetResourceString("Overflow"));
            }
        }
        else {
            if (0 > len) {
                // there's a special case if this is the end of the decryption process
                if (inputBuffer.length - inputOffset - outputBuffer.length === this.BlockSizeByte)
                    inputCount = outputBuffer.length - outputOffset;
                else
                    throw new CryptographicException("outputBuffer: " + Environment.GetResourceString("Overflow"));
            }
        }
        return this.InternalTransformBlock(inputBuffer, inputOffset, inputCount, outputBuffer, outputOffset);
    }

    private get KeepLastBlock(): boolean {
        return ((!this.encrypt) && (this.padmode !== PaddingMode.None) && (this.padmode !== PaddingMode.Zeros));
    }

    private InternalTransformBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int, outputBuffer: ByteArray, outputOffset: int): int {
        let offs: int = inputOffset;
        let full: int;

        // this way we don't do a modulo every time we're called
        // and we may save a division
        if (inputCount !== this.BlockSizeByte) {
            if ((inputCount % this.BlockSizeByte) !== 0)
                throw new CryptographicException("Invalid input block size.");

            full = Convert.ToInt32(inputCount / this.BlockSizeByte);
        }
        else
            full = 1;

        if (this.KeepLastBlock)
            full--;

        let total: int = 0;

        if (this.lastBlock) {
            this.Transform(this.workBuff, this.workout);
            TArray.Copy(this.workout, 0, outputBuffer, outputOffset, this.BlockSizeByte);
            outputOffset += this.BlockSizeByte;
            total += this.BlockSizeByte;
            this.lastBlock = false;
        }

        for (let i: int = 0; i < full; i++) {
            TArray.Copy(inputBuffer, offs, this.workBuff, 0, this.BlockSizeByte);
            this.Transform(this.workBuff, this.workout);
            TArray.Copy(this.workout, 0, outputBuffer, outputOffset, this.BlockSizeByte);
            offs += this.BlockSizeByte;
            outputOffset += this.BlockSizeByte;
            total += this.BlockSizeByte;
        }

        if (this.KeepLastBlock) {
            TArray.Copy(inputBuffer, offs, this.workBuff, 0, this.BlockSizeByte);
            this.lastBlock = true;
        }

        return total;
    }

    private _rng: RandomNumberGenerator = null as any;

    private Random(buffer: ByteArray, start: int, length: int): void {
        if (this._rng == null) {
            this._rng = RandomNumberGenerator.Create();
        }
        const random: ByteArray = New.ByteArray(length);
        this._rng.GetBytes(random);
        TArray.Copy(random, 0, buffer, start, length);
    }

    private ThrowBadPaddingException(padding: PaddingMode, length: int, position: int): void {
        let msg: string = TString.Format("Bad {0} padding.", padding);
        if (length >= 0)
            msg += TString.Format(" Invalid length {0}.", length);
        if (position >= 0)
            msg += TString.Format(" Error found at position {0}.", position);
        throw new CryptographicException(msg);
    }

    @Virtual
    protected FinalEncrypt(inputBuffer: ByteArray, inputOffset: int, inputCount: int): ByteArray {
        // are there still full block to process ?
        const full: int =  Convert.ToInt32(inputCount / this.BlockSizeByte) * this.BlockSizeByte;
        const rem: int = inputCount - full;
        let total: int = full;

        switch (this.padmode) {
            case PaddingMode.ANSIX923:
            case PaddingMode.ISO10126:
            case PaddingMode.PKCS7:
                // we need to add an extra block for padding
                total += this.BlockSizeByte;
                break;
            default:
                if (inputCount == 0)
                    return New.ByteArray(0);
                if (rem !== 0) {
                    if (this.padmode === PaddingMode.None)
                        throw new CryptographicException("invalid block length");
                    // zero padding the input (by adding a block for the partial data)
                    const paddedInput: ByteArray = New.ByteArray(full + this.BlockSizeByte);
                    TArray.Copy(inputBuffer, inputOffset, paddedInput, 0, inputCount);
                    inputBuffer = paddedInput;
                    inputOffset = 0;
                    inputCount = paddedInput.length;
                    total = inputCount;
                }
                break;
        }

        const res: ByteArray = New.ByteArray(total);
        let outputOffset: int = 0;

        // process all blocks except the last (final) block
        while (total > this.BlockSizeByte) {
            this.InternalTransformBlock(inputBuffer, inputOffset, this.BlockSizeByte, res, outputOffset);
            inputOffset += this.BlockSizeByte;
            outputOffset += this.BlockSizeByte;
            total -= this.BlockSizeByte;
        }

        // now we only have a single last block to encrypt
        const padding: byte = Convert.ToByte(this.BlockSizeByte - rem);
        switch (this.padmode) {
            case PaddingMode.ANSIX923:
                // XX 00 00 00 00 00 00 07 (zero + padding length)
                res[res.length - 1] = padding;
                TArray.Copy(inputBuffer, inputOffset, res, full, rem);
                // the last padded block will be transformed in-place
                this.InternalTransformBlock(res, full, this.BlockSizeByte, res, full);
                break;
            case PaddingMode.ISO10126:
                // XX 3F 52 2A 81 AB F7 07 (random + padding length)
                this.Random(res, res.length - padding, padding - 1);
                res[res.length - 1] = padding;
                TArray.Copy(inputBuffer, inputOffset, res, full, rem);
                // the last padded block will be transformed in-place
                this.InternalTransformBlock(res, full, this.BlockSizeByte, res, full);
                break;
            case PaddingMode.PKCS7:
                // XX 07 07 07 07 07 07 07 (padding length)
                for (let i: int = res.length; --i >= (res.length - padding);)
                    res[i] = padding;
                TArray.Copy(inputBuffer, inputOffset, res, full, rem);
                // the last padded block will be transformed in-place
                this.InternalTransformBlock(res, full, this.BlockSizeByte, res, full);
                break;
            default:
                this.InternalTransformBlock(inputBuffer, inputOffset, this.BlockSizeByte, res, outputOffset);
                break;
        }
        return res;
    }

    @Virtual
    protected FinalDecrypt(inputBuffer: ByteArray, inputOffset: int, inputCount: int): ByteArray {
        let full: int = inputCount;
        let total: int = inputCount;
        if (this.lastBlock)
            total += this.BlockSizeByte;

        const res: ByteArray = New.ByteArray(total);
        let outputOffset: int = 0;

        while (full > 0) {
            const len: int = this.InternalTransformBlock(inputBuffer, inputOffset, this.BlockSizeByte, res, outputOffset);
            inputOffset += this.BlockSizeByte;
            outputOffset += len;
            full -= this.BlockSizeByte;
        }

        if (this.lastBlock) {
            this.Transform(this.workBuff, this.workout);
            TArray.Copy(this.workout, 0, res, outputOffset, this.BlockSizeByte);
            outputOffset += this.BlockSizeByte;
            this.lastBlock = false;
        }

        // total may be 0 (e.g. PaddingMode.None)
        const padding: byte = ((total > 0) ? res[total - 1] : Convert.ToByte(0));
        switch (this.padmode) {
            case PaddingMode.ANSIX923:
                if ((padding === 0) || (padding > this.BlockSizeByte))
                    this.ThrowBadPaddingException(this.padmode, padding, -1);
                for (let i: int = padding - 1; i > 0; i--) {
                    if (res[total - 1 - i] != 0x00)
                        this.ThrowBadPaddingException(this.padmode, -1, i);
                }
                total -= padding;
                break;
            case PaddingMode.ISO10126:
                if ((padding == 0) || (padding > this.BlockSizeByte))
                    this.ThrowBadPaddingException(this.padmode, padding, -1);
                total -= padding;
                break;
            case PaddingMode.PKCS7:
                if ((padding === 0) || (padding > this.BlockSizeByte))
                    this.ThrowBadPaddingException(this.padmode, padding, -1);
                for (let i: int = padding - 1; i > 0; i--) {
                    if (res[total - 1 - i] != padding)
                        this.ThrowBadPaddingException(this.padmode, -1, i);
                }
                total -= padding;
                break;
            case PaddingMode.None:	// nothing to do - it's a multiple of block size
            case PaddingMode.Zeros:	// nothing to do - user must unpad himself
                break;
        }

        // return output without padding
        if (total > 0) {
            const data: ByteArray = New.ByteArray(total);
            TArray.Copy(res, 0, data, 0, total);
            // zeroize decrypted data (copy with padding)
            TArray.Clear(res, 0, res.length);
            return data;
        }
        else
            return New.ByteArray(0);
    }

    @Virtual
    public TransformFinalBlock(inputBuffer: ByteArray, inputOffset: int, inputCount: int): ByteArray {
        if (this.m_disposed)
            throw new ObjectDisposedException("Object is disposed");
        this.CheckInput(inputBuffer, inputOffset, inputCount);

        if (this.encrypt)
            return this.FinalEncrypt(inputBuffer, inputOffset, inputCount);
        else
            return this.FinalDecrypt(inputBuffer, inputOffset, inputCount);
    }
}