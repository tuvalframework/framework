import { List } from "../Collections/Generic/List";
import { using } from "../Disposable/dispose";
import { Encoding } from "../Encoding/Encoding";
import { Exception } from "../Exception";
import { ArgumentOutOfRangeException, NotSupportedException } from "../Exceptions";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException";
import { ByteArray, int, New } from "../float";
import { foreach } from "../foreach";
import { Int32 } from "../Int32";
import { is } from "../is";
import { Locale } from "../Locale";
import { Out } from "../Out";
import { AccessControlSections } from "../security/AccessControl/AccessControlSections";
import { SecurityManager } from "../security/SecurityManager";
import { System } from "../SystemTypes";
import { TString } from "../Text/TString";
import { DateTime } from "../Time/__DateTime";
import { Directory } from "./Directory";
import { DirectoryNotFoundException } from "./Exceptions/DirectoryNotFoundException";
import { FileNotFoundException } from "./Exceptions/FileNotFoundException";
import { FileAccess } from "./FileAccess";
import { FileAttributes } from "./FileAttributes";
import { FileMode } from "./FileMode";
import { FileOptions } from "./FileOptions";
import { FileSecurity } from "./FileSecurity";
import { FileShare } from "./FileShare";
import { FileStream } from "./FileStream";
import { IOException } from "./IOException";
import { MonoIO } from "./MonoIO";
import { MonoIOError } from "./MonoIOError";
import { MonoIOStat } from "./MonoIOStat";
import { Path } from "./Path";
import { Stream } from "./Stream";
import { StreamReader } from "./StreamReader";
import { StreamWriter } from "./StreamWriter";
import { TextWriter } from "./TextWriter";

export class File {
    public static AppendAllText(path: string, contents: string): void;
    public static AppendAllText(path: string, contents: string, encoding: Encoding): void;
    public static AppendAllText(...args: any[]): void {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const path: string = args[0];
            const contents: string = args[1];
            using(new StreamWriter(path, true), (w: TextWriter) => {
                w.Write(contents);
            });
        } else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.typeof<Encoding>(args[2], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const contents: string = args[1];
            const encoding: Encoding = args[2];
            using(new StreamWriter(path, true, encoding), (w: TextWriter) => {
                w.Write(contents);
            });
        }
    }

    public static AppendText(path: string): StreamWriter {
        return new StreamWriter(path, true);
    }

    public static Copy(sourceFileName: string, destFileName: string): void;
    public static Copy(sourceFileName: string, destFileName: string, overwrite: boolean): void;
    public static Copy(...args: any[]): void {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const sourceFileName: string = args[0];
            const destFileName: string = args[1];
            File.Copy(sourceFileName, destFileName, false);
        } else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.boolean(args[2])) {
            const sourceFileName: string = args[0];
            const destFileName: string = args[1];
            const overwrite: boolean = args[2];
            const error: Out<MonoIOError> = New.Out();

            if (sourceFileName == null)
                throw new ArgumentNullException("sourceFileName");
            if (destFileName == null)
                throw new ArgumentNullException("destFileName");
            if (sourceFileName.length === 0)
                throw new ArgumentException("An empty file name is not valid.", "sourceFileName");
            if (sourceFileName.trim().length == 0 || sourceFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
                throw new ArgumentException("The file name is not valid.");
            if (destFileName.length == 0)
                throw new ArgumentException("An empty file name is not valid.", "destFileName");
            if (destFileName.trim().length === 0 || destFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
                throw new ArgumentException("The file name is not valid.");

            SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

            if (!MonoIO.Exists(sourceFileName, error))
                throw new FileNotFoundException(Locale.GetText("{0} does not exist", sourceFileName), sourceFileName);
            if ((File.GetAttributes(sourceFileName) & FileAttributes.Directory) === FileAttributes.Directory)
                throw new ArgumentException(Locale.GetText("{0} is a directory", sourceFileName));

            if (MonoIO.Exists(destFileName, error)) {
                if ((File.GetAttributes(destFileName) & FileAttributes.Directory) === FileAttributes.Directory)
                    throw new ArgumentException(Locale.GetText("{0} is a directory", destFileName));
                if (!overwrite)
                    throw new IOException(Locale.GetText("{0} already exists", destFileName));
            }

            const DirName: string = Path.GetDirectoryName(destFileName);
            if (DirName !== TString.Empty && !Directory.Exists(DirName))
                throw new DirectoryNotFoundException(Locale.GetText("Destination directory not found: {0}", DirName));

            if (!MonoIO.CopyFile(sourceFileName, destFileName, overwrite, error)) {
                const p: string = Locale.GetText("{0}\" or \"{1}", sourceFileName, destFileName);
                throw MonoIO.GetException(p, error.value);
            }
        }
    }



    public static Create(path: string): FileStream;
    public static Create(path: string, bufferSize: int): FileStream;
    public static Create(path: string, bufferSize: int, options: FileOptions): FileStream;
    public static Create(path: string, bufferSize: int, options: FileOptions, fileSecurity: FileSecurity): FileStream;
    public static Create(...args: any[]): FileStream {
        if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            return File.Create(path, 8192);
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const path: string = args[0];
            const bufferSize: int = args[1];
            return new FileStream(path, FileMode.Create, FileAccess.ReadWrite, FileShare.None, bufferSize);
        } else if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const path: string = args[0];
            const bufferSize: int = args[1];
            const options: FileOptions = args[2];
            return File.Create(path, bufferSize, options, null as any);
        } else if (args.length === 4 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const path: string = args[0];
            const bufferSize: int = args[1];
            const options: FileOptions = args[2];
            const fileSecurity: FileSecurity = args[3];
            return new FileStream(path, FileMode.Create, FileAccess.ReadWrite, FileShare.None, bufferSize, options);
        }
        throw new ArgumentOutOfRangeException('');
    }
    public static CreateText(path: string): StreamWriter {
        return new StreamWriter(path, false);
    }

    public static Delete(path: string): void {
        Path.Validate(path);
        if (Directory.Exists(path))
            throw new UnauthorizedAccessException(Locale.GetText("{0} is a directory", path));

        const DirName: string = Path.GetDirectoryName(path);
        if (DirName !== TString.Empty && !Directory.Exists(DirName))
            throw new DirectoryNotFoundException(Locale.GetText("Could not find a part of the path \"{0}\".", path));

        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const error: Out<MonoIOError> = New.Out();

        if (!MonoIO.DeleteFile(path, error)) {
            if (error.value !== MonoIOError.ERROR_FILE_NOT_FOUND)
                throw MonoIO.GetException(path, error.value);
        }
    }

    public static Exists(path: string): boolean {
        // For security reasons no exceptions are
        // thrown, only false is returned if there is
        // any problem with the path or permissions.
        // Minimizes what information can be
        // discovered by using this method.
        if (TString.IsNullOrWhiteSpace(path) || path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) >= 0)
            return false;

        // on Moonlight this does not throw but returns false
        if (!SecurityManager.CheckElevatedPermissions())
            return false;

        const error: Out<MonoIOError> = New.Out();;
        return MonoIO.ExistsFile(path, error);
    }

    public static GetAccessControl(path: string): FileSecurity;
    public static GetAccessControl(path: string, includeSections: AccessControlSections): FileSecurity;
    public static GetAccessControl(...args: any[]): FileSecurity {
        if (args.length === 1) {
            const path: string = args[0];
            // AccessControlSections.Audit requires special permissions.
            return File.GetAccessControl(path,
                AccessControlSections.Owner |
                AccessControlSections.Group |
                AccessControlSections.Access);
        } else if (args.length === 2) {
            const path: string = args[0];
            const includeSections: AccessControlSections = args[1];
            return new FileSecurity(path, includeSections);
        }
        throw new ArgumentOutOfRangeException('');
    }
    public static GetAttributes(path: string): FileAttributes {
        Path.Validate(path);
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const error: Out<MonoIOError> = New.Out();;
        let attrs: FileAttributes;

        attrs = MonoIO.GetFileAttributes(path, error);
        if (error.value !== MonoIOError.ERROR_SUCCESS)
            throw MonoIO.GetException(path, error.value);
        return attrs;
    }

    public static GetCreationTime(path: string): DateTime {
        let stat: Out<MonoIOStat> = New.Out();
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        if (!MonoIO.GetFileStat(path, stat, error)) {
            if (error.value === MonoIOError.ERROR_PATH_NOT_FOUND || error.value === MonoIOError.ERROR_FILE_NOT_FOUND)
                return File.DefaultLocalFileTime;
            else
                throw new IOException(path);
        }
        return DateTime.FromFileTime(stat.value.CreationTime);
    }

    public static GetCreationTimeUtc(path: string): DateTime {
        return File.GetCreationTime(path).ToUniversalTime();
    }

    public static GetLastAccessTime(path: string): DateTime {
        const stat: Out<MonoIOStat> = New.Out();
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        if (!MonoIO.GetFileStat(path, stat, error)) {
            if (error.value === MonoIOError.ERROR_PATH_NOT_FOUND || error.value === MonoIOError.ERROR_FILE_NOT_FOUND)
                return File.DefaultLocalFileTime;
            else
                throw new IOException(path);
        }
        return DateTime.FromFileTime(stat.value.LastAccessTime);
    }

    public static GetLastAccessTimeUtc(path: string): DateTime {
        return File.GetLastAccessTime(path).ToUniversalTime();
    }

    public static GetLastWriteTime(path: string): DateTime {
        const stat: Out<MonoIOStat> = New.Out();
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        if (!MonoIO.GetFileStat(path, stat, error)) {
            if (error.value === MonoIOError.ERROR_PATH_NOT_FOUND || error.value === MonoIOError.ERROR_FILE_NOT_FOUND)
                return File.DefaultLocalFileTime;
            else
                throw new IOException(path);
        }
        return DateTime.FromFileTime(stat.value.LastWriteTime);
    }

    public static GetLastWriteTimeUtc(path: string): DateTime {
        return File.GetLastWriteTime(path).ToUniversalTime();
    }

    public static Move(sourceFileName: string, destFileName: string): void {
        if (sourceFileName == null)
            throw new ArgumentNullException("sourceFileName");
        if (destFileName == null)
            throw new ArgumentNullException("destFileName");
        if (sourceFileName.length === 0)
            throw new ArgumentException("An empty file name is not valid.", "sourceFileName");
        if (sourceFileName.trim().length === 0 || sourceFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
            throw new ArgumentException("The file name is not valid.");
        if (destFileName.length === 0)
            throw new ArgumentException("An empty file name is not valid.", "destFileName");
        if (destFileName.trim().length === 0 || destFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
            throw new ArgumentException("The file name is not valid.");

        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const error: Out<MonoIOError> = New.Out();
        if (!MonoIO.Exists(sourceFileName, error)) {
            throw new FileNotFoundException(Locale.GetText("{0} does not exist", sourceFileName), sourceFileName);
        }

        // Don't check for this error here to allow the runtime
        // to check if sourceFileName and destFileName are equal.
        // Comparing sourceFileName and destFileName is not enough.
        //if (MonoIO.Exists (destFileName, out error))
        //	throw new IOException (Locale.GetText ("{0} already exists", destFileName));

        let DirName: string;
        DirName = Path.GetDirectoryName(destFileName);
        if (DirName !== TString.Empty && !Directory.Exists(DirName))
            throw new DirectoryNotFoundException(Locale.GetText("Could not find a part of the path."));

        if (!MonoIO.MoveFile(sourceFileName, destFileName, error)) {
            if (error.value === MonoIOError.ERROR_ALREADY_EXISTS)
                throw MonoIO.GetException(error.value);
            else if (error.value === MonoIOError.ERROR_SHARING_VIOLATION)
                throw MonoIO.GetException(sourceFileName, error.value);

            throw MonoIO.GetException(error.value);
        }
    }

    public static Open(path: string, mode: FileMode): FileStream;
    public static Open(path: string, mode: FileMode, access: FileAccess): FileStream;
    public static Open(path: string, mode: FileMode, access: FileAccess, share: FileShare): FileStream;
    public static Open(...args: any[]): FileStream {
        if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            return new FileStream(path, mode, mode === FileMode.Append ? FileAccess.Write : FileAccess.ReadWrite, FileShare.None);
        } else if (args.length === 3 && is.string(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            return new FileStream(path, mode, access, FileShare.None);
        } else if (args.length === 4 && is.string(args[0]) && is.int(args[1]) && is.int(args[2]) && is.int(args[3])) {
            const path: string = args[0];
            const mode: FileMode = args[1];
            const access: FileAccess = args[2];
            const share: FileShare = args[3];
            return new FileStream(path, mode, access, share);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static OpenRead(path: string): FileStream {
        return new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read);
    }

    public static OpenText(path: string): StreamReader {
        return new StreamReader(path);
    }

    public static OpenWrite(path: string): FileStream {
        return new FileStream(path, FileMode.OpenOrCreate, FileAccess.Write, FileShare.None);
    }

    public static Replace(sourceFileName: string, destinationFileName: string, destinationBackupFileName: string): void;
    public static Replace(sourceFileName: string, destinationFileName: string, destinationBackupFileName: string, ignoreMetadataErrors: boolean): void;
    public static Replace(...args: any[]): void {
        if (args.length === 3) {
            const sourceFileName: string = args[0];
            const destinationFileName: string = args[1];
            const destinationBackupFileName: string = args[2];
            File.Replace(sourceFileName, destinationFileName, destinationBackupFileName, false);
        } else if (args.length === 4) {
            const sourceFileName: string = args[0];
            const destinationFileName: string = args[1];
            const destinationBackupFileName: string = args[2];
            const ignoreMetadataErrors: boolean = args[3];
            const error: Out<MonoIOError> = New.Out();;

            if (sourceFileName == null)
                throw new ArgumentNullException("sourceFileName");
            if (destinationFileName == null)
                throw new ArgumentNullException("destinationFileName");
            if (sourceFileName.trim().length === 0 || sourceFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
                throw new ArgumentException("sourceFileName");
            if (destinationFileName.trim().length === 0 || destinationFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
                throw new ArgumentException("destinationFileName");

            const fullSource: string = Path.GetFullPath(sourceFileName);
            const fullDest: string = Path.GetFullPath(destinationFileName);
            if (MonoIO.ExistsDirectory(fullSource, error))
                throw new IOException(Locale.GetText("{0} is a directory", sourceFileName));
            if (MonoIO.ExistsDirectory(fullDest, error))
                throw new IOException(Locale.GetText("{0} is a directory", destinationFileName));

            if (!File.Exists(fullSource))
                throw new FileNotFoundException(Locale.GetText("{0} does not exist", sourceFileName),
                    sourceFileName);
            if (!File.Exists(fullDest))
                throw new FileNotFoundException(Locale.GetText("{0} does not exist", destinationFileName),
                    destinationFileName);
            if (fullSource == fullDest)
                throw new IOException(Locale.GetText("Source and destination arguments are the same file."));

            let fullBackup: string = null as any;
            if (destinationBackupFileName != null) {
                if (destinationBackupFileName.trim().length === 0 || destinationBackupFileName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
                    throw new ArgumentException("destinationBackupFileName");

                fullBackup = Path.GetFullPath(destinationBackupFileName);
                if (MonoIO.ExistsDirectory(fullBackup, error))
                    throw new IOException(Locale.GetText("{0} is a directory", destinationBackupFileName));
                if (fullSource == fullBackup)
                    throw new IOException(Locale.GetText("Source and backup arguments are the same file."));
                if (fullDest == fullBackup)
                    throw new IOException(Locale.GetText(
                        "Destination and backup arguments are the same file."));
            }

            if (!MonoIO.ReplaceFile(fullSource, fullDest, fullBackup,
                ignoreMetadataErrors, error)) {
                throw MonoIO.GetException(error.value);
            }
        }
    }

    public static SetAccessControl(path: string, fileSecurity: FileSecurity): void {
        if (null == fileSecurity)
            throw new ArgumentNullException("fileSecurity");

        fileSecurity.PersistModifications(path);
    }
    public static SetAttributes(path: string, fileAttributes: FileAttributes): void {
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);

        if (!MonoIO.SetFileAttributes(path, fileAttributes, error))
            throw MonoIO.GetException(path, error.value);
    }

    public static SetCreationTime(path: string, creationTime: DateTime): void {
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        if (!MonoIO.Exists(path, error))
            throw MonoIO.GetException(path, error.value);
        if (!MonoIO.SetCreationTime(path, creationTime, error))
            throw MonoIO.GetException(path, error.value);
    }

    public static SetCreationTimeUtc(path: string, creationTimeUtc: DateTime): void {
        File.SetCreationTime(path, creationTimeUtc.ToLocalTime());
    }

    public static SetLastAccessTime(path: string, lastAccessTime: DateTime): void {
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        if (!MonoIO.Exists(path, error))
            throw MonoIO.GetException(path, error.value);
        if (!MonoIO.SetLastAccessTime(path, lastAccessTime, error))
            throw MonoIO.GetException(path, error.value);
    }

    public static SetLastAccessTimeUtc(path: string, lastAccessTimeUtc: DateTime): void {
        File.SetLastAccessTime(path, lastAccessTimeUtc.ToLocalTime());
    }

    public static SetLastWriteTime(path: string, lastWriteTime: DateTime): void {
        const error: Out<MonoIOError> = New.Out();
        Path.Validate(path);
        if (!MonoIO.Exists(path, error))
            throw MonoIO.GetException(path, error.value);
        if (!MonoIO.SetLastWriteTime(path, lastWriteTime, error))
            throw MonoIO.GetException(path, error.value);
    }

    public static SetLastWriteTimeUtc(path: string, lastWriteTimeUtc: DateTime): void {
        File.SetLastWriteTime(path, lastWriteTimeUtc.ToLocalTime());
    }

    //
    // The documentation for this method is most likely wrong, it
    // talks about doing a "binary read", but the remarks say
    // that this "detects the encoding".
    //
    // This can not detect and do anything useful with the encoding
    // since the result is a byte [] not a char [].
    //
    public static ReadAllBytes(path: string): ByteArray {
        let result: ByteArray = null as any;
        using(File.OpenRead(path), (s: FileStream) => {
            const size: int = s.Length;
            if (size > Int32.MaxValue)
                throw new IOException("Reading more than 2GB with this call is not supported");

            let pos: int = 0;
            let count: int = size;
            const result: ByteArray = New.ByteArray(size);
            while (count > 0) {
                const n: int = s.Read(result, pos, count);
                if (n === 0)
                    throw new IOException("Unexpected end of stream");
                pos += n;
                count -= n;
            }
        });
        return result;
    }

    public static ReadAllLines(path: string): string[];
    public static ReadAllLines(path: string, encoding: Encoding): string[];
    public static ReadAllLines(...args: any[]): string[] {
        if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            let result: string[] = null as any
            using(File.OpenText(path), (reader: StreamReader) => {
                result = File._ReadAllLines(reader);
            });
            return result;
        } else if (args.length === 2 && is.string(args[0]) && is.typeof<Encoding>(args[0], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const encoding: Encoding = args[1];
            let result: string[] = null as any;
            using(new StreamReader(path, encoding), (reader: StreamReader) => {
                result = File._ReadAllLines(reader);
            });
            return result;
        }
        throw new ArgumentOutOfRangeException('');
    }


    private static _ReadAllLines(reader: StreamReader): string[] {
        const list: List<string> = new List<string>();
        while (!reader.EndOfStream) {
            list.Add(reader.ReadLine());
        }
        return list.ToArray();
    }

    public static ReadAllText(path: string): string;
    public static ReadAllText(path: string, encoding: Encoding): string;
    public static ReadAllText(...args: any[]): string {
        if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            let result: string = TString.Empty;
            using(new StreamReader(path), (sr: StreamReader) => {
                result = sr.ReadToEnd();
            });
            return result;
        } else if (args.length === 2 && is.string(args[0]) && is.typeof<Encoding>(args[0], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const encoding: Encoding = args[1];
            let result: string = TString.Empty;
            using(new StreamReader(path, encoding), (sr: StreamReader) => {
                result = sr.ReadToEnd();
            });
            return result;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static WriteAllBytes(path: string, bytes: ByteArray): void {
        using(File.Create(path), (stream: Stream) => {
            stream.Write(bytes, 0, bytes.length);
        });
    }

    public static WriteAllLines(path: string, contents: string[]): void;
    public static WriteAllLines(path: string, contents: string[], encoding: Encoding): void;
    public static WriteAllLines(...args: any[]): void {
        if (args.length === 2 && is.string(args[0]) && is.array(args[1])) {
            const path: string = args[0];
            const contents: string[] = args[1];
            using(new StreamWriter(path), (writer: StreamWriter) => {
                File._WriteAllLines(writer, contents);
            });
        } else if (args.length === 3 && is.string(args[0]) && is.array(args[1]) && is.typeof<Encoding>(args[0], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const contents: string[] = args[1];
            const encoding: Encoding = args[2];
            using(new StreamWriter(path, false, encoding), (writer: StreamWriter) => {
                File._WriteAllLines(writer, contents);
            });
        }
    }

    private static _WriteAllLines(writer: StreamWriter, contents: string[]): void {
        foreach(contents, (line: string) => {
            writer.WriteLineString(line);
        });
    }

    public static WriteAllText(path: string, contents: string): void;
    public static WriteAllText(path: string, contents: string, encoding: Encoding): void;
    public static WriteAllText(...args: any[]): void {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const path: string = args[0];
            const contents: string = args[1];
            File.WriteAllText(path, contents, Encoding.UTF8Unmarked);
        } else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.typeof<Encoding>(args[2], System.Types.Encoding.Encoding)) {
            const path: string = args[0];
            const contents: string = args[1];
            const encoding: Encoding = args[2];
            using(new StreamWriter(path, false, encoding), (sw: StreamWriter) => {
                sw.Write(contents);
            });
        }
    }

    private static defaultLocalFileTime: DateTime = null as any;
    private static get DefaultLocalFileTime(): DateTime {
        if (File.defaultLocalFileTime == null)
            File.defaultLocalFileTime = new DateTime(1601, 1, 1).ToLocalTime();

        return File.defaultLocalFileTime.Value;
    }


    public static Encrypt(path: string): void {
        throw new NotSupportedException(Locale.GetText("File encryption isn't supported on any file system."));
    }

    public static Decrypt(path: string): void {
        throw new NotSupportedException(Locale.GetText("File encryption isn't supported on any file system."));
    }
}
