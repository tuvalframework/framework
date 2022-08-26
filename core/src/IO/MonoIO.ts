import { Dictionary } from "../Collections";
import { Convert } from "../convert";
import { Exception } from "../Exception";
import { ArgumentOutOfRangeException, NotImplementedException } from "../Exceptions";
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException";
import { ByteArray, char, int, long, New } from "../float";
import { is } from "../is";
import { IntPtr } from "../Marshal/IntPtr";
import { bigInt } from "../Math/BigNumber";
import { Out } from "../Out";
import { TString } from '../Text/TString';
import { DateTime } from "../Time/__DateTime";
import { DirectoryNotFoundException } from "./Exceptions/DirectoryNotFoundException";
import { DriveNotFoundException } from "./Exceptions/DriveNotFoundException";
import { FileNotFoundException } from "./Exceptions/FileNotFoundException";
import { PathTooLongException } from "./Exceptions/PathTooLongException";
import { FileAccess } from "./FileAccess";
import { FileAttributes } from "./FileAttributes";
import { FileMode } from "./FileMode";
import { FileOptions } from "./FileOptions";
import { FileShare } from "./FileShare";
import { FS, FSStream, PATH } from "./Internals/FS";
import { IOException } from "./IOException";
import { MonoFileType } from "./MonoFileType";
import { MonoIOError } from "./MonoIOError";
import { MonoIOStat } from "./MonoIOStat";
import { Path } from "./Path";
import { SeekOrigin } from "./SeekOrigin";

export class MonoIO {
    private static fileID: int = 0;

    private static filesRegistry: Dictionary<IntPtr, any> = null as any;
    private static get FilesRegistry(): Dictionary<IntPtr, FSStream> {
        if (MonoIO.filesRegistry == null) {
            MonoIO.filesRegistry = new Dictionary();
        }
        return MonoIO.filesRegistry;
    }
    public static readonly FileAlreadyExistsHResult: int = (Convert.ToInt32(0x80070000) | Convert.ToInt32(MonoIOError.ERROR_FILE_EXISTS));

    public static readonly InvalidFileAttributes: FileAttributes = -1;

    public static readonly InvalidHandle: IntPtr = new IntPtr(-1);

    public static GetFileHandle(): IntPtr {
        return new IntPtr(MonoIO.fileID++);
    }
    public static IsUnixPath(path: string): boolean {
        if (!(path.indexOf(':') > 0 && path.indexOf('\\') > 0)) {
            return true;
        }
        return false;
    }
    public static GetUnixDirectoryString(path: string): string {
        if (MonoIO.IsUnixPath(path)) {
            return path;
        }

        let filePath: string = path;
        let dirPath: string = Path.GetDirectoryName(path);
        let fileName: string = Path.GetFileName(path);
        if (TString.IsNullOrEmpty(dirPath)) {
            const error: Out<MonoIOError> = New.Out(null as any);
            //throw new Exception('Root Not Found.'); //root directory
            dirPath = MonoIO.GetCurrentDirectory(error);
            path = Path.Join(dirPath, fileName);
        }

        let newPath = path.replace(':\\', '\\');
        let dicArray: string[] = [];
        let i: number = 0;
        while (newPath != null && newPath !== '') {
            const directoryName = Path.GetDirectoryName(newPath);
            if (directoryName == null || directoryName === '') {
                break;
            }
            ///Console.WriteLine("GetDirectoryName('{0}') returns '{1}'", filePath, directoryName);
            const fileName = Path.GetFileName(directoryName);
            if (fileName !== '') {
                dicArray.push(fileName);
            } else if (directoryName !== '') {
                dicArray.push(directoryName);
            }

            newPath = directoryName;
            /*  if (i == 1) {
               filePath = directoryName + "\\";  // this will preserve the previous path
             } */
            i++;
        }
        dicArray = dicArray.reverse();
        return dicArray.join('/');
    }
    // error methods
    public static GetException(error: MonoIOError): Exception;
    public static GetException(path: string, error: MonoIOError): Exception;
    public static GetException(...args: any[]): Exception {
        if (args.length === 1) {
            /* This overload is currently only called from
             * File.MoveFile(), Directory.Move() and
             * Directory.GetCurrentDirectory() -
             * everywhere else supplies a path to format
             * with the error text.
             */
            const error: MonoIOError = args[0];
            switch (error) {
                case MonoIOError.ERROR_ACCESS_DENIED:
                    return new UnauthorizedAccessException("Access to the path is denied.");
                case MonoIOError.ERROR_FILE_EXISTS:
                    const message: string = "Cannot create a file that already exist.";
                    return new IOException(message, MonoIO.FileAlreadyExistsHResult);
                default:
                    /* Add more mappings here if other
                     * errors trigger the named but empty
                     * path bug (see bug 82141.) For
                     * everything else, fall through to
                     * the other overload
                     */
                    return MonoIO.GetException(TString.Empty, error);
            }
        } else if (args.length === 2) {
            const path: string = args[0];
            const error: MonoIOError = args[1];
            let message: string;

            switch (error) {
                // FIXME: add more exception mappings here
                case MonoIOError.ERROR_FILE_NOT_FOUND:
                    message = TString.Format("Could not find file \"{0}\"", path);
                    return new FileNotFoundException(message, path);

                case MonoIOError.ERROR_TOO_MANY_OPEN_FILES:
                    return new IOException("Too many open files", (0x80070000) | error);

                case MonoIOError.ERROR_PATH_NOT_FOUND:
                    message = TString.Format("Could not find a part of the path \"{0}\"", path);
                    return new DirectoryNotFoundException(message);

                case MonoIOError.ERROR_ACCESS_DENIED:
                    message = TString.Format("Access to the path \"{0}\" is denied.", path);
                    return new UnauthorizedAccessException(message);

                case MonoIOError.ERROR_INVALID_HANDLE:
                    message = TString.Format("Invalid handle to path \"{0}\"", path);
                    return new IOException(message, (0x80070000) | error);
                case MonoIOError.ERROR_INVALID_DRIVE:
                    message = TString.Format("Could not find the drive  '{0}'. The drive might not be ready or might not be mapped.", path);
                    return new DriveNotFoundException(message);
                case MonoIOError.ERROR_FILE_EXISTS:
                    message = TString.Format("Could not create file \"{0}\". File already exists.", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_FILENAME_EXCED_RANGE:
                    message = TString.Format("Path is too long. Path: {0}", path);
                    return new PathTooLongException(message);

                case MonoIOError.ERROR_INVALID_PARAMETER:
                    message = TString.Format("Invalid parameter");
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_WRITE_FAULT:
                    message = TString.Format("Write fault on path {0}", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_SHARING_VIOLATION:
                    message = TString.Format("Sharing violation on path {0}", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_LOCK_VIOLATION:
                    message = TString.Format("Lock violation on path {0}", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_HANDLE_DISK_FULL:
                    message = TString.Format("Disk full. Path {0}", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_DIR_NOT_EMPTY:
                    message = TString.Format("Directory {0} is not empty", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_ENCRYPTION_FAILED:
                    return new IOException("Encryption failed", (0x80070000) | error);

                case MonoIOError.ERROR_CANNOT_MAKE:
                    message = TString.Format("Path {0} is a directory", path);
                    return new IOException(message, (0x80070000) | error);

                case MonoIOError.ERROR_NOT_SAME_DEVICE:
                    message = "Source and destination are not on the same device";
                    return new IOException(message, (0x80070000) | error);

                default:
                    message = TString.Format("Win32 IO returned {0}. Path: {1}", error, path);
                    return new IOException(message, (0x80070000) | error);
            }
        }
        throw new ArgumentOutOfRangeException('');
    }


    // directory methods

    public static CreateDirectory(path: string, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('CreateDirectory');
    }
    public static RemoveDirectory(path: string, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('RemoveDirectory');
    }
    public static GetFileSystemEntries(path: string, path_with_pattern: string, attrs: int, mask: int, error: Out<MonoIOError>): string[] {
        throw new NotImplementedException('GetFileSystemEntries');
    }
    private static currentDirectory: string = 'C:\\';
    public static GetCurrentDirectory(error: Out<MonoIOError>): string {
        //throw new NotImplementedException('GetCurrentDirectory');
        error.value = MonoIOError.ERROR_SUCCESS;
        return MonoIO.currentDirectory;
    }
    public static SetCurrentDirectory(path: string, error: Out<MonoIOError>): boolean {
        // throw new NotImplementedException('SetCurrentDirectory');
        error.value = MonoIOError.ERROR_SUCCESS;
        MonoIO.currentDirectory = path;
        return true;
    }
    public static MoveFile(path: string, dest: string, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('MoveFile');
    }
    public static CopyFile(path: string, dest: string, overwrite: boolean, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('CopyFile');
    }
    public static DeleteFile(path: string, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('DeleteFile');
    }
    public static ReplaceFile(sourceFileName: string, destinationFileName: string, destinationBackupFileName: string, ignoreMetadataErrors: boolean, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('ReplaceFile');
    }
    public static GetFileAttributes(path: string, error: Out<MonoIOError>): FileAttributes {
        let result: FileAttributes = FileAttributes.Normal;
        error.value = MonoIOError.ERROR_SUCCESS;
        //throw new NotImplementedException('GetFileAttributes');

        let fullUnixPath = path;

        if (!MonoIO.IsUnixPath(path)) {
            const directorName = Path.GetDirectoryName(path);
            const fileName = Path.GetFileName(path);
            const unixDirectorName = MonoIO.GetUnixDirectoryString(path);
            fullUnixPath = PATH.join(unixDirectorName, fileName);
        }

        const info = FS.analyzePath(fullUnixPath);
        if (!info.exists) {
            error.value = 44;
            result = MonoIO.InvalidFileAttributes;
        } else {
            const mode: int = info.object.mode;
            if (FS.isDir(mode)) {
                result |= FileAttributes.Directory;
            }
            if (FS.isChrdev(mode)) {
                result |= FileAttributes.Device;
            }
            if (FS.isFile(mode)) {
                result |= FileAttributes.Normal;
            }
        }
        return result;
    }
    public static SetFileAttributes(path: string, attrs: FileAttributes, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('SetFileAttributes');
    }
    public static GetFileType(handle: IntPtr, error: Out<MonoIOError>): MonoFileType {
        // throw new NotImplementedException('GetFileType');
        return MonoFileType.Disk;
    }
    public static FindFirst(path: string, pattern: string, result_attr: Out<FileAttributes>, error: Out<MonoIOError>, handle: Out<IntPtr>): string {
        throw new NotImplementedException('FindFirst');
    }
    public static FindNext(handle: IntPtr, result_attr: Out<FileAttributes>, error: Out<MonoIOError>): string {
        throw new NotImplementedException('FindNext');
    }
    public static FindClose(handle: IntPtr): int {
        throw new NotImplementedException('FindClose');
    }

    public static Exists(path: string, error: Out<MonoIOError>): boolean {
        const attrs: FileAttributes = MonoIO.GetFileAttributes(path, error);
        if (attrs === MonoIO.InvalidFileAttributes)
            return false;

        return true;
    }

    public static ExistsFile(path: string, error: Out<MonoIOError>): boolean {
        const attrs: FileAttributes = MonoIO.GetFileAttributes(path, error);
        if (attrs === MonoIO.InvalidFileAttributes)
            return false;

        if ((attrs & FileAttributes.Directory) != 0)
            return false;

        return true;
    }

    public static ExistsDirectory(path: string, error: Out<MonoIOError>): boolean {
        const attrs: FileAttributes = MonoIO.GetFileAttributes(path, error);

        // Actually, we are looking for a directory, not a file
        if (error.value === MonoIOError.ERROR_FILE_NOT_FOUND)
            error.value = MonoIOError.ERROR_PATH_NOT_FOUND;

        if (attrs === MonoIO.InvalidFileAttributes)
            return false;

        if ((attrs & FileAttributes.Directory) == 0)
            return false;

        return true;
    }

    public static ExistsSymlink(path: string, error: Out<MonoIOError>): boolean {
        const attrs: FileAttributes = MonoIO.GetFileAttributes(path, error);
        if (attrs === MonoIO.InvalidFileAttributes)
            return false;

        if ((attrs & FileAttributes.ReparsePoint) == 0)
            return false;

        return true;
    }

    public static GetFileStat(path: string, stat: Out<MonoIOStat>, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('GetFileStat');
    }

    // handle methods

    public static Open(filename: string, mode: FileMode, access: FileAccess, share: FileShare, options: FileOptions, error: Out<MonoIOError>): IntPtr {
        //throw new NotImplementedException('Open');
        const dicArray = MonoIO.GetUnixDirectoryString(filename).split('/');
        let currentDicName: string = '';
        const _fileName: string = Path.GetFileName(filename);
        for (let i = 0; i < dicArray.length; i++) {
            currentDicName += '/' + dicArray[i];
            const analyzeObject = FS.analyzePath(currentDicName);
            if (!analyzeObject.exists) {
                FS.mkdir(currentDicName);
            }
        }
        let file;
        try {
            let fileInfo = FS.lookupPath(currentDicName + '/' + _fileName);
            if (fileInfo && fileInfo.node) {
                file = fileInfo.node;
            } else {
                file = FS.createFile(currentDicName, _fileName);
            }

        } catch (e) {
            file = FS.createFile(currentDicName, _fileName);
        }

        let accessStr: string = (access === FileAccess.Write ? 'w' : (access === FileAccess.Read ? 'r' : 'wr'));

        const openFile = FS.open(file, accessStr);
        const handle = MonoIO.GetFileHandle();
        MonoIO.FilesRegistry.Add(handle, openFile);
        return handle;
    }

    public static Close(handle: IntPtr, error: Out<MonoIOError>): boolean {
        // throw new NotImplementedException('Close');
        const file = MonoIO.FilesRegistry.Get(handle);
        if (file != null) {
            FS.close(file);
            error.value = MonoIOError.ERROR_SUCCESS;
            return true;
        }
        return false;
    }

    public static Read(handle: IntPtr, dest: ByteArray, dest_offset: int, count: int, position: int, error: Out<MonoIOError>): int {
        //throw new NotImplementedException('Read');
        const file = MonoIO.FilesRegistry.Get(handle);
        if (file != null && file.isRead) {
            const readBytes: int = FS.read(file, dest, dest_offset, count, position);
            error.value = MonoIOError.ERROR_SUCCESS;
            return readBytes;

        }
        return -1;
    }
    public static Write(handle: IntPtr, src: ByteArray, src_offset: int, count: int, error: Out<MonoIOError>): int {
        //throw new NotImplementedException('Write');
        const file = MonoIO.FilesRegistry.Get(handle);
        if (file != null && file.isWrite) {
            const result = FS.write(file, src, src_offset, count);
            error.value = MonoIOError.ERROR_SUCCESS;
            return result;
        }
        return -1;
    }
    public static Seek(handle: IntPtr, offset: int, origin: SeekOrigin, error: Out<MonoIOError>): int {
        //throw new NotImplementedException('Seek');
        const file = MonoIO.FilesRegistry.Get(handle);
        if (file != null) {
            FS.llseek(file, offset, 0);
            error.value = MonoIOError.ERROR_SUCCESS;
            return offset;
        }
        return -1;
    }
    public static Flush(handle: IntPtr, error: Out<MonoIOError>): boolean {
        FS.syncfs();
        error.value = MonoIOError.ERROR_SUCCESS;
        return true;
    }
    public static GetLength(handle: IntPtr, error: Out<MonoIOError>): int {
        //throw new NotImplementedException('GetLength');
        const file = MonoIO.FilesRegistry.Get(handle);
        if (file != null) {
            const stat = FS.stat(file.path);
            error.value = MonoIOError.ERROR_SUCCESS;
            return stat.size;
        }
        return -1;
    }
    public static SetLength(handle: IntPtr, length: int, error: Out<MonoIOError>): boolean {
        throw new NotImplementedException('SetLength');
    }
    public static SetFileTime(path: string, creation_time: long, last_access_time: long, last_write_time: long, error: Out<MonoIOError>): boolean;
    public static SetFileTime(handle: IntPtr, creation_time: long, last_access_time: long, last_write_time: long, error: Out<MonoIOError>): boolean;
    public static SetFileTime(path: string, type: int, creation_time: long, last_access_time: long, last_write_time: long, dateTime: DateTime, error: Out<MonoIOError>): boolean;
    public static SetFileTime(...args: any[]): boolean {
        if (args.length === 5 && is.string(args[0])) {
            const path: string = args[0];
            const creation_time: long = args[1];
            const last_access_time: long = args[2];
            const last_write_time: long = args[3];
            const error: Out<MonoIOError> = args[4];
            return MonoIO.SetFileTime(path, 0, creation_time, last_access_time, last_write_time, DateTime.MinValue, error);
        } else if (args.length === 5) {
            throw new NotImplementedException('SetFileTime');
        } else if (args.length === 8) {
            const path: string = args[0];
            const type: int = args[1];
            let creation_time: long = args[2];
            let last_access_time: long = args[3];
            let last_write_time: long = args[4];
            const dateTime: DateTime = args[5];
            const error: Out<MonoIOError> = args[6];
            let handle: IntPtr;
            let result: boolean;

            handle = MonoIO.Open(path, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite, FileOptions.None, error);
            if (handle === MonoIO.InvalidHandle)
                return false;

            switch (type) {
                case 1:
                    creation_time = dateTime.ToFileTime();
                    break;
                case 2:
                    last_access_time = dateTime.ToFileTime();
                    break;
                case 3:
                    last_write_time = dateTime.ToFileTime();
                    break;
            }

            result = MonoIO.SetFileTime(handle, creation_time, last_access_time, last_write_time, error);

            const ignore_error: Out<MonoIOError> = New.Out();
            MonoIO.Close(handle, ignore_error);

            return result;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static SetCreationTime(path: string, dateTime: DateTime, error: Out<MonoIOError>): boolean {
        return MonoIO.SetFileTime(path, 1, bigInt(-1), bigInt(-1), bigInt(-1), dateTime, error);
    }

    public static SetLastAccessTime(path: string, dateTime: DateTime, error: Out<MonoIOError>): boolean {
        return MonoIO.SetFileTime(path, 2, bigInt(-1), bigInt(-1), bigInt(-1), dateTime, error);
    }

    public static SetLastWriteTime(path: string, dateTime: DateTime, error: Out<MonoIOError>): boolean {
        return MonoIO.SetFileTime(path, 3, bigInt(-1), bigInt(-1), bigInt(-1), dateTime, error);
    }



    public static Lock(handle: IntPtr, position: int, length: int, error: Out<MonoIOError>): void {
        throw new NotImplementedException('Lock');
    }
    public static Unlock(handle: IntPtr, position: int, length: int, error: Out<MonoIOError>): void {
        throw new NotImplementedException('Unlock');
    }


    public static get ConsoleOutput(): IntPtr {
        throw new NotImplementedException('ConsoleOutput');
    }

    public static get ConsoleInput(): IntPtr {
        throw new NotImplementedException('ConsoleInput');
    }

    public static get ConsoleError(): IntPtr {
        throw new NotImplementedException('ConsoleError');
    }

    public static CreatePipe(read_handle: Out<IntPtr>, write_handle: Out<IntPtr>): boolean {
        throw new NotImplementedException('CreatePipe');
    }
    public static DuplicateHandle(source_process_handle: IntPtr, source_handle: IntPtr,
        target_process_handle: IntPtr, target_handle: Out<IntPtr>, access: int, inherit: int, options: int): boolean {
        throw new NotImplementedException('DuplicateHandle');
    }
    public static get VolumeSeparatorChar(): char {
        return ':'.charCodeAt(0);
    }

    public static get DirectorySeparatorChar(): char {
        return '\\'.charCodeAt(0);
    }

    public static get AltDirectorySeparatorChar(): char {
        return '/'.charCodeAt(0);
    }

    public static get PathSeparator(): char {
        return ';'.charCodeAt(0);
    }

    public static GetTempPath(path: Out<string>): int {
        throw new NotImplementedException('GetTempPath');
    }
}