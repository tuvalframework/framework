import { TObject } from "../Extensions/TObject"
import { Internal, Virtual } from "../Reflection/Decorators/ClassInfo";
import { FileAttributes } from "./FileAttributes";
import { New, long, int } from '../float';
import { Out } from '../Out';
import { DateTime } from "../Time/__DateTime";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { TString } from '../Text/TString';
import { Path } from "./Path";
import { Environment } from "../Environment";
import { MonoIOStat } from "./MonoIOStat";
import { MonoIOError } from "./MonoIOError";
import { MonoIO } from "./MonoIO";
import { SecurityManager } from "../security/SecurityManager";
import { bigInt } from "../Math/BigNumber";

export abstract class FileSystemInfo extends TObject {

    protected FullPath: string = '';
    protected OriginalPath: string = '';
    public /* internal */  stat: MonoIOStat = null as any;
    public /* internal */  valid: boolean;
    /*   @Virtual
      public  void GetObjectData (SerializationInfo info, StreamingContext context)
      {
          info.AddValue ("OriginalPath", OriginalPath, typeof(string));
          info.AddValue ("FullPath", FullPath, typeof(string));
      } */

    // public properties

    protected abstract Get_Exists(): boolean;
    public get Exists(): boolean {
        return this.Get_Exists();
    }

    protected abstract Get_Name(): string;
    public get Name(): string {
        return this.Get_Name();
    }

    @Virtual
    protected Get_FullName(): string {
        return this.FullPath;
    }
    public get FullName(): string {
        return this.Get_FullName();
    }

    public get Extension(): string {
        return Path.GetExtension(this.Name);
    }

    public get Attributes(): FileAttributes {
        this.Refresh(false);
        return this.stat.Attributes;
    }

    public set Attributes(value: FileAttributes) {
        let error: Out<MonoIOError> = New.Out();

        if (!MonoIO.SetFileAttributes(this.FullName, value, error))
            throw MonoIO.GetException(this.FullName, error.value);
        this.Refresh(true);
    }


    public get CreationTime(): DateTime {
        this.Refresh(false);
        return DateTime.FromFileTime(this.stat.CreationTime);
    }

    public set CreationTime(value: DateTime) {
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const filetime: long = value.ToFileTime();

        let error: Out<MonoIOError> = New.Out();

        if (!MonoIO.SetFileTime(this.FullName, filetime, bigInt(-1), bigInt(-1), error))
            throw MonoIO.GetException(this.FullName, error.value);
        this.Refresh(true);
    }

    public get CreationTimeUtc(): DateTime {
        return this.CreationTime.ToUniversalTime();
    }

    public set CreationTimeUtc(value: DateTime) {
        this.CreationTime = value.ToLocalTime();
    }

    public get LastAccessTime(): DateTime {
        this.Refresh(false);
        return DateTime.FromFileTime(this.stat.LastAccessTime);
    }

    public set LastAccessTime(value: DateTime) {
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const filetime: long = value.ToFileTime();

        const error: Out<MonoIOError> = New.Out();

        if (!MonoIO.SetFileTime(this.FullName, bigInt(-1), filetime, bigInt(-1), error))
            throw MonoIO.GetException(this.FullName, error.value);
        this.Refresh(true);
    }

    public get LastAccessTimeUtc(): DateTime {
        this.Refresh(false);
        return this.LastAccessTime.ToUniversalTime();
    }

    public set LastAccessTimeUtc(value: DateTime) {
        this.LastAccessTime = value.ToLocalTime();
    }

    public get LastWriteTime(): DateTime {
        this.Refresh(false);
        return DateTime.FromFileTime(this.stat.LastWriteTime);
    }

    public set LastWriteTime(value: DateTime) {
        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        const filetime: long = value.ToFileTime();

        const error: Out<MonoIOError> = New.Out();

        if (!MonoIO.SetFileTime(this.FullName, bigInt(-1), bigInt(-1), filetime, error))
            throw MonoIO.GetException(this.FullName, error.value);
        this.Refresh(true);
    }


    public get LastWriteTimeUtc(): DateTime {
        this.Refresh(false);
        return this.LastWriteTime.ToUniversalTime();
    }

    public set LastWriteTimeUtc(value: DateTime) {
        this.LastWriteTime = value.ToLocalTime();
    }

    // public methods

    public abstract Delete(): void;

    /*  public Refresh(): void {
         Refresh(true);
     } */

    @Internal
    public Refresh(force: boolean = true): void {
        if (this.valid && !force)
            return;

        const error: Out<MonoIOError> = New.Out();
        const _stat = New.Out(this.stat);
        MonoIO.GetFileStat(this.FullName, _stat, error);
        this.stat = _stat.value;
        /* Don't throw on error here, too much other
         * stuff relies on it not doing so...
         */

        this.valid = true;

        this.InternalRefresh();
    }

    // protected

    protected constructor() {
        super()
        this.valid = false;
        this.FullPath = null as any;
    }




    // internal


    @Internal
    @Virtual
    public InternalRefresh(): void {
    }

    @Internal
    public CheckPath(path: string): void {
        if (path == null)
            throw new ArgumentNullException("path");
        if (path.length === 0)
            throw new ArgumentException("An empty file name is not valid.");
        if (TString.IndexOfAny(path, TString.FromCharArrayToStringArray(Path.InvalidPathChars), 0) !== -1)
            throw new ArgumentException("Illegal characters in path.");
        if (Environment.IsRunningOnWindows) {
            const idx: int = path.indexOf(':');
            if (idx >= 0 && idx != 1)
                throw new ArgumentException("path");
        }
    }
}