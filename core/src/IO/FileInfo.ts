import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException";
import { int, New } from "../float";
import { Locale } from "../Locale";
import { Out } from "../Out";
import { Internal, Override } from "../Reflection/Decorators/ClassInfo";
import { DirectoryInfo } from "./DirectoryInfo";
import { FileNotFoundException } from "./Exceptions/FileNotFoundException";
import { FileAccess } from "./FileAccess";
import { FileAttributes } from "./FileAttributes";
import { FileMode } from "./FileMode";
import { FileShare } from "./FileShare";
import { FileStream } from "./FileStream";
import { FileSystemInfo } from "./FileSystemInfo";
import { Path } from "./Path";
import { StreamReader } from "./StreamReader";
import { StreamWriter } from "./StreamWriter";
import { File } from "./File";
import { MonoIOError } from "./MonoIOError";
import { SecurityManager } from "../security/SecurityManager";
import { MonoIO } from "./MonoIO";
import { FileSecurity } from "./FileSecurity";
import { AccessControlSections } from "../security/AccessControl/AccessControlSections";
import { is } from "../is";
import { ArgumentOutOfRangeException } from "../Exceptions";

export class FileInfo extends FileSystemInfo {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }
    private exists: boolean = false;

    public constructor(fileName: string) {
        super();
        if (fileName == null)
            throw new ArgumentNullException("fileName");

        this.CheckPath(fileName);
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        this.OriginalPath = fileName;
        this.FullPath = Path.GetFullPath(fileName);
    }


    @Internal
    @Override
    public InternalRefresh(): void {
        this.exists = File.Exists(this.FullPath);
    }

    // public properties

    @Override
    protected Get_Exists(): boolean {
        this.Refresh(false);

        if (this.stat.Attributes === MonoIO.InvalidFileAttributes)
            return false;

        if ((this.stat.Attributes & FileAttributes.Directory) != 0)
            return false;

        return this.exists;
    }

    protected Get_Name(): string {
        return Path.GetFileName(this.FullPath);
    }

    public get IsReadOnly(): boolean {
        if (!this.Exists)
            throw new FileNotFoundException("Could not find file \"" + this.OriginalPath + "\".", this.OriginalPath);

        return ((this.stat.Attributes & FileAttributes.ReadOnly) !== 0);
    }

    public set IsReadOnly(value: boolean) {
        if (!this.Exists)
            throw new FileNotFoundException("Could not find file \"" + this.OriginalPath + "\".", this.OriginalPath);

        let attrs: FileAttributes = File.GetAttributes(this.FullPath);

        if (value)
            attrs |= FileAttributes.ReadOnly;
        else
            attrs &= ~FileAttributes.ReadOnly;

        File.SetAttributes(this.FullPath, attrs);
    }

    public Encrypt(): void {
        // otherwise it throws a NotSupportedException (or a PlatformNotSupportedException on older OS).
        // we throw the same (instead of a NotImplementedException) because most code should already be
        // handling this exception to work properly.
        throw new NotSupportedException(("File encryption isn't supported on any file system."));
    }

    public Decrypt(): void {
        // MS.NET support this only on NTFS file systems, i.e. it's a file-system (not a framework) feature.
        // otherwise it throws a NotSupportedException (or a PlatformNotSupportedException on older OS).
        // we throw the same (instead of a NotImplementedException) because most code should already be
        // handling this exception to work properly.
        throw new NotSupportedException(Locale.GetText("File encryption isn't supported on any file system."));
    }

    public get Length(): int {
        if (!this.Exists)
            throw new FileNotFoundException("Could not find file \"" + this.OriginalPath + "\".", this.OriginalPath);

        return this.stat.Length.toNumber();
    }

    public get DirectoryName(): string {
        return Path.GetDirectoryName(this.FullPath);
    }

    public get Directory(): DirectoryInfo {
        return new DirectoryInfo(this.DirectoryName);
    }

    // streamreader methods

    public OpenText(): StreamReader {
        return new StreamReader(this.Open(FileMode.Open, FileAccess.Read));
    }

    public CreateText(): StreamWriter {
        return new StreamWriter(this.Open(FileMode.Create, FileAccess.Write));
    }

    public AppendText(): StreamWriter {
        return new StreamWriter(this.Open(FileMode.Append, FileAccess.Write));
    }

    // filestream methods

    public Create(): FileStream {
        return File.Create(this.FullPath);
    }

    public OpenRead(): FileStream {
        return this.Open(FileMode.Open, FileAccess.Read, FileShare.Read);
    }

    public OpenWrite(): FileStream {
        return this.Open(FileMode.OpenOrCreate, FileAccess.Write);
    }

    public Open(mode: FileMode): FileStream;
    public Open(mode: FileMode, access: FileAccess): FileStream;
    public Open(mode: FileMode, access: FileAccess, share: FileShare): FileStream;
    public Open(...args: any[]): FileStream {
        if (args.length === 1 && is.int(args[0])) {
            const mode: FileMode = args[0];
            return this.Open(mode, FileAccess.ReadWrite);
        } else if (args.length === 2 && is.int(args[0]) && is.int(args[1])) {
            const mode: FileMode = args[0];
            const access: FileAccess = args[1];
            return this.Open(mode, access, FileShare.None);
        } else if (args.length === 3 && is.int(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const mode: FileMode = args[0];
            const access: FileAccess = args[1];
            const share: FileShare = args[2];
            return new FileStream(this.FullPath, mode, access, share);
        }
        throw new ArgumentOutOfRangeException('');
    }

    // file methods

    @Override
    public Delete(): void {
        let error: Out<MonoIOError> = New.Out();

        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        if (!MonoIO.Exists(this.FullPath, error))
            return;

        if (MonoIO.ExistsDirectory(this.FullPath, error))
            throw new UnauthorizedAccessException("Access to the path \"" + this.FullPath + "\" is denied.");
        if (!MonoIO.DeleteFile(this.FullPath, error))
            throw MonoIO.GetException(this.OriginalPath, error.value);
    }

    public MoveTo(destFileName: string): void {
        if (destFileName == null)
            throw new ArgumentNullException("destFileName");
        if (destFileName === this.Name || destFileName === this.FullName)
            return;
        if (!File.Exists(this.FullPath))
            throw new FileNotFoundException();

        File.Move(this.FullPath, destFileName);
        this.FullPath = Path.GetFullPath(destFileName);
    }

    public CopyTo(destFileName: string): FileInfo;
    public CopyTo(destFileName: string, overwrite: boolean): FileInfo;
    public CopyTo(...args: any[]): FileInfo {
        if (args.length === 1 && is.string(args[0])) {
            const destFileName: string = args[0];
            return this.CopyTo(destFileName, false);
        } else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
            const destFileName: string = args[0];
            const overwrite: boolean = args[1];
            if (destFileName == null)
                throw new ArgumentNullException("destFileName");
            if (destFileName.length === 0)
                throw new ArgumentException("An empty file name is not valid.", "destFileName");

            const dest: string = Path.GetFullPath(destFileName);

            if (overwrite && File.Exists(dest))
                File.Delete(dest);

            File.Copy(this.FullPath, dest);

            return new FileInfo(dest);
        }
        throw new ArgumentOutOfRangeException('');
    }


    @Override
    public ToString(): string {
        return this.OriginalPath;
    }

    public GetAccessControl(): FileSecurity;
    public GetAccessControl(includeSections: AccessControlSections): FileSecurity;
    public GetAccessControl(...args: any[]): FileSecurity {
        if (args.length === 0) {
            return File.GetAccessControl(this.FullPath);
        } else if (args.length === 1) {
            const includeSections: AccessControlSections = args[0];
            return File.GetAccessControl(this.FullPath, includeSections);
        }
        throw new ArgumentOutOfRangeException('');
    }

    public Replace(destinationFileName: string, destinationBackupFileName: string): FileInfo;
    public Replace(destinationFileName: string, destinationBackupFileName: string, ignoreMetadataErrors: boolean): FileInfo;
    public Replace(...args: any[]): FileInfo {
        if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const destinationFileName: string = args[0];
            const destinationBackupFileName: string = args[1];
            let destinationFullPath: string = null as any;
            if (!this.Exists)
                throw new FileNotFoundException();
            if (destinationFileName == null)
                throw new ArgumentNullException("destinationFileName");
            if (destinationFileName.length == 0)
                throw new ArgumentException("An empty file name is not valid.", "destinationFileName");

            destinationFullPath = Path.GetFullPath(destinationFileName);

            if (!File.Exists(destinationFullPath))
                throw new FileNotFoundException();

            const attrs: FileAttributes = File.GetAttributes(destinationFullPath);

            if ((attrs & FileAttributes.ReadOnly) == FileAttributes.ReadOnly)
                throw new UnauthorizedAccessException('');

            if (destinationBackupFileName != null) {
                if (destinationBackupFileName.length === 0)
                    throw new ArgumentException("An empty file name is not valid.", "destinationBackupFileName");
                File.Copy(destinationFullPath, Path.GetFullPath(destinationBackupFileName), true);
            }
            File.Copy(this.FullPath, destinationFullPath, true);
            File.Delete(this.FullPath);
            return new FileInfo(destinationFullPath);
        } else if (args.length === 3  && is.string(args[0]) && is.string(args[1]) && is.boolean(args[2])) {
            const destinationFileName: string = args[0];
            const destinationBackupFileName: string = args[1];
            const ignoreMetadataErrors: boolean = args[2];
            return this.Replace(destinationFileName, destinationBackupFileName);
        }
        throw new ArgumentOutOfRangeException('');
    }


    public SetAccessControl(fileSecurity: FileSecurity): void {
        File.SetAccessControl(this.FullPath, fileSecurity);
    }
}