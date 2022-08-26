import { List } from "../Collections/Generic/List";
import { Environment } from "../Environment";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { NotSupportedException } from "../Exceptions/NotSupportedException";
import { New } from "../float";
import { foreach } from "../foreach";
import { Out } from "../Out";
import { DirectorySecurity } from "../security/AccessControl/DirectorySecurity";
import { SecurityManager } from "../security/SecurityManager";
import { DateTime } from "../Time/__DateTime";
import { DirectoryInfo } from "./DirectoryInfo";
import { DirectoryNotFoundException } from "./Exceptions/DirectoryNotFoundException";
import { FileAttributes } from "./FileAttributes";
import { IOException } from "./IOException";
import { MonoIO } from "./MonoIO";
import { MonoIOError } from "./MonoIOError";
import { Path } from "./Path";
import { SearchOption } from "./SearchOption";
import { SearchPattern } from "./SearchPattern";
import { File } from "./File";
import { AccessControlSections } from "../security/AccessControl/AccessControlSections";
import { is } from "../is";
import { ArgumentOutOfRangeException } from "../Exceptions";
import { TString } from '../Text/TString';
export class Directory {

	public static CreateDirectory(path: string): DirectoryInfo;
	public static CreateDirectory(...args: any[]): DirectoryInfo {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			if (path == null)
				throw new ArgumentNullException("path");

			if (path.length === 0)
				throw new ArgumentException("Path is empty");

			if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
				throw new ArgumentException("Path contains invalid chars");

			if (path.trim().length === 0)
				throw new ArgumentException("Only blank characters in path");

			// after validations but before File.Exists to avoid an oracle
			SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

			if (File.Exists(path))
				throw new IOException("Cannot create " + path + " because a file with the same name already exists.");

			// LAMESPEC: with .net 1.0 version this throw NotSupportedException and msdn says so too
			// but v1.1 throws ArgumentException.
			if (Environment.IsRunningOnWindows && path === ":")
				throw new ArgumentException("Only ':' In path");

			return Directory.CreateDirectoriesInternal(path);
		} else if (args.length === 2 && is.string(args[0])) {
			const path: string = args[0];
			const directorySecurity: DirectorySecurity = args[1];
			return Directory.CreateDirectory(path);
		}
		throw new ArgumentOutOfRangeException('');
	}

	private static CreateDirectoriesInternal(path: string): DirectoryInfo {
		/* #if!NET_2_1
				if (SecurityManager.SecurityEnabled) {
					new FileIOPermission(FileIOPermissionAccess.Read | FileIOPermissionAccess.Write, path).Demand();
				}
		#endif */
		const info: DirectoryInfo = new DirectoryInfo(path, true);
		if (info.Parent != null && !info.Parent.Exists)
			info.Parent.Create();

		let error: Out<MonoIOError> = New.Out();
		if (!MonoIO.CreateDirectory(path, error)) {
			// LAMESPEC: 1.1 and 1.2alpha allow CreateDirectory on a file path.
			// So CreateDirectory ("/tmp/somefile") will succeed if 'somefile' is
			// not a directory. However, 1.0 will throw an exception.
			// We behave like 1.0 here (emulating 1.1-like behavior is just a matter
			// of comparing error to ERROR_FILE_EXISTS, but it's lame to do:
			//    DirectoryInfo di = Directory.CreateDirectory (something);
			// and having di.Exists return false afterwards.
			// I hope we don't break anyone's code, as they should be catching
			// the exception anyway.
			if (error.value !== MonoIOError.ERROR_ALREADY_EXISTS && error.value !== MonoIOError.ERROR_FILE_EXISTS)
				throw MonoIO.GetException(path, error.value);
		}

		return info;
	}

	public static Delete(path: string): void;
	public static Delete(path: string, recursive: boolean): void;
	public static Delete(...args: any[]): void {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			Path.Validate(path);

			if (Environment.IsRunningOnWindows && path === ":")
				throw new NotSupportedException("Only ':' In path");

			SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

			let error: Out<MonoIOError> = New.Out();
			let success: boolean;

			if (MonoIO.ExistsSymlink(path, error)) {
				/* RemoveDirectory maps to rmdir()
				 * which fails on symlinks (ENOTDIR)
				 */
				success = MonoIO.DeleteFile(path, error);
			} else {
				success = MonoIO.RemoveDirectory(path, error);
			}

			if (!success) {
				/*
				 * FIXME:
				 * In io-layer/io.c rmdir returns error_file_not_found if directory does not exists.
				 * So maybe this could be handled somewhere else?
				 */
				if (error.value === MonoIOError.ERROR_FILE_NOT_FOUND) {
					if (File.Exists(path))
						throw new IOException("Directory does not exist, but a file of the same name exists.");
					else
						throw new DirectoryNotFoundException("Directory does not exist.");
				} else
					throw MonoIO.GetException(path, error.value);
			}
		} else if (args.length === 2 && is.string(args[0]) && is.boolean(args[1])) {
			const path: string = args[0];
			const recursive: boolean = args[1];
			Path.Validate(path);
			SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

			if (recursive) {
				Directory.RecursiveDelete(path);
			}
			else {
				Directory.Delete(path);
			}
		}
	}

	private static RecursiveDelete(path: string): void {
		const error: Out<MonoIOError> = New.Out();

		foreach(Directory.GetDirectories(path), (dir: string) => {
			if (MonoIO.ExistsSymlink(dir, error)) {
				MonoIO.DeleteFile(dir, error);
			} else {
				Directory.RecursiveDelete(dir);
			}
		});

		foreach(Directory.GetFiles(path), (file: string) => {
			File.Delete(file);
		});
		Directory.Delete(path);
	}



	public static Exists(path: string): boolean {
		if (path == null)
			return false;

		// on Moonlight this does not throw but returns false
		if (!SecurityManager.CheckElevatedPermissions())
			return false;

		const error: Out<MonoIOError> = New.Out();
		let exists: boolean;

		exists = MonoIO.ExistsDirectory(path, error);
		/* This should not throw exceptions */
		return exists;
	}

	public static GetLastAccessTime(path: string): DateTime {
		return File.GetLastAccessTime(path);
	}

	public static GetLastAccessTimeUtc(path: string): DateTime {
		return Directory.GetLastAccessTime(path).ToUniversalTime();
	}

	public static GetLastWriteTime(path: string): DateTime {
		return File.GetLastWriteTime(path);
	}

	public static GetLastWriteTimeUtc(path: string): DateTime {
		return Directory.GetLastWriteTime(path).ToUniversalTime();
	}

	public static GetCreationTime(path: string): DateTime {
		return File.GetCreationTime(path);
	}

	public static GetCreationTimeUtc(path: string): DateTime {
		return Directory.GetCreationTime(path).ToUniversalTime();
	}

	public static GetCurrentDirectory(): string {
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

		const result: string = Directory.InsecureGetCurrentDirectory();
		/* #if!NET_2_1
				if ((result != null) && (result.Length > 0) && SecurityManager.SecurityEnabled) {
					new FileIOPermission(FileIOPermissionAccess.PathDiscovery, result).Demand();
				}
		#endif */
		return result;
	}

	public /* internal */ static InsecureGetCurrentDirectory(): string {
		const error: Out<MonoIOError> = New.Out();
		const result: string = MonoIO.GetCurrentDirectory(error);

		if (error.value !== MonoIOError.ERROR_SUCCESS)
			throw MonoIO.GetException(error.value);

		return result;
	}

	public static GetDirectories(path: string): string[];
	public static GetDirectories(path: string, searchPattern: string): string[];
	public static GetDirectories(path: string, searchPattern: string, searchOption: SearchOption): string[];
	public static GetDirectories(...args: any[]): string[] {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			return Directory.GetDirectories(path, "*");
		} else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
			const path: string = args[0];
			const searchPattern: string = args[1];
			return Directory._GetFileSystemEntries(path, searchPattern, FileAttributes.Directory, FileAttributes.Directory);
		} else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.int(args[2])) {
			const path: string = args[0];
			const searchPattern: string = args[1];
			const searchOption: SearchOption = args[2];
			if (searchOption === SearchOption.TopDirectoryOnly)
				return Directory.GetDirectories(path, searchPattern);
			var all = new List<string>();
			Directory.GetDirectoriesRecurse(path, searchPattern, all);
			return all.ToArray();
		}
		throw new ArgumentOutOfRangeException('');
	}

	private static GetDirectoriesRecurse(path: string, searchPattern: string, all: List<string>): void {
		all.AddRange(Directory.GetDirectories(path, searchPattern));
		foreach(Directory.GetDirectories(path), (dir: string) => {
			Directory.GetDirectoriesRecurse(dir, searchPattern, all);
		});
	}

	public static GetDirectoryRoot(path: string): string {
		Path.Validate(path);
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

		// FIXME nice hack but that does not work under windows
		return String.fromCharCode(Path.DirectorySeparatorChar); // clone
	}

	public static GetFiles(path: string): string[];
	public static GetFiles(path: string, searchPattern: string): string[];
	public static GetFiles(path: string, searchPattern: string, searchOption: SearchOption): string[];
	public static GetFiles(...args: any[]): string[] {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			return Directory.GetFiles(path, "*");
		} else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
			const path: string = args[0];
			const searchPattern: string = args[1];
			return Directory._GetFileSystemEntries(path, searchPattern, FileAttributes.Directory, 0);
		} else if (args.length === 3 && is.string(args[0]) && is.string(args[1]) && is.int(args[2])) {
			const path: string = args[0];
			const searchPattern: string = args[1];
			const searchOption: SearchOption = args[2];
			if (searchOption === SearchOption.TopDirectoryOnly)
				return Directory.GetFiles(path, searchPattern);
			const all = new List<string>();
			Directory.GetFilesRecurse(path, searchPattern, all);
			return all.ToArray();
		}
		throw new ArgumentOutOfRangeException('');
	}

	private static GetFilesRecurse(path: string, searchPattern: string, all: List<string>): void {
		all.AddRange(Directory.GetFiles(path, searchPattern));
		foreach(Directory.GetDirectories(path), (dir: string) => {
			Directory.GetFilesRecurse(dir, searchPattern, all);
		});
	}

	public static GetFileSystemEntries(path: string): string[];
	public static GetFileSystemEntries(path: string, searchPattern: string): string[];
	public static GetFileSystemEntries(...args: any[]): string[] {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			return Directory.GetFileSystemEntries(path, "*");
		} else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
			const path: string = args[0];
			const searchPattern: string = args[1];
			return Directory._GetFileSystemEntries(path, searchPattern, 0, 0);
		}
		throw new ArgumentOutOfRangeException('');
	}


	public static GetLogicalDrives(): string[] {
		return Environment.GetLogicalDrives();
	}

	private static IsRootDirectory(path: string): boolean {
		// Unix
		if (Path.DirectorySeparatorChar === '/'.charCodeAt(0) && path === "/")
			return true;

		// Windows
		if (Path.DirectorySeparatorChar === '\\'.charCodeAt(0))
			if (path.length === 3 && path.endsWith(":\\"))
				return true;

		return false;
	}

	public static GetParent(path: string): DirectoryInfo {
		Path.Validate(path);

		// return null if the path is the root directory
		if (Directory.IsRootDirectory(path))
			return null as any;

		let parent_name: string = Path.GetDirectoryName(path);
		if (parent_name.length === 0)
			parent_name = Directory.GetCurrentDirectory();

		return new DirectoryInfo(parent_name);
	}

	public static Move(sourceDirName: string, destDirName: string): void {
		if (sourceDirName == null)
			throw new ArgumentNullException("sourceDirName");

		if (destDirName == null)
			throw new ArgumentNullException("destDirName");

		if (sourceDirName.trim().length === 0 || sourceDirName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Invalid source directory name: " + sourceDirName, "sourceDirName");

		if (destDirName.trim().length === 0 || destDirName.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Invalid target directory name: " + destDirName, "destDirName");

		if (sourceDirName == destDirName)
			throw new IOException("Source and destination path must be different.");

		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

		if (Directory.Exists(destDirName))
			throw new IOException(destDirName + " already exists.");

		if (!Directory.Exists(sourceDirName) && !File.Exists(sourceDirName))
			throw new DirectoryNotFoundException(sourceDirName + " does not exist");

		const error: Out<MonoIOError> = New.Out();
		if (!MonoIO.MoveFile(sourceDirName, destDirName, error))
			throw MonoIO.GetException(error.value);
	}

	public static SetAccessControl(path: string, directorySecurity: DirectorySecurity): void {
		if (null == directorySecurity)
			throw new ArgumentNullException("directorySecurity");

		directorySecurity.PersistModifications(path);
	}

	public static SetCreationTime(path: string, creationTime: DateTime): void {
		File.SetCreationTime(path, creationTime);
	}

	public static SetCreationTimeUtc(path: string, creationTimeUtc: DateTime): void {
		Directory.SetCreationTime(path, creationTimeUtc.ToLocalTime());
	}

	public static SetCurrentDirectory(path: string): void {
		if (path == null)
			throw new ArgumentNullException("path");
		if (path.trim().length === 0)
			throw new ArgumentException("path string must not be an empty string or whitespace string");

		const error: Out<MonoIOError> = New.Out();

		if (!Directory.Exists(path))
			throw new DirectoryNotFoundException("Directory \"" + path + "\" not found.");

		MonoIO.SetCurrentDirectory(path, error);
		if (error.value !== MonoIOError.ERROR_SUCCESS)
			throw MonoIO.GetException(path, error.value);
	}

	public static SetLastAccessTime(path: string, lastAccessTime: DateTime): void {
		File.SetLastAccessTime(path, lastAccessTime);
	}

	public static SetLastAccessTimeUtc(path: string, lastAccessTimeUtc: DateTime): void {
		Directory.SetLastAccessTime(path, lastAccessTimeUtc.ToLocalTime());
	}

	public static SetLastWriteTime(path: string, lastWriteTime: DateTime): void {
		File.SetLastWriteTime(path, lastWriteTime);
	}

	public static SetLastWriteTimeUtc(path: string, lastWriteTimeUtc: DateTime): void {
		Directory.SetLastWriteTime(path, lastWriteTimeUtc.ToLocalTime());
	}

	// private

	// Does the common validation, searchPattern has already been checked for not-null
	private static ValidateDirectoryListing(path: string, searchPattern: string, stop: Out<boolean>): string {
		Path.Validate(path);

		const wild: string = Path.Combine(path, searchPattern);
		const wildpath: string = Path.GetDirectoryName(wild);
		if (wildpath.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Pattern contains invalid characters", "pattern");

		const error: Out<MonoIOError> = New.Out();
		if (!MonoIO.ExistsDirectory(wildpath, error)) {
			if (error.value === MonoIOError.ERROR_SUCCESS) {
				const file_error: Out<MonoIOError> = New.Out();
				if (MonoIO.ExistsFile(wildpath, file_error))
					throw new IOException("The directory name is invalid.");
			}

			if (error.value !== MonoIOError.ERROR_PATH_NOT_FOUND)
				throw MonoIO.GetException(wildpath, error.value);

			if (wildpath.indexOfAny(SearchPattern.WildcardChars) === -1)
				throw new DirectoryNotFoundException("Directory '" + wildpath + "' not found.");

			if (path.indexOfAny(SearchPattern.WildcardChars) === -1)
				throw new ArgumentException("Pattern is invalid", "searchPattern");

			throw new ArgumentException("Path is invalid", "path");
		}

		stop.value = false;
		return wild;
	}

	private static _GetFileSystemEntries(path: string, searchPattern: string, mask: FileAttributes, attrs: FileAttributes): string[] {
		if (searchPattern == null)
			throw new ArgumentNullException("searchPattern");
		if (searchPattern.length === 0)
			return [];
		let stop: Out<boolean> = New.Out(false);
		const path_with_pattern: string = Directory.ValidateDirectoryListing(path, searchPattern, stop);
		if (stop) {
			return [path_with_pattern];
		}

		let error: Out<MonoIOError> = New.Out();
		const result: string[] = MonoIO.GetFileSystemEntries(path, path_with_pattern, attrs, mask, error);
		if (error.value !== 0)
			throw MonoIO.GetException(Path.GetDirectoryName(Path.Combine(path, searchPattern)), error.value);

		return result;
	}

	/* #if NET_4_0
	public static string[] GetFileSystemEntries(string path, string searchPattern, SearchOption searchOption) {
		// Take the simple way home:
		return new List<string>(EnumerateFileSystemEntries(path, searchPattern, searchOption)).ToArray();
	}

	static void EnumerateCheck(string path, string searchPattern, SearchOption searchOption) {
		if (searchPattern == null)
			throw new ArgumentNullException("searchPattern");

		if (searchPattern.Length == 0)
			return;

		if (searchOption != SearchOption.TopDirectoryOnly && searchOption != SearchOption.AllDirectories)
			throw new ArgumentOutOfRangeException("searchoption");

		Path.Validate(path);
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight
	}

	internal static IEnumerable<string> EnumerateKind(string path, string searchPattern, SearchOption searchOption, FileAttributes kind) {
		if (searchPattern.Length == 0)
			yield break;

		bool stop;
		string path_with_pattern = ValidateDirectoryListing(path, searchPattern, out stop);
		if (stop) {
			yield return path_with_pattern;
			yield break;
		}

		IntPtr handle;
		MonoIOError error;
		FileAttributes rattr;

		string s = MonoIO.FindFirst(path, path_with_pattern, out rattr, out error, out handle);
		try {
			while (s != null) {
				// Convert any file specific flag to FileAttributes.Normal which is used as include files flag
				if (((rattr & FileAttributes.Directory) == 0) && rattr != 0)
					rattr |= FileAttributes.Normal;

				if ((rattr & FileAttributes.ReparsePoint) == 0 && (rattr & kind) != 0)
					yield return s;

				s = MonoIO.FindNext(handle, out rattr, out error);
			}

			if (error != 0)
				throw MonoIO.GetException(Path.GetDirectoryName(Path.Combine(path, searchPattern)), (MonoIOError) error);
		} finally {
			if (handle != IntPtr.Zero)
				MonoIO.FindClose(handle);
		}

		if (searchOption == SearchOption.AllDirectories) {
			s = MonoIO.FindFirst(path, Path.Combine(path, "*"), out rattr, out error, out handle);

			try {
				while (s != null) {
					if ((rattr & FileAttributes.Directory) != 0)
						foreach(string child in EnumerateKind(s, searchPattern, searchOption, kind))
					yield return child;
					s = MonoIO.FindNext(handle, out rattr, out error);
				}

				if (error != 0)
					throw MonoIO.GetException(path, (MonoIOError) error);
			} finally {
				if (handle != IntPtr.Zero)
					MonoIO.FindClose(handle);
			}
		}
	}

	public static IEnumerable<string> EnumerateDirectories(string path, string searchPattern, SearchOption searchOption) {
		EnumerateCheck(path, searchPattern, searchOption);
		return EnumerateKind(path, searchPattern, searchOption, FileAttributes.Directory);
	}

	public static IEnumerable<string> EnumerateDirectories(string path, string searchPattern) {
		EnumerateCheck(path, searchPattern, SearchOption.TopDirectoryOnly);
		return EnumerateKind(path, searchPattern, SearchOption.TopDirectoryOnly, FileAttributes.Directory);
	}

	public static IEnumerable<string> EnumerateDirectories(string path) {
		Path.Validate(path); // no need for EnumerateCheck since we supply valid arguments
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight
		return EnumerateKind(path, "*", SearchOption.TopDirectoryOnly, FileAttributes.Directory);
	}

	public static IEnumerable<string> EnumerateFiles(string path, string searchPattern, SearchOption searchOption) {
		EnumerateCheck(path, searchPattern, searchOption);
		return EnumerateKind(path, searchPattern, searchOption, FileAttributes.Normal);
	}

	public static IEnumerable<string> EnumerateFiles(string path, string searchPattern) {
		EnumerateCheck(path, searchPattern, SearchOption.TopDirectoryOnly);
		return EnumerateKind(path, searchPattern, SearchOption.TopDirectoryOnly, FileAttributes.Normal);
	}

	public static IEnumerable<string> EnumerateFiles(string path) {
		Path.Validate(path); // no need for EnumerateCheck since we supply valid arguments
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight
		return EnumerateKind(path, "*", SearchOption.TopDirectoryOnly, FileAttributes.Normal);
	}

	public static IEnumerable<string> EnumerateFileSystemEntries(string path, string searchPattern, SearchOption searchOption) {
		EnumerateCheck(path, searchPattern, searchOption);
		return EnumerateKind(path, searchPattern, searchOption, FileAttributes.Normal | FileAttributes.Directory);
	}

	public static IEnumerable<string> EnumerateFileSystemEntries(string path, string searchPattern) {
		EnumerateCheck(path, searchPattern, SearchOption.TopDirectoryOnly);
		return EnumerateKind(path, searchPattern, SearchOption.TopDirectoryOnly, FileAttributes.Normal | FileAttributes.Directory);
	}

	public static IEnumerable<string> EnumerateFileSystemEntries(string path) {
		Path.Validate(path); // no need for EnumerateCheck since we supply valid arguments
		SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight
		return EnumerateKind(path, "*", SearchOption.TopDirectoryOnly, FileAttributes.Normal | FileAttributes.Directory);
	}

	#endif */

	public static GetAccessControl(path: string): DirectorySecurity;
	public static GetAccessControl(path: string, includeSections: AccessControlSections): DirectorySecurity;
	public static GetAccessControl(...args: any[]): DirectorySecurity {
		if (args.length === 1 && is.string(args[0])) {
			const path: string = args[0];
			// AccessControlSections.Audit requires special permissions.
			return Directory.GetAccessControl(path, AccessControlSections.Owner | AccessControlSections.Group | AccessControlSections.Access);
		} else if (args.length === 2) {
			const path: string = args[0];
			const includeSections: AccessControlSections = args[1];
			return new DirectorySecurity(path, includeSections);
		}
		throw new ArgumentOutOfRangeException('');
	}


}