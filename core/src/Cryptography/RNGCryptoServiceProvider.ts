import { IntPtr } from "../Marshal/IntPtr";
import { RandomNumberGenerator } from "./RandomNumberGenerator";
import { ByteArray, int, New, IntArray } from '../float';
import { Encoding } from "../Encoding/Encoding";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { is } from "../is";
import { CryptographyUtils } from "./Aes/AESprng";
import { TArray } from '../Extensions/TArray';
import { Exception } from '../Exception';

export class RNGCryptoServiceProvider extends RandomNumberGenerator {

    private _handle: IntPtr = null as any;
    public constructor();
    public constructor(rgb: ByteArray);
    public constructor(str: string);
    public constructor(...args: any[]) {
        super();
        if (args.length === 0) {
            this._handle = RNGCryptoServiceProvider.RngInitialize(null as any, IntPtr.Zero);
            this.Check();
        } else if (args.length === 1 && is.ByteArray(args[0])) {
            const rgb: ByteArray = args[0];
            const fixed_rgb: ByteArray = rgb;
            this._handle = RNGCryptoServiceProvider.RngInitialize(fixed_rgb, (rgb != null) ? new IntPtr(rgb.length) : IntPtr.Zero);
            this.Check();
        } else if (args.length === 1 && is.string(args[0])) {
            const str: string = args[0];
            if (str == null)
                this._handle = RNGCryptoServiceProvider.RngInitialize(null as any, IntPtr.Zero);
            else {
                const bytes: ByteArray = Encoding.UTF8.GetBytes(str);
                const fixed_bytes: ByteArray = bytes;
                this._handle = RNGCryptoServiceProvider.RngInitialize(fixed_bytes, new IntPtr(bytes.length));
            }
            this.Check();
        }
    }



    private Check(): void {
        /*  if (_handle == IntPtr.Zero) {
             throw new CryptographicException (
                 Locale.GetText ("Couldn't access random source."));
         } */
    }

    private static RngOpen(): boolean {
        return true;
    }

    private static _seedBytes: ByteArray = null as any;
    private static RngInitialize(seed: ByteArray, seed_length: IntPtr): IntPtr {
        RNGCryptoServiceProvider._seedBytes = seed;
        return IntPtr.Zero;
    }

    private static RngGetBytes(handle: IntPtr, data: ByteArray, data_length: IntPtr): IntPtr {
        if (RNGCryptoServiceProvider._seedBytes != null) {
            const buffer = CryptographyUtils.GenerateRandomFromBytes(RNGCryptoServiceProvider._seedBytes, data_length.ToInt32());
            TArray.Copy(buffer, 0, data, 0, data_length.ToInt32());
            return IntPtr.Zero;
        }
        throw new Exception('Must call RngInitialize method before generate random number.');
    }

    private static RngClose(handle: IntPtr): void {

    }

    public GetBytes(data: ByteArray): void;
    public GetBytes(data: ByteArray, data_length: IntPtr): void;
    public GetBytes(...args: any[]): void {
        if (args.length === 1 && is.ByteArray(args[0])) {
            const data: ByteArray = args[0];
            if (data == null)
                throw new ArgumentNullException("data");

            const fixed_data: ByteArray = data;
            {

                this._handle = RNGCryptoServiceProvider.RngGetBytes(this._handle, fixed_data, new IntPtr(data.length));

            }
            this.Check();
        } else if (args.length === 2 && is.ByteArray(args[0])) {
            const data: ByteArray = args[0];
            const data_length: IntPtr = args[1];
            this._handle = RNGCryptoServiceProvider.RngGetBytes(this._handle, data, data_length);
            this.Check();
        }
    }

    @Override
    public GetNonZeroBytes(data: ByteArray): void {
        if (data == null)
            throw new ArgumentNullException("data");

        const random: ByteArray = New.ByteArray(data.length * 2);
        let i: int = 0;
        // one pass should be enough but hey this is random ;-)
        while (i < data.length) {
            const fixed_random: ByteArray = random;
            this._handle = RNGCryptoServiceProvider.RngGetBytes(this._handle, fixed_random, new IntPtr(random.length));
            this.Check();
            for (let j: int = 0; j < random.length; j++) {
                if (i == data.length)
                    break;
                if (random[j] !== 0)
                    data[i++] = random[j];
            }
        }
    }

    @Override
    protected dispose(disposing: boolean): void {
        super.dispose(disposing);
    }
}