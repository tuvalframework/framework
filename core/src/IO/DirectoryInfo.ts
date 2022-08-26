import { ArrayList } from "../Collections/ArrayList";
import { List } from "../Collections/Generic/List";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../Exceptions/ArgumentOutOfRangeException";
import { TArray } from "../Extensions/TArray";
import { TChar } from "../Extensions/TChar";
import { int, New } from '../float';
import { foreach } from "../foreach";
import { Internal, Override } from "../Reflection/Decorators/ClassInfo";
import { Directory } from "./Directory";
import { FileAttributes } from "./FileAttributes";
import { FileSystemInfo } from "./FileSystemInfo";
import { IOException } from "./IOException";
import { Path } from "./Path";
import { SearchOption } from "./SearchOption";
import { TString } from '../Text/TString';
import { UnauthorizedAccessException } from "../Exceptions/UnauthorizedAccessException";
import { SecurityManager } from "../security/SecurityManager";
import { MonoIO } from "./MonoIO";
import { FileInfo } from "./FileInfo";
import { DirectorySecurity } from "../security/AccessControl/DirectorySecurity";
import { is } from "../is";
import { AccessControlSections } from "../security/AccessControl/AccessControlSections";

export class DirectoryInfo extends FileSystemInfo {
    protected dispose(disposing: boolean): void {
        throw new Error("Method not implemented.");
    }

    private current: string = '';
    private parent: string = '';

    /* public DirectoryInfo (string path) : this (path, false)
    {
    } */

    public /* internal */ constructor(path: string, simpleOriginalPath: boolean = false) {
        super();
        this.CheckPath(path);

        SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

        this.FullPath = Path.GetFullPath(path);
        if (simpleOriginalPath)
            this.OriginalPath = Path.GetFileName(path);
        else
            this.OriginalPath = path;

        this.Initialize();
    }

    /*  private DirectoryInfo(SerializationInfo info, StreamingContext context)
         : base (info, context)
     {
             Initialize();
         } */

    private Initialize(): void {
        let len: int = this.FullPath.length - 1;
        if ((len > 1) && (this.FullPath[len].charCodeAt(0) === Path.DirectorySeparatorChar))
            len--;
        const last: int = this.FullPath.lastIndexOf(String.fromCharCode(Path.DirectorySeparatorChar), len);
        if ((last == -1) || ((last == 0) && (len == 0))) {
            this.current = this.FullPath;
            this.parent = null as any;
        } else {
            this.current = this.FullPath.substr(last + 1, len - last);
            if (last == 0 && !Environment.IsRunningOnWindows)
                this.parent = String.fromCharCode(Path.DirectorySeparatorChar);
            else
                this.parent = this.FullPath.substr(0, last);
            // adjust for drives, i.e. a special case for windows
            if (Environment.IsRunningOnWindows) {
                if ((this.parent.length == 2) && (this.parent[1] === ':') && TChar.IsLetter(this.parent[0].charCodeAt(0)))
                    this.parent += Path.DirectorySeparatorChar;
            }
        }
    }

    // properties

    @Override
    protected Get_Exists(): boolean {
        this.Refresh(false);

        if (this.stat.Attributes === MonoIO.InvalidFileAttributes)
            return false;

        if ((this.stat.Attributes & FileAttributes.Directory) === 0)
            return false;

        return true;
    }


    @Override
    public Get_Name(): string {
        return this.current;
    }

    public get Parent(): DirectoryInfo {
        if ((this.parent == null) || (this.parent.length === 0))
            return null as any;
        return new DirectoryInfo(this.parent);
    }

    public get Root(): DirectoryInfo {
        const root: string = Path.GetPathRoot(this.FullPath);
        if (root == null)
            return null as any;

        return new DirectoryInfo(root);
    }

    // creational methods

    public Create(): void;
    public Create(directorySecurity: DirectorySecurity): void;
    public Create(...args: any[]): void {
        if (args.length === 0) {
            Directory.CreateDirectory(this.FullPath);
        } else if (args.length === 1) {
            const directorySecurity: DirectorySecurity = args[0];
            if (directorySecurity != null)
                throw new UnauthorizedAccessException('');
            this.Create();
        }
    }


    public CreateSubdirectory(path: string): DirectoryInfo;
    public CreateSubdirectory(path: string, directorySecurity: DirectorySecurity): DirectoryInfo;
    public CreateSubdirectory(...args: any[]): DirectoryInfo {
        if (args.length === 1 && is.string(args[0])) {
            let path: string = args[0];
            this.CheckPath(path);

            path = Path.Combine(this.FullPath, path);
            Directory.CreateDirectory(path);
            return new DirectoryInfo(path);
        } else if (args.length === 2) {
            const path: string = args[0];
            const directorySecurity: DirectorySecurity = args[1];
            if (directorySecurity != null)
                throw new UnauthorizedAccessException('');
            return this.CreateSubdirectory(path);
        }
        throw new ArgumentOutOfRangeException('');
    }


    // directory listing methods





    public GetDirectories(): DirectoryInfo[];
    public GetDirectories(searchPattern: string): DirectoryInfo[];
    public GetDirectories(searchPattern: string, searchOption: SearchOption): DirectoryInfo[];
    public GetDirectories(...args: any[]): DirectoryInfo[] {
        if (args.length === 0) {
            return this.GetDirectories("*");
        } else if (args.length === 1 && is.string(args[0])) {
            const searchPattern: string = args[0];
            if (searchPattern == null)
                throw new ArgumentNullException("searchPattern");

            const names: string[] = Directory.GetDirectories(this.FullPath, searchPattern);

            const infos: DirectoryInfo[] = New.Array(names.length);
            let i: int = 0;
            foreach(names, (name: string) => {
                infos[i++] = new DirectoryInfo(name);
            });
            return infos;
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const searchPattern: string = args[0];
            const searchOption: SearchOption = args[1];
            //NULL-check of searchPattern is done in Directory.GetDirectories
            const names: string[] = Directory.GetDirectories(this.FullPath, searchPattern, searchOption);
            //Convert the names to DirectoryInfo instances
            const infos: DirectoryInfo[] = New.Array(names.length);
            for (let i: int = 0; i < names.length; ++i) {
                const name: string = names[i];
                infos[i] = new DirectoryInfo(name);
            }
            return infos;
        }
        throw new ArgumentOutOfRangeException('');
    }


    public GetFileSystemInfos(): FileSystemInfo[];
    public GetFileSystemInfos(searchPattern: string): FileSystemInfo[];
    public GetFileSystemInfos(searchPattern: string, searchOption: SearchOption): FileSystemInfo[];
    public GetFileSystemInfos(...args: any[]): FileSystemInfo[] {
        if (args.length === 0) {
            return this.GetFileSystemInfos("*");
        } else if (args.length === 1 && is.string(args[0])) {
            const searchPattern: string = args[0];
            return this.GetFileSystemInfos(searchPattern, SearchOption.TopDirectoryOnly);
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const searchPattern: string = args[0];
            const searchOption: SearchOption = args[1];
            if (searchPattern == null)
                throw new ArgumentNullException("searchPattern");
            if (searchOption !== SearchOption.TopDirectoryOnly && searchOption !== SearchOption.AllDirectories)
                throw new ArgumentOutOfRangeException("searchOption", "Must be TopDirectoryOnly or AllDirectories");
            if (!Directory.Exists(this.FullPath))
                throw new IOException("Invalid directory");

            const infos: List<FileSystemInfo> = new List<FileSystemInfo>();
            this.InternalGetFileSystemInfos(searchPattern, searchOption, infos);
            return infos.ToArray();
        }
        throw new ArgumentOutOfRangeException('');
    }



    private InternalGetFileSystemInfos(searchPattern: string, searchOption: SearchOption, infos: List<FileSystemInfo>): void {
        // UnauthorizedAccessExceptions might happen here and break everything for SearchOption.AllDirectories
        const dirs: string[] = Directory.GetDirectories(this.FullPath, searchPattern);
        const files: string[] = Directory.GetFiles(this.FullPath, searchPattern);

        TArray.ForEach<string>(dirs, (dir) => { infos.Add(new DirectoryInfo(dir)); });
        TArray.ForEach<string>(files, (file) => { infos.Add(new FileInfo(file)); });
        if (dirs.length === 0 || searchOption === SearchOption.TopDirectoryOnly)
            return;

        foreach(dirs, (dir: string) => {
            const dinfo: DirectoryInfo = new DirectoryInfo(dir);
            dinfo.InternalGetFileSystemInfos(searchPattern, searchOption, infos);
        });
    }

    // directory management methods

    //@Override
    public Delete(): void;
    public Delete(recursive: boolean): void;
    public Delete(...args: any[]): void {
        if (args.length === 0) {
            this.Delete(false);
        } else if (args.length === 1 && is.boolean(args[0])) {
            const recursive: boolean = args[0];
            Directory.Delete(this.FullPath, recursive);
        }
    }

    public MoveTo(destDirName: string): void {
        if (destDirName == null)
            throw new ArgumentNullException("destDirName");
        if (destDirName.length == 0)
            throw new ArgumentException("An empty file name is not valid.", "destDirName");

        Directory.Move(this.FullPath, Path.GetFullPath(destDirName));
        this.FullPath = this.OriginalPath = destDirName;
        this.Initialize();
    }

    @Override
    public ToString(): string {
        return this.OriginalPath;
    }



    @Internal
    public GetFilesSubdirs(l: ArrayList, pattern: string): int {
        let count: int;
        let thisdir: FileInfo[] = null as any;

        try {
            thisdir = this.GetFiles(pattern);
        } catch (e) {
            return 0;
        }

        count = thisdir.length;
        l.Add(thisdir);

        foreach(this.GetDirectories(), (subdir: DirectoryInfo) => {
            count += subdir.GetFilesSubdirs(l, pattern);
        });
        return count;
    }

    public GetFiles(): FileInfo[];
    public GetFiles(searchPattern: string): FileInfo[];
    public GetFiles(searchPattern: string, searchOption: SearchOption): FileInfo[];
    public GetFiles(...args: any[]): FileInfo[] {
        if (args.length === 0) {
            return this.GetFiles("*");
        } else if (args.length === 1 && is.string(args[0])) {
            const searchPattern: string = args[0];
            if (searchPattern == null)
                throw new ArgumentNullException("searchPattern");

            const names: string[] = Directory.GetFiles(this.FullPath, searchPattern);

            const infos: FileInfo[] = New.Array(names.length);
            let i: int = 0;
            foreach(names, (name: string) => {
                infos[i++] = new FileInfo(name);
            });
            return infos;
        } else if (args.length === 2 && is.string(args[0]) && is.int(args[1])) {
            const searchPattern: string = args[0];
            const searchOption: SearchOption = args[1];
            switch (searchOption) {
                case SearchOption.TopDirectoryOnly:
                    return this.GetFiles(searchPattern);
                case SearchOption.AllDirectories: {
                    const groups: ArrayList = new ArrayList();
                    const count: int = this.GetFilesSubdirs(groups, searchPattern);
                    let current: int = 0;

                    const all: FileInfo[] = New.Array(count);
                    foreach(groups, (p: FileInfo[]) => {
                        TArray.Copy(p, all, current);
                        current += p.length;
                    });
                    return all;
                }
                default:
                    const msg: string = TString.Format("Invalid enum value '{0}' for '{1}'.", searchOption, "SearchOption");
                    throw new ArgumentOutOfRangeException("searchOption", msg);
            }
        }
        throw new ArgumentOutOfRangeException('');
    }

    public GetAccessControl(): DirectorySecurity;
    public GetAccessControl(includeSections: AccessControlSections): DirectorySecurity;
    public GetAccessControl(...args: any[]): DirectorySecurity {
        if (args.length === 0) {
            return Directory.GetAccessControl(this.FullPath);
        } else if (args.length === 1) {
            const includeSections: AccessControlSections = args[0];
            return Directory.GetAccessControl(this.FullPath, includeSections);
        }
        throw new ArgumentOutOfRangeException('');
    }



    public SetAccessControl(directorySecurity: DirectorySecurity): void {
        Directory.SetAccessControl(this.FullPath, directorySecurity);
    }
    /* #if NET_4_0

    public IEnumerable<DirectoryInfo> EnumerateDirectories() {
        return EnumerateDirectories("*", SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<DirectoryInfo> EnumerateDirectories(string searchPattern) {
        return EnumerateDirectories(searchPattern, SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<DirectoryInfo> EnumerateDirectories(string searchPattern, SearchOption searchOption) {
        if (searchPattern == null)
            throw new ArgumentNullException("searchPattern");

        return CreateEnumerateDirectoriesIterator(searchPattern, searchOption);
    }

    IEnumerable<DirectoryInfo> CreateEnumerateDirectoriesIterator(string searchPattern, SearchOption searchOption) {
        foreach(string name in Directory.EnumerateDirectories(FullPath, searchPattern, searchOption))
        yield return new DirectoryInfo(name);
    }

    public IEnumerable<FileInfo> EnumerateFiles() {
        return EnumerateFiles("*", SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<FileInfo> EnumerateFiles(string searchPattern) {
        return EnumerateFiles(searchPattern, SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<FileInfo> EnumerateFiles(string searchPattern, SearchOption searchOption) {
        if (searchPattern == null)
            throw new ArgumentNullException("searchPattern");

        return CreateEnumerateFilesIterator(searchPattern, searchOption);
    }

    IEnumerable<FileInfo> CreateEnumerateFilesIterator(string searchPattern, SearchOption searchOption) {
        foreach(string name in Directory.EnumerateFiles(FullPath, searchPattern, searchOption))
        yield return new FileInfo(name);
    }

    public IEnumerable<FileSystemInfo> EnumerateFileSystemInfos() {
        return EnumerateFileSystemInfos("*", SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<FileSystemInfo> EnumerateFileSystemInfos(string searchPattern) {
        return EnumerateFileSystemInfos(searchPattern, SearchOption.TopDirectoryOnly);
    }

    public IEnumerable<FileSystemInfo> EnumerateFileSystemInfos(string searchPattern, SearchOption searchOption) {
        if (searchPattern == null)
            throw new ArgumentNullException("searchPattern");
        if (searchOption != SearchOption.TopDirectoryOnly && searchOption != SearchOption.AllDirectories)
            throw new ArgumentOutOfRangeException("searchoption");

        return EnumerateFileSystemInfos(FullPath, searchPattern, searchOption);
    }

    static internal IEnumerable<FileSystemInfo> EnumerateFileSystemInfos(string full, string searchPattern, SearchOption searchOption) {
        string path_with_pattern = Path.Combine(full, searchPattern);
        IntPtr handle;
        MonoIOError error;
        FileAttributes rattr;
        bool subdirs = searchOption == SearchOption.AllDirectories;

        Path.Validate(full);

        string s = MonoIO.FindFirst(full, path_with_pattern, out rattr, out error, out handle);
        if (s == null)
            yield break;
        if (error != 0)
            throw MonoIO.GetException(Path.GetDirectoryName(path_with_pattern), (MonoIOError) error);

        try {
            if (((rattr & FileAttributes.ReparsePoint) == 0)) {
                if ((rattr & FileAttributes.Directory) != 0)
                    yield return new DirectoryInfo(s);
                else
                yield return new FileInfo(s);
        }

        while ((s = MonoIO.FindNext(handle, out rattr, out error)) != null) {
            if ((rattr & FileAttributes.ReparsePoint) != 0)
                continue;
            if ((rattr & FileAttributes.Directory) != 0)
                yield return new DirectoryInfo(s);
                else
            yield return new FileInfo(s);

if (((rattr & FileAttributes.Directory) != 0) && subdirs)
    foreach(FileSystemInfo child in EnumerateFileSystemInfos(s, searchPattern, searchOption))
yield return child;
        }
    } finally {
    MonoIO.FindClose(handle);
}
}


#endif */
}