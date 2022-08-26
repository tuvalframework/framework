import { FileAccess } from "./FileAccess"
import { FileMode } from "./FileMode"
import { FileOptions } from "./FileOptions"
import { FileShare } from "./FileShare"
import { Stream } from "./Stream"
import { ByteArray, int, New } from "../float"
import { FileSystemRights } from "./FileSystemRights"
import { ArgumentNullException } from "../Exceptions/ArgumentNullException"
import { ArgumentException } from "../Exceptions/ArgumentException"
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { Path } from "./Path"
import { Directory } from "./Directory"
import { Locale } from "../Locale"
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException"
import { TString } from "../Text/TString"
import { DirectoryNotFoundException } from "./Exceptions/DirectoryNotFoundException"
import { File } from "./File"
import { FileNotFoundException } from "./Exceptions/FileNotFoundException"
import { MonoIOError } from "./MonoIOError"
import { Out } from "../Out"
import { MonoIO } from "./MonoIO"
import { MonoFileType } from "./MonoFileType"
import { Convert } from "../convert"
import { SeekOrigin } from "./SeekOrigin"
import { Override, Virtual } from "../Reflection"
import { IntPtr, SafeFileHandle } from "../Marshal/IntPtr"
import { ObjectDisposedException } from '../Disposable/ObjectDisposedException';
import { NotSupportedException } from "../Exceptions/NotSupportedException"
import { byte } from "../byte"
import { IOException } from "./IOException"
import { Exception } from "../Exception"
import { FileSecurity } from "./FileSecurity"
import { AccessControlSections } from "../security/AccessControl/AccessControlSections"
import { TArray } from '../Extensions/TArray';
import { is } from '../is';
import { FS, IDBFS } from "./Internals/FS"
import { SystemEvents } from "../SystemEvents"

export class FileStream extends Stream {
    // fields

    public /* internal */ static readonly DefaultBufferSize: int = 4096;

    // Input buffer ready for recycling
    private static buf_recycle: ByteArray;
    private buf: ByteArray = null as any;			// the buffer
    private name: string = "[Unknown]";	// name of file.

    private safeHandle: SafeFileHandle = SafeFileHandle.Zero;              // set only when using one of the
    // constructors taking SafeFileHandle

    private /* long */ append_startpos: int = 0;
    private handle: IntPtr = null as any;				// handle to underlying file

    private access: FileAccess = FileAccess.Read;
    private owner: boolean = false;
    private async: boolean = false;
    private canseek: boolean = false;
    private anonymous: boolean = false;
    private buf_dirty: boolean = false;			// true if buffer has been written to

    private buf_size: int = 0;			// capacity in bytes
    private buf_length: int = 0;			// number of valid bytes in buffer
    private buf_offset: int = 0;			// position of next byte
    private buf_start:/* long */ int = 0;			// location of buffer in file
    // construct from filename

    public constructor(path: string, mode: FileMode);
    public constructor(path: string, mode: FileMode, access: FileAccess);
    public constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare);
    public constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int);
    public constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, useAsync: boolean);
    public constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, options: FileOptions);
    //public constructor10(path: string, mode: FileMode, rights: FileSystemRights, share: FileShare, bufferSize: int, options: FileOptions);
    public /* internal */ constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, isAsync: boolean, anonymous: boolean);
    public /* internal */ constructor(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, anonymous: boolean, options: FileOptions);
    public constructor(...args: any[]) {
        super();
        this.handle = IntPtr.Zero;
        if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            this.constructor1(path, mode);
        } else if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            this.constructor2(path, mode, access);
        } else if (args.length === 4 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            this.constructor3(path, mode, access, share);
        } else if (args.length === 5 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            const bufferSize: int = args[4];
            this.constructor4(path, mode, access, share, bufferSize);
        } else if (args.length === 6 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.boolean(args[5])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            const bufferSize: int = args[4];
            const useAsync: boolean = args[5];
            this.constructor5(path, mode, access, share, bufferSize, useAsync);
        } else if (args.length === 6 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.int(args[5])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            const bufferSize: int = args[4];
            const options: FileOptions = args[5];
            this.constructor6(path, mode, access, share, bufferSize, options);
        } else if (args.length === 7 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.boolean(args[5]) && is.boolean(args[6])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            const bufferSize: int = args[4];
            const useAsync: boolean = args[5];
            const anonymous: boolean = args[6];
            this.constructor11(path, mode, access, share, bufferSize, useAsync, anonymous);

        } else if (args.length === 7 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3]) && is.int(args[4]) && is.boolean(args[5]) && is.int(args[6])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            const bufferSize: int = args[4];
            const anonymous: boolean = args[5];
            const options: FileOptions = args[6];
            this.constructor12(path, mode, access, share, bufferSize, anonymous, options);
        }
    }
    public constructor1(path: string, mode: FileMode) {
        this.constructor12(path, mode, (mode === FileMode.Append ? FileAccess.Write : FileAccess.ReadWrite), FileShare.Read, FileStream.DefaultBufferSize, false, FileOptions.None);

    }

    public constructor2(path: string, mode: FileMode, access: FileAccess) {
        this.constructor11(path, mode, access, access == FileAccess.Write ? FileShare.None : FileShare.Read, FileStream.DefaultBufferSize, false, false)
    }

    public constructor3(path: string, mode: FileMode, access: FileAccess, share: FileShare) {
        this.constructor12(path, mode, access, share, FileStream.DefaultBufferSize, false, FileOptions.None)
    }

    public constructor4(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int) {
        this.constructor12(path, mode, access, share, bufferSize, false, FileOptions.None)
    }

    public constructor5(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, useAsync: boolean) {
        this.constructor6(path, mode, access, share, bufferSize, useAsync ? FileOptions.Asynchronous : FileOptions.None)
    }

    public constructor6(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, options: FileOptions) {
        this.constructor12(path, mode, access, share, bufferSize, false, options)
    }


    /* public constructor7(handle: SafeFileHandle, access: FileAccess) {
        this.constructor9(handle, access, FileStream.DefaultBufferSize, false)
    }

    public constructor8(handle: SafeFileHandle, access: FileAccess, bufferSize: int) {
        this.constructor9(handle, access, bufferSize, false);
    }

    public constructor9(handle: SafeFileHandle, access: FileAccess, bufferSize: int, isAsync: boolean) {
        this.constructor1(handle, access, false, bufferSize, isAsync);
        this.safeHandle = handle;
    } */

    public constructor10(path: string, mode: FileMode, rights: FileSystemRights, share: FileShare, bufferSize: int, options: FileOptions) {
        this.constructor12(path, mode, (mode == FileMode.Append ? FileAccess.Write : FileAccess.ReadWrite), share, bufferSize, false, options)
    }

    /*    public constructor11( path:string,  mode:FileMode,  rights:FileSystemRights,  share:FileShare,  bufferSize:int,  options:FileOptions,
            fileSecurity:FileSecurity)
           : this(path, mode, (mode == FileMode.Append ? FileAccess.Write : FileAccess.ReadWrite), share, bufferSize, false, options)
   {
   } */


    public /* internal */ constructor11(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, isAsync: boolean, anonymous: boolean) {
        this.constructor12(path, mode, access, share, bufferSize, anonymous, isAsync ? FileOptions.Asynchronous : FileOptions.None)
    }

    public /* internal */ constructor12(path: string, mode: FileMode, access: FileAccess, share: FileShare, bufferSize: int, anonymous: boolean, options: FileOptions) {
        if (path == null) {
            throw new ArgumentNullException("path");
        }

        if (path.length === 0) {
            throw new ArgumentException("Path is empty");
        }

        this.anonymous = anonymous;
        // ignore the Inheritable flag
        share &= ~FileShare.Inheritable;

        if (bufferSize <= 0)
            throw new ArgumentOutOfRangeException("bufferSize", "Positive number required.");

        if (mode < FileMode.CreateNew || mode > FileMode.Append) {

            throw new ArgumentOutOfRangeException("mode", "Enum value was out of legal range.");
        }

        if (access < FileAccess.Read || access > FileAccess.ReadWrite) {
            throw new ArgumentOutOfRangeException("access", "Enum value was out of legal range.");
        }

        if (share < FileShare.None || share > (FileShare.ReadWrite | FileShare.Delete)) {
            throw new ArgumentOutOfRangeException("share", "Enum value was out of legal range.");
        }

        if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1) {
            throw new ArgumentException("Name has invalid chars");
        }

        if (Directory.Exists(path)) {
            // don't leak the path information for isolated storage
            const msg: string = Locale.GetText("Access to the path '{0}' is denied.");
            throw new UnauthorizedAccessException(TString.Format(msg, this.GetSecureFileName(path, false)));
        }

        /* Append streams can't be read (see FileMode
         * docs)
         */
        if (mode === FileMode.Append &&
            (access & FileAccess.Read) === FileAccess.Read) {
            throw new ArgumentException("Append access can be requested only in write-only mode.");
        }

        if ((access & FileAccess.Write) === 0 && (mode !== FileMode.Open && mode !== FileMode.OpenOrCreate)) {
            const msg: string = Locale.GetText("Combining FileMode: {0} with " + "FileAccess: {1} is invalid.");
            throw new ArgumentException(TString.Format(msg, access, mode));
        }

        let dname: string;
        if (Path.DirectorySeparatorChar !== '/'.charCodeAt(0) && path.indexOf('/') >= 0)
            dname = Path.GetDirectoryName(Path.GetFullPath(path));
        else
            dname = Path.GetDirectoryName(path);
        if (dname.length > 0) {
            const fp: string = Path.GetFullPath(dname);
            if (!Directory.Exists(fp)) {
                // don't leak the path information for isolated storage
                const msg: string = Locale.GetText("Could not find a part of the path \"{0}\".");
                const fname: string = (anonymous) ? dname : Path.GetFullPath(path);
                throw new DirectoryNotFoundException(TString.Format(msg, fname));
            }
        }

        if (access === FileAccess.Read && mode !== FileMode.Create && mode !== FileMode.OpenOrCreate &&
            mode !== FileMode.CreateNew && !File.Exists(path)) {
            // don't leak the path information for isolated storage
            const msg: string = Locale.GetText("Could not find file \"{0}\".");
            const fname: string = this.GetSecureFileName(path);
            throw new FileNotFoundException(TString.Format(msg, fname), fname);
        }

        // IsolatedStorage needs to keep the Name property to the default "[Unknown]"
        if (!anonymous)
            this.name = path;

        // TODO: demand permissions

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);

        this.handle = MonoIO.Open(path, mode, access, share, options, error);
        if (this.handle === MonoIO.InvalidHandle) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(path), error.value);
        }

        this.access = access;
        this.owner = true;

        /* Can we open non-files by name? */

        if (MonoIO.GetFileType(this.handle, error) === MonoFileType.Disk) {
            this.canseek = true;
            this.async = (options & FileOptions.Asynchronous) !== 0;
        } else {
            this.canseek = false;
            this.async = false;
        }

        if (access === FileAccess.Read && this.canseek && (bufferSize === FileStream.DefaultBufferSize)) {
            /* Avoid allocating a large buffer for small files */
            let len: int /* long */ = this.Length;
            if (bufferSize > len) {
                bufferSize = Convert.ToInt32(len < 1000 ? 1000 : len);
            }
        }

        this.InitBuffer(bufferSize, false);

        if (mode === FileMode.Append) {
            this.Seek(0, SeekOrigin.End);
            this.append_startpos = this.Position;
        } else {
            this.append_startpos = 0;
        }
    }


    // properties

    @Override
    protected Get_CanRead(): boolean {
        return this.access === FileAccess.Read || this.access === FileAccess.ReadWrite;
    }

    @Override
    protected Get_CanWrite(): boolean {
        return this.access === FileAccess.Write || this.access === FileAccess.ReadWrite;
    }

    @Override
    protected Get_CanSeek(): boolean {
        return (this.canseek);
    }

    @Override
    protected get IsAsync(): boolean {
        return this.async;
    }

    public get Name(): string {
        return this.name;
    }

    @Override
    protected Get_Length(): int {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (!this.CanSeek)
            throw new NotSupportedException("The stream does not support seeking");

        // Buffered data might change the length of the stream
        this.FlushBufferIfDirty();

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);
        let length: int = 0;

        length = MonoIO.GetLength(this.handle, error);
        if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }

        return (length);
    }


    @Override
    public Get_Position(): int {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (this.CanSeek === false)
            throw new NotSupportedException("The stream does not support seeking");

            // We always calc our position
        if (false/* this.safeHandle != null */) {
            // If the handle was leaked outside we always ask the real handle
            const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);;

            const ret: int = MonoIO.Seek(this.handle, 0, SeekOrigin.Current, error);

            if (error.value !== MonoIOError.ERROR_SUCCESS) {
                // don't leak the path information for isolated storage
                throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
            }

            return ret;
        }

        return (this.buf_start + this.buf_offset);
    }
    @Override
    public Set_Position(value: int) {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (this.CanSeek === false) {
            throw new NotSupportedException("The stream does not support seeking");
        }

        if (value < 0) {
            throw new ArgumentOutOfRangeException("Attempt to set the position to a negative value");
        }

        this.Seek(value, SeekOrigin.Begin);
    }

    @Virtual
    protected Get_Handle(): IntPtr {
        if (this.safeHandle == null) {
            this.ExposeHandle();
        }
        return this.handle;
    }
    public get Handle(): IntPtr {
        return this.Get_Handle();
    }

    @Virtual
    protected Get_SafeFileHandle(): SafeFileHandle {
        if (this.safeHandle == null) {
            this.ExposeHandle();
        }
        return this.safeHandle;
    }
    public get SafeFileHandle(): SafeFileHandle {
        return this.Get_SafeFileHandle();
    }

    // methods

    private ExposeHandle(): void {
        this.safeHandle = new SafeFileHandle(this.handle, false);
        this.FlushBuffer();
        this.InitBuffer(0, true);
    }

    @Override
    public ReadByte(): int {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (!this.CanRead)
            throw new NotSupportedException("Stream does not support reading");

        if (this.buf_size === 0) {
            const n: int = this.ReadData(this.handle, this.buf, 0, 1);
            if (n === 0) {
                return -1;
            }
            else return this.buf[0];
        }
        else if (this.buf_offset >= this.buf_length) {
            this.RefillBuffer();

            if (this.buf_length === 0)
                return -1;
        }

        return this.buf[this.buf_offset++];
    }

    @Override
    public WriteByte(value: byte): void {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (!this.CanWrite)
            throw new NotSupportedException("Stream does not support writing");

        if (this.buf_offset === this.buf_size)
            this.FlushBuffer();

        if (this.buf_size === 0) { // No buffering
            this.buf[0] = value;
            this.buf_dirty = true;
            this.buf_length = 1;
            this.FlushBuffer();
            return;
        }

        this.buf[this.buf_offset++] = value;
        if (this.buf_offset > this.buf_length)
            this.buf_length = this.buf_offset;

        this.buf_dirty = true;
    }

    @Override
    public Read(array: ByteArray, offset: int, count: int): int {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");
        if (array == null)
            throw new ArgumentNullException("array");
        if (!this.CanRead)
            throw new NotSupportedException("Stream does not support reading");
        const len: int = array.length;
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", "< 0");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", "< 0");
        if (offset > len)
            throw new ArgumentException("destination offset is beyond array size");
        // reordered to avoid possible integer overflow
        if (offset > len - count)
            throw new ArgumentException("Reading would overrun buffer");

        if (this.async) {
            /*   IAsyncResult ares = BeginRead(array, offset, count, null, null);
              return EndRead(ares); */
        }

        return this.ReadInternal(array, offset, count);
    }

    private ReadInternal(dest: ByteArray, offset: int, count: int): int {
        let n: int = this.ReadSegment(dest, offset, count);
        if (n === count) {
            return count;
        }

        let copied: int = n;
        count -= n;
        if (count > this.buf_size) {
            /* Read as much as we can, up
             * to count bytes
             */
            this.FlushBuffer();
            n = this.ReadData(this.handle, dest,
                offset + n,
                count);

            /* Make the next buffer read
             * start from the right place
             */
            this.buf_start += n;
        } else {
            this.RefillBuffer();
            n = this.ReadSegment(dest,
                offset + copied,
                count);
        }

        return copied + n;
    }

    //  delegate int ReadDelegate(byte[] buffer, int offset, int count);

    /*  public override IAsyncResult BeginRead(byte[] array, int offset, int numBytes,
         AsyncCallback userCallback, object stateObject) {
         if (handle == MonoIO.InvalidHandle)
             throw new ObjectDisposedException("Stream has been closed");

         if (!CanRead)
             throw new NotSupportedException("This stream does not support reading");

         if (array == null)
             throw new ArgumentNullException("array");

         if (numBytes < 0)
             throw new ArgumentOutOfRangeException("numBytes", "Must be >= 0");

         if (offset < 0)
             throw new ArgumentOutOfRangeException("offset", "Must be >= 0");

         // reordered to avoid possible integer overflow
         if (numBytes > array.Length - offset)
             throw new ArgumentException("Buffer too small. numBytes/offset wrong.");

         if (!async)
             return base.BeginRead(array, offset, numBytes, userCallback, stateObject);

         ReadDelegate r = new ReadDelegate(ReadInternal);
         return r.BeginInvoke(array, offset, numBytes, userCallback, stateObject);
     } */

    /* public override int EndRead(IAsyncResult asyncResult) {
        if (asyncResult == null)
            throw new ArgumentNullException("asyncResult");

        if (!async)
            return base.EndRead(asyncResult);

        AsyncResult ares = asyncResult as AsyncResult;
        if (ares == null)
            throw new ArgumentException("Invalid IAsyncResult", "asyncResult");

        ReadDelegate r = ares.AsyncDelegate as ReadDelegate;
        if (r == null)
            throw new ArgumentException("Invalid IAsyncResult", "asyncResult");

        return r.EndInvoke(asyncResult);
    } */

    @Override
    public Write(array: ByteArray, offset: int, count: int): void {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");
        if (array == null)
            throw new ArgumentNullException("array");
        if (offset < 0)
            throw new ArgumentOutOfRangeException("offset", "< 0");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", "< 0");
        // ordered to avoid possible integer overflow
        if (offset > array.length - count)
            throw new ArgumentException("Reading would overrun buffer");
        if (!this.CanWrite)
            throw new NotSupportedException("Stream does not support writing");

        if (this.async) {
            /*   IAsyncResult ares = BeginWrite(array, offset, count, null, null);
              EndWrite(ares); */
            return;
        }

        this.WriteInternal(array, offset, count);
    }

    private WriteInternal(src: ByteArray, offset: int, count: int): void {
        if (count > this.buf_size) {
            // shortcut for long writes
            const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);;

            this.FlushBuffer();
            let wcount: int = count;

            while (wcount > 0) {
                let n: int = MonoIO.Write(this.handle, src, offset, wcount, error);
                if (error.value !== MonoIOError.ERROR_SUCCESS)
                    throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);

                wcount -= n;
                offset += n;
            }
            this.buf_start += count;
        } else {

            let copied: int = 0;
            while (count > 0) {
                let n: int = this.WriteSegment(src, offset + copied, count);
                copied += n;
                count -= n;

                if (count == 0) {
                    break;
                }

                this.FlushBuffer();
            }
        }
    }

    //delegate void WriteDelegate(byte[] buffer, int offset, int count);

    /* public override IAsyncResult BeginWrite(byte[] array, int offset, int numBytes,
    AsyncCallback userCallback, object stateObject)
{
if (handle == MonoIO.InvalidHandle)
    throw new ObjectDisposedException("Stream has been closed");

if (!CanWrite)
    throw new NotSupportedException("This stream does not support writing");

if (array == null)
    throw new ArgumentNullException("array");

if (numBytes < 0)
    throw new ArgumentOutOfRangeException("numBytes", "Must be >= 0");

if (offset < 0)
    throw new ArgumentOutOfRangeException("offset", "Must be >= 0");

// reordered to avoid possible integer overflow
if (numBytes > array.Length - offset)
    throw new ArgumentException("array too small. numBytes/offset wrong.");

if (!async)
    return base.BeginWrite(array, offset, numBytes, userCallback, stateObject);

FileStreamAsyncResult result = new FileStreamAsyncResult(userCallback, stateObject);
result.BytesRead = -1;
result.Count = numBytes;
result.OriginalCount = numBytes;

if (buf_dirty) {
    MemoryStream ms = new MemoryStream();
    FlushBuffer(ms);
    ms.Write(array, offset, numBytes);
    offset = 0;
    numBytes = (int) ms.Length;
}

WriteDelegate w = new WriteDelegate(WriteInternal);
return w.BeginInvoke(array, offset, numBytes, userCallback, stateObject);
} */

    /* public override void EndWrite(IAsyncResult asyncResult)
{
if (asyncResult == null)
    throw new ArgumentNullException("asyncResult");

if (!async) {
    base.EndWrite(asyncResult);
    return;
}

AsyncResult ares = asyncResult as AsyncResult;
if (ares == null)
    throw new ArgumentException("Invalid IAsyncResult", "asyncResult");

WriteDelegate w = ares.AsyncDelegate as WriteDelegate;
if (w == null)
    throw new ArgumentException("Invalid IAsyncResult", "asyncResult");

w.EndInvoke(asyncResult);
return;
} */

    @Override
    public Seek(offset: int, origin: SeekOrigin): int {
        let pos: int = 0;

        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        // make absolute

        if (this.CanSeek === false) {
            throw new NotSupportedException("The stream does not support seeking");
        }

        switch (origin) {
            case SeekOrigin.End:
                pos = this.Length + offset;
                break;

            case SeekOrigin.Current:
                pos = this.Position + offset;
                break;

            case SeekOrigin.Begin:
                pos = offset;
                break;

            default:
                throw new ArgumentException("origin", "Invalid SeekOrigin");
        }

        if (pos < 0) {
            /* LAMESPEC: shouldn't this be
             * ArgumentOutOfRangeException?
             */
            throw new IOException("Attempted to Seek before the beginning of the stream");
        }

        if (pos < this.append_startpos) {
            /* More undocumented crap */
            throw new IOException("Can't seek back over pre-existing data in append mode");
        }

        this.FlushBuffer();

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);;

        this.buf_start = MonoIO.Seek(this.handle, pos, SeekOrigin.Begin, error);

        if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }

        return (this.buf_start);
    }

    @Override
    public SetLength(value: int): void {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");

        if (this.CanSeek === false)
            throw new NotSupportedException("The stream does not support seeking");

        if (this.CanWrite == false)
            throw new NotSupportedException("The stream does not support writing");

        if (value < 0)
            throw new ArgumentOutOfRangeException("value is less than 0");

        this.Flush();

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);

        MonoIO.SetLength(this.handle, value, error);
        if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }

        if (this.Position > value)
            this.Position = value;
    }

    public /* override */  Flush(): void;
    public /* virtual */  Flush(flushToDisk: boolean): void;
    public Flush(...args: any[]) {
        if (args.length === 0) {
            if (this.handle.Equals(MonoIO.InvalidHandle))
                throw new ObjectDisposedException("Stream has been closed");

            this.FlushBuffer();
        } else if (args.length === 1) {
            const flushToDisk: boolean = args[0];
            this.FlushBuffer();

            // This does the fsync
            if (flushToDisk) {
                const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);;
                MonoIO.Flush(this.handle, error);
            }
        }
    }


    @Virtual
    public Lock(position: int, length: int): void {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");
        if (position < 0) {
            throw new ArgumentOutOfRangeException("position must not be negative");
        }
        if (length < 0) {
            throw new ArgumentOutOfRangeException("length must not be negative");
        }
        if (this.handle.Equals(MonoIO.InvalidHandle)) {
            throw new ObjectDisposedException("Stream has been closed");
        }

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);;

        MonoIO.Lock(this.handle, position, length, error);
        if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }
    }

    @Virtual
    public Unlock(position: int, length: int): void {
        if (this.handle.Equals(MonoIO.InvalidHandle))
            throw new ObjectDisposedException("Stream has been closed");
        if (position < 0) {
            throw new ArgumentOutOfRangeException("position must not be negative");
        }
        if (length < 0) {
            throw new ArgumentOutOfRangeException("length must not be negative");
        }

        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);

        MonoIO.Unlock(this.handle, position, length, error);
        if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }
    }

    // protected

    /* ~FileStream()
    {
        Dispose(false);
    } */

    @Override
    protected dispose(disposing: boolean): void {
        let exc: Exception = null as any;
        if (!this.handle.Equals(MonoIO.InvalidHandle)) {
            try {
                // If the FileStream is in "exposed" status
                // it means that we do not have a buffer(we write the data without buffering)
                // therefor we don't and can't flush the buffer becouse we don't have one.
                this.FlushBuffer();
            } catch (e: any) {
                exc = e;
            }

            if (this.owner) {
                const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);

                MonoIO.Close(this.handle, error);
                if (error.value !== MonoIOError.ERROR_SUCCESS) {
                    // don't leak the path information for isolated storage
                    throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
                }

                this.handle = MonoIO.InvalidHandle;
            }
        }

        this.canseek = false;
        this.access = 0;

        if (disposing && this.buf != null) {
            if (this.buf.length === FileStream.DefaultBufferSize && FileStream.buf_recycle == null) {
                //lock(buf_recycle_lock) {
                if (FileStream.buf_recycle == null) {
                    FileStream.buf_recycle = this.buf;
                }
                //}
            }

            this.buf = null as any;
            //GC.SuppressFinalize(this);
        }
        if (exc != null)
            throw exc;
    }


    public GetAccessControl(): FileSecurity {
        return new FileSecurity(this.SafeFileHandle,
            AccessControlSections.Owner |
            AccessControlSections.Group |
            AccessControlSections.Access);
    }

    public SetAccessControl(fileSecurity: FileSecurity): void {
        if (null == fileSecurity)
            throw new ArgumentNullException("fileSecurity");

        //fileSecurity.PersistModifications(this.SafeFileHandle);
    }



    // private.

    // ReadSegment, WriteSegment, FlushBuffer,
    // RefillBuffer and ReadData should only be called
    // when the Monitor lock is held, but these methods
    // grab it again just to be safe.

    private ReadSegment(dest: ByteArray, dest_offset: int, count: int): int {
        count = Math.min(count, this.buf_length - this.buf_offset);

        if (count > 0) {
            // Use the fastest method, all range checks has been done
            TArray.Copy(this.buf, this.buf_offset, dest, dest_offset, count);
            this.buf_offset += count;
        }

        return count;
    }

    private WriteSegment(src: ByteArray, src_offset: int, count: int): int {
        if (count > this.buf_size - this.buf_offset) {
            count = this.buf_size - this.buf_offset;
        }

        if (count > 0) {
            TArray.Copy(src, src_offset, this.buf, this.buf_offset, count);
            this.buf_offset += count;
            if (this.buf_offset > this.buf_length) {
                this.buf_length = this.buf_offset;
            }

            this.buf_dirty = true;
        }

        return (count);
    }

    private FlushBuffer(st: Stream = null as any): void {
        if (this.buf_dirty) {
            const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);

            if (this.CanSeek === true && this.safeHandle == null) {
                MonoIO.Seek(this.handle, this.buf_start, SeekOrigin.Begin, error);
                if (error.value !== MonoIOError.ERROR_SUCCESS) {
                    // don't leak the path information for isolated storage
                    throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
                }
            }
            if (st == null) {
                let wcount: int = this.buf_length;
                let offset: int = 0;
                while (wcount > 0) {
                    const n: int = MonoIO.Write(this.handle, this.buf, 0, this.buf_length, error);
                    if (error.value !== MonoIOError.ERROR_SUCCESS) {
                        // don't leak the path information for isolated storage
                        throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
                    }
                    wcount -= n;
                    offset += n;
                }
            } else {
                st.Write(this.buf, 0, this.buf_length);
            }
        }

        this.buf_start += this.buf_offset;
        this.buf_offset = this.buf_length = 0;
        this.buf_dirty = false;
    }

    /* private  FlushBuffer():void {
        this.FlushBuffer(null);
    } */

    private FlushBufferIfDirty(): void {
        if (this.buf_dirty)
            this.FlushBuffer(null as any);
    }

    private RefillBuffer(): void {
        this.FlushBuffer(null as any);

        this.buf_length = this.ReadData(this.handle, this.buf, 0, this.buf_size);
    }

    private ReadData(handle: IntPtr, buf: ByteArray, offset: int, count: int): int {
        const error: Out<MonoIOError> = New.Out(MonoIOError.ERROR_SUCCESS);
        let amount: int = 0;

        /* when async == true, if we get here we don't suport AIO or it's disabled
         * and we're using the threadpool */
        amount = MonoIO.Read(handle, buf, offset, count, this.Position, error);
        if (error.value === MonoIOError.ERROR_BROKEN_PIPE) {
            amount = 0; // might not be needed, but well...
        } else if (error.value !== MonoIOError.ERROR_SUCCESS) {
            // don't leak the path information for isolated storage
            throw MonoIO.GetException(this.GetSecureFileName(this.name), error.value);
        }

        /* Check for read error */
        if (amount === -1) {
            throw new IOException('');
        }

        return (amount);
    }

    private InitBuffer(size: int, isZeroSize: boolean): void {
        if (isZeroSize) {
            size = 0;
            this.buf = New.ByteArray(1);
        } else {
            if (size <= 0)
                throw new ArgumentOutOfRangeException("bufferSize", "Positive number required.");

            size = Math.max(size, 8);

            //
            // Instead of allocating a new default buffer use the
            // last one if there is any available
            //
            if (size <= FileStream.DefaultBufferSize && FileStream.buf_recycle != null) {
                //lock(buf_recycle_lock) {
                if (FileStream.buf_recycle != null) {
                    this.buf = FileStream.buf_recycle;
                    FileStream.buf_recycle = null as any;
                }
                //}
            }

            if (this.buf == null)
                this.buf = New.ByteArray(size);
            else
                TArray.Clear(this.buf, 0, size);
        }

        this.buf_size = size;
        //			buf_start = 0;
        //			buf_offset = buf_length = 0;
        //			buf_dirty = false;
    }

    private GetSecureFileName(filename: string): string;
    private GetSecureFileName(filename: string, full: boolean): string;
    private GetSecureFileName(...args: any[]): string {
        if (args.length === 1 && is.string(args[0])) {
            const filename: string = args[0];
            return (this.anonymous) ? Path.GetFileName(filename) : Path.GetFullPath(filename);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const filename: string = args[0];
            const full: boolean = args[1];
            return (this.anonymous) ? Path.GetFileName(filename) : (full) ? Path.GetFullPath(filename) : filename;
        }
        throw new ArgumentOutOfRangeException('');
    }
}

/// #if WEB
(function () {
    FS.mkdir('/C');
    FS.mount(IDBFS, {}, '/C');
    FS.syncfs(true, function (err) {
        SystemEvents.OnFileSystemReady();
    });
})();
/// #endif