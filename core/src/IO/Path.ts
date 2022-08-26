import { Environment } from '../Environment';
import { ArgumentException } from '../Exceptions/ArgumentException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { TChar } from '../Extensions/TChar';
import { char, CharArray, int, New, ByteArray } from '../float';
import { Locale } from '../Locale';
import { Random } from '../Random';
import { TString } from '../Text/TString';
import { Directory } from './Directory';
import { FileStream } from './FileStream';
import { MonoIO } from './MonoIO';
import { TNumber } from '../Math/TNumber';
import { FileMode } from './FileMode';
import { FileAccess } from './FileAccess';
import { FileShare } from './FileShare';
import { FileOptions } from './FileOptions';
import { StringBuilder } from '../Text/StringBuilder';
import { RandomNumberGenerator } from '../Cryptography/RandomNumberGenerator';
import { Convert } from '../convert';
import { foreach } from '../foreach';


export class Path {
	public static readonly InvalidPathChars: CharArray;
	public static readonly AltDirectorySeparatorChar: char;
	public static readonly DirectorySeparatorChar: char;
	public static readonly PathSeparator: char;
	public /* internal */ static readonly DirectorySeparatorStr: string;
	public static readonly VolumeSeparatorChar: char;

	public /* internal */ static readonly PathSeparatorChars: CharArray;
	private static readonly dirEqualsVolume: boolean = false;

	// class methods
	public static ChangeExtension(path: string, extension: string): string {
		if (path == null)
			return null as any;

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		const iExt: int = Path.findExtension(path);

		if (extension == null)
			return iExt < 0 ? path : path.substr(0, iExt);
		else if (extension.length === 0)
			return iExt < 0 ? path + '.' : path.substr(0, iExt + 1);

		else if (path.length != 0) {
			if (extension.length > 0 && extension[0] !== '.')
				extension = "." + extension;
		} else
			extension = String.Empty;

		if (iExt < 0) {
			return path + extension;
		} else if (iExt > 0) {
			const temp: string = path.substr(0, iExt);
			return temp + extension;
		}

		return extension;
	}

	/* public static Combine(path1: string, path2: string): string {
		if (path1 == null)
			throw new ArgumentNullException("path1");

		if (path2 == null)
			throw new ArgumentNullException("path2");

		if (path1.length == 0)
			return path2;

		if (path2.length == 0)
			return path1;

		if (path1.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		if (path2.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		//TODO???: UNC names
		if (Path.IsPathRooted(path2))
			return path2;

		const p1end: char = path1[path1.length - 1].charCodeAt(0);
		if (p1end !== Path.DirectorySeparatorChar && p1end !== Path.AltDirectorySeparatorChar && p1end !== Path.VolumeSeparatorChar)
			return path1 + Path.DirectorySeparatorStr + path2;

		return path1 + path2;
	} */

	//
	// This routine:
	//   * Removes duplicat path separators from a string
	//   * If the string starts with \\, preserves the first two (hostname on Windows)
	//   * Removes the trailing path separator.
	//   * Returns the DirectorySeparatorChar for the single input DirectorySeparatorChar or AltDirectorySeparatorChar
	//
	// Unlike CanonicalizePath, this does not do any path resolution
	// (which GetDirectoryName is not supposed to do).
	//
	public /* internal */ static CleanPath(s: string): string {
		const l: int = s.length;
		let sub: int = 0;
		let start: int = 0;

		// Host prefix?
		const s0: char = s[0].charCodeAt(0);
		if (l > 2 && s0 === '\\'.charCodeAt(0) && s[1] === '\\') {
			start = 2;
		}

		// We are only left with root
		if (l === 1 && (s0 === Path.DirectorySeparatorChar || s0 === Path.AltDirectorySeparatorChar))
			return s;

		// Cleanup
		for (let i: int = start; i < l; i++) {
			let c: char = s[i].charCodeAt(0);

			if (c !== Path.DirectorySeparatorChar && c !== Path.AltDirectorySeparatorChar)
				continue;
			if (i + 1 == l)
				sub++;
			else {
				c = s[i + 1].charCodeAt(0);
				if (c === Path.DirectorySeparatorChar || c === Path.AltDirectorySeparatorChar)
					sub++;
			}
		}

		if (sub == 0)
			return s;

		const copy: CharArray = New.CharArray(l - sub);
		if (start !== 0) {
			copy[0] = '\\'.charCodeAt(0);
			copy[1] = '\\'.charCodeAt(0);
		}
		for (let i: int = start, j = start; i < l && j < copy.length; i++) {
			let c: char = s[i].charCodeAt(0);

			if (c !== Path.DirectorySeparatorChar && c !== Path.AltDirectorySeparatorChar) {
				copy[j++] = c;
				continue;
			}

			// For non-trailing cases.
			if (j + 1 != copy.length) {
				copy[j++] = Path.DirectorySeparatorChar;
				for (; i < l - 1; i++) {
					c = s[i + 1].charCodeAt(0);
					if (c !== Path.DirectorySeparatorChar && c !== Path.AltDirectorySeparatorChar)
						break;
				}
			}
		}
		return TString.FromCharArray(copy);
	}

	public static GetDirectoryName(path: string): string {
		// LAMESPEC: For empty string MS docs say both
		// return null AND throw exception.
		if (path === TString.Empty)
			throw new ArgumentException("Invalid path");

		if (path == null || Path.GetPathRoot(path) === path)
			return null as any;

		if (path.trim().length === 0)
			throw new ArgumentException("Argument string consists of whitespace characters only.");

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) > -1)
			throw new ArgumentException("Path contains invalid characters");

		let nLast: int = path.lastIndexOfAny(TString.FromCharArrayToStringArray(Path.PathSeparatorChars));
		if (nLast == 0)
			nLast++;

		if (nLast > 0) {
			let ret: string = path.substr(0, nLast);
			const l: int = ret.length;

			if (l >= 2 && Path.DirectorySeparatorChar === '\\'.charCodeAt(0) && ret[l - 1].charCodeAt(0) === Path.VolumeSeparatorChar)
				return ret + String.fromCharCode(Path.DirectorySeparatorChar);
			else if (l === 1 && Path.DirectorySeparatorChar === '\\'.charCodeAt(0) && path.length >= 2 && path[nLast].charCodeAt(0) === Path.VolumeSeparatorChar)
				return ret + String.fromCharCode(Path.VolumeSeparatorChar);
			else {
				//
				// Important: do not use CanonicalizePath here, use
				// the custom CleanPath here, as this should not
				// return absolute paths
				//
				return Path.CleanPath(ret);
			}
		}

		return TString.Empty;
	}

	public static GetExtension(path: string): string {
		if (path == null)
			return null as any;

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		const iExt: int = Path.findExtension(path);

		if (iExt > -1) {
			if (iExt < path.length - 1)
				return path.substr(iExt);
		}
		return TString.Empty;
	}

	public static GetFileName(path: string): string {
		if (path == null || path.length === 0)
			return path;

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		const nLast: int = path.lastIndexOfAny(TString.FromCharArrayToStringArray(Path.PathSeparatorChars));
		if (nLast >= 0)
			return path.substr(nLast + 1);

		return path;
	}

	public static GetFileNameWithoutExtension(path: string): string {
		return Path.ChangeExtension(Path.GetFileName(path), null as any);
	}

	public static GetFullPath(path: string): string {
		const fullpath: string = Path.InsecureGetFullPath(path);

		return fullpath;
	}

	public /* internal */ static WindowsDriveAdjustment(path: string): string {
		// two special cases to consider when a drive is specified
		if (path.length < 2)
			return path;
		if ((path[1] !== ':') || !TChar.IsLetter(path[0].charCodeAt(0)))
			return path;

		const current: string = Directory.InsecureGetCurrentDirectory();
		// first, only the drive is specified
		if (path.length == 2) {
			// then if the current directory is on the same drive
			if (current[0] == path[0])
				path = current; // we return it
			else
				path += '\\';
		} else if ((path[2].charCodeAt(0) !== Path.DirectorySeparatorChar) && (path[2].charCodeAt(0) !== Path.AltDirectorySeparatorChar)) {
			// second, the drive + a directory is specified *without* a separator between them (e.g. C:dir).
			// If the current directory is on the specified drive...
			if (current[0] === path[0]) {
				// then specified directory is appended to the current drive directory
				path = Path.Combine(current, path.substr(2, path.length - 2));
			} else {
				// if not, then just pretend there was a separator (Path.Combine won't work in this case)
				path = TString.Concat(path.substr(0, 2), Path.DirectorySeparatorStr, path.substr(2, path.length - 2));
			}
		}
		return path;
	}

	// insecure - do not call directly
	public /* internal */ static InsecureGetFullPath(path: string): string {
		if (path == null)
			throw new ArgumentNullException("path");

		if (path.trim().length === 0) {
			const msg: string = Locale.GetText("The specified path is not of a legal form (empty).");
			throw new ArgumentException(msg);
		}

		// adjust for drives, i.e. a special case for windows
		if (Environment.IsRunningOnWindows)
			path = Path.WindowsDriveAdjustment(path);

		// if the supplied path ends with a separator...
		const end: char = path[path.length - 1].charCodeAt(0);

		var canonicalize = true;
		if (path.length >= 2 && Path.IsDsc(path[0].charCodeAt(0)) && Path.IsDsc(path[1].charCodeAt(0))) {
			if (path.length == 2 || path.indexOf(path[0], 2) < 0)
				throw new ArgumentException("UNC paths should be of the form \\\\server\\share.");

			if (path[0].charCodeAt(0) !== Path.DirectorySeparatorChar)
				path = path.replace(String.fromCharCode(Path.AltDirectorySeparatorChar), String.fromCharCode(Path.DirectorySeparatorChar));

		} else {
			if (!Path.IsPathRooted(path)) {

				// avoid calling expensive CanonicalizePath when possible
				if (!Environment.IsRunningOnWindows) {
					var start = 0;
					while ((start = path.indexOf('.', start)) !== -1) {
						if (++start === path.length || path[start].charCodeAt(0) === Path.DirectorySeparatorChar || path[start].charCodeAt(0) === Path.AltDirectorySeparatorChar)
							break;
					}
					canonicalize = start > 0;
				}

				path = Directory.InsecureGetCurrentDirectory() + Path.DirectorySeparatorStr + path;
			} else if (Path.DirectorySeparatorChar === '\\'.charCodeAt(0) && path.length >= 2 && Path.IsDsc(path[0].charCodeAt(0)) && !Path.IsDsc(path[1].charCodeAt(0))) { // like `\abc\def'
				const current: string = Directory.InsecureGetCurrentDirectory();
				if (current[1].charCodeAt(0) === Path.VolumeSeparatorChar)
					path = current.substr(0, 2) + path;
				else
					path = current.substr(0, current.indexOf('\\', TString.IndexOfOrdinalUnchecked(current, "\\\\") + 1));
			}
		}

		if (canonicalize)
			path = Path.CanonicalizePath(path);

		// if the original ended with a [Alt]DirectorySeparatorChar then ensure the full path also ends with one
		if (Path.IsDsc(end) && (path[path.length - 1].charCodeAt(0) !== Path.DirectorySeparatorChar))
			path += String.fromCharCode(Path.DirectorySeparatorChar);

		return path;
	}

	private static IsDsc(c: char): boolean {
		return c === Path.DirectorySeparatorChar || c === Path.AltDirectorySeparatorChar;
	}

	public static GetPathRoot(path: string): string {
		if (path == null)
			return null as any;

		if (path.trim().length === 0)
			throw new ArgumentException("The specified path is not of a legal form.");

		if (!Path.IsPathRooted(path))
			return TString.Empty;

		if (Path.DirectorySeparatorChar === '/'.charCodeAt(0)) {
			// UNIX
			return Path.IsDsc(path[0].charCodeAt(0)) ? Path.DirectorySeparatorStr : TString.Empty;
		} else {
			// Windows
			let len: int = 2;

			if (path.length === 1 && Path.IsDsc(path[0].charCodeAt(0)))
				return Path.DirectorySeparatorStr;
			else if (path.length < 2)
				return String.Empty;

			if (Path.IsDsc(path[0].charCodeAt(0)) && Path.IsDsc(path[1].charCodeAt(0))) {
				// UNC: \\server or \\server\share
				// Get server
				while (len < path.length && !Path.IsDsc(path[len].charCodeAt(0))) len++;

				// Get share
				if (len < path.length) {
					len++;
					while (len < path.length && !Path.IsDsc(path[len].charCodeAt(0))) len++;
				}

				return Path.DirectorySeparatorStr + Path.DirectorySeparatorStr + path.substr(2, len - 2).replace(String.fromCharCode(Path.AltDirectorySeparatorChar), String.fromCharCode(Path.DirectorySeparatorChar));
			} else if (Path.IsDsc(path[0].charCodeAt(0))) {
				// path starts with '\' or '/'
				return Path.DirectorySeparatorStr;
			} else if (path[1].charCodeAt(0) === Path.VolumeSeparatorChar) {
				// C:\folder
				if (path.length >= 3 && (Path.IsDsc(path[2].charCodeAt(0)))) len++;
			} else
				return Directory.GetCurrentDirectory().substr(0, 2);// + path.Substring (0, len);
			return path.substr(0, len);
		}
	}

	// FIXME: Further limit the assertion when imperative Assert is implemented
	public static GetTempFileName(): string {
		let f: FileStream = null as any;
		let path: string;
		let rnd: Random;
		let num: int = 0;
		let count: int = 0;

		//SecurityManager.EnsureElevatedPermissions(); // this is a no-op outside moonlight

		rnd = new Random();
		do {
			num = rnd.Next();
			num++;
			path = Path.Combine(Path.GetTempPath(), "tmp" + TNumber.ToString("x", num) + ".tmp");

			try {
				f = new FileStream(path, FileMode.CreateNew, FileAccess.ReadWrite, FileShare.Read,
					8192, false, <FileOptions>1);
			}
			catch (ex:any) {
				if (ex.hresult !== MonoIO.FileAlreadyExistsHResult || count++ > 65536)
					throw '';
			}
		} while (f == null);

		f.Close();
		return path;
	}

	public static GetTempPath(): string {
		const p: string = Path.get_temp_path();
		if (p.length > 0 && p[p.length - 1].charCodeAt(0) !== Path.DirectorySeparatorChar)
			return p + Path.DirectorySeparatorChar;

		return p;
	}

	private static get_temp_path(): string {
		return 'c:\\Temp';
	}

	public static HasExtension(path: string): boolean {
		if (path == null || path.trim().length === 0)
			return false;

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		const pos: int = Path.findExtension(path);
		return 0 <= pos && pos < path.length - 1;
	}

	public static IsPathRooted(path: string): boolean {
		if (path == null || path.length === 0)
			return false;

		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException("Illegal characters in path.");

		let c: char = path[0].charCodeAt(0);
		return (c === Path.DirectorySeparatorChar || c === Path.AltDirectorySeparatorChar || (!Path.dirEqualsVolume && path.length > 1 && path[1].charCodeAt(0) === Path.VolumeSeparatorChar));
	}

	public static GetInvalidFileNameChars(): CharArray {
		// return a new array as we do not want anyone to be able to change the values
		if (Environment.IsRunningOnWindows) {
			return New.CharArray(['\x00'.charCodeAt(0), '\x01'.charCodeAt(0), '\x02'.charCodeAt(0), '\x03'.charCodeAt(0), '\x04'.charCodeAt(0), '\x05'.charCodeAt(0), '\x06'.charCodeAt(0), '\x07'.charCodeAt(0),
			'\x08'.charCodeAt(0), '\x09'.charCodeAt(0), '\x0A'.charCodeAt(0), '\x0B'.charCodeAt(0), '\x0C'.charCodeAt(0), '\x0D'.charCodeAt(0), '\x0E'.charCodeAt(0), '\x0F'.charCodeAt(0), '\x10'.charCodeAt(0), '\x11', '\x12',
			'\x13'.charCodeAt(0), '\x14'.charCodeAt(0), '\x15'.charCodeAt(0), '\x16'.charCodeAt(0), '\x17'.charCodeAt(0), '\x18'.charCodeAt(0), '\x19'.charCodeAt(0), '\x1A'.charCodeAt(0), '\x1B'.charCodeAt(0), '\x1C', '\x1D',
			'\x1E'.charCodeAt(0), '\x1F'.charCodeAt(0), '\x22'.charCodeAt(0), '\x3C'.charCodeAt(0), '\x3E'.charCodeAt(0), '\x7C'.charCodeAt(0), ':'.charCodeAt(0), '*'.charCodeAt(0), '?'.charCodeAt(0), '\\'.charCodeAt(0), '/'.charCodeAt(0)]);

		} else {
			return New.CharArray(['\x00'.charCodeAt(0), '/'.charCodeAt(0)]);
		}
	}

	public static GetInvalidPathChars(): CharArray {
		// return a new array as we do not want anyone to be able to change the values
		if (Environment.IsRunningOnWindows) {
			return New.CharArray([
				'\x22'.charCodeAt(0), '\x3C'.charCodeAt(0), '\x3E'.charCodeAt(0), '\x7C'.charCodeAt(0), '\x00'.charCodeAt(0), '\x01'.charCodeAt(0), '\x02'.charCodeAt(0), '\x03'.charCodeAt(0), '\x04'.charCodeAt(0), '\x05'.charCodeAt(0), '\x06'.charCodeAt(0), '\x07'.charCodeAt(0),
				'\x08'.charCodeAt(0), '\x09'.charCodeAt(0), '\x0A'.charCodeAt(0), '\x0B'.charCodeAt(0), '\x0C'.charCodeAt(0), '\x0D'.charCodeAt(0), '\x0E'.charCodeAt(0), '\x0F'.charCodeAt(0), '\x10'.charCodeAt(0), '\x11'.charCodeAt(0), '\x12'.charCodeAt(0),
				'\x13'.charCodeAt(0), '\x14'.charCodeAt(0), '\x15'.charCodeAt(0), '\x16'.charCodeAt(0), '\x17'.charCodeAt(0), '\x18'.charCodeAt(0), '\x19'.charCodeAt(0), '\x1A'.charCodeAt(0), '\x1B'.charCodeAt(0), '\x1C'.charCodeAt(0), '\x1D'.charCodeAt(0),
				'\x1E'.charCodeAt(0), '\x1F'.charCodeAt(0)
			]);
		} else {
			return New.CharArray(['\x00']);
		}
	}

	public static GetRandomFileName(): string {
		// returns a 8.3 filename (total size 12)
		const sb: StringBuilder = new StringBuilder(12);
		// using strong crypto but without creating the file
		const rng: RandomNumberGenerator = RandomNumberGenerator.Create();
		const buffer: ByteArray = New.ByteArray(11);
		rng.GetBytes(buffer);

		for (let i: int = 0; i < buffer.length; i++) {
			if (sb.Length == 8)
				sb.Append('.');

			// restrict to length of range [a..z0..9]
			const b: int = (buffer[i] % 36);
			const c: char = Convert.ToChar(b < 26 ? (b + 'a'.charCodeAt(0)) : (b - 26 + '0'.charCodeAt(0)));
			sb.AppendChar(c);
		}

		return sb.ToString();
	}

	// private class methods

	private static findExtension(path: string): int {
		// method should return the index of the path extension
		// start or -1 if no valid extension
		if (path != null) {
			const iLastDot: int = path.lastIndexOf('.');
			const iLastSep: int = path.lastIndexOfAny(TString.FromCharArrayToStringArray(Path.PathSeparatorChars));

			if (iLastDot > iLastSep)
				return iLastDot;
		}
		return -1;
	}

	public static StaticConstructor() {
		(Path as any).VolumeSeparatorChar = MonoIO.VolumeSeparatorChar;
		(Path as any).DirectorySeparatorChar = MonoIO.DirectorySeparatorChar;
		(Path as any).AltDirectorySeparatorChar = MonoIO.AltDirectorySeparatorChar;

		(Path as any).PathSeparator = MonoIO.PathSeparator;
		// this copy will be modifiable ("by design")
		(Path as any).InvalidPathChars = Path.GetInvalidPathChars();
		// internal fields

		(Path as any).DirectorySeparatorStr = String.fromCharCode(Path.DirectorySeparatorChar);
		(Path as any).PathSeparatorChars = New.CharArray([
			Path.DirectorySeparatorChar,
			Path.AltDirectorySeparatorChar,
			Path.VolumeSeparatorChar
		]);

		(Path as any).dirEqualsVolume = (Path.DirectorySeparatorChar === Path.VolumeSeparatorChar);
	}

	// returns the server and share part of a UNC. Assumes "path" is a UNC.
	private static GetServerAndShare(path: string): string {
		let len: int = 2;
		while (len < path.length && !Path.IsDsc(path[len].charCodeAt(0))) len++;

		if (len < path.length) {
			len++;
			while (len < path.length && !Path.IsDsc(path[len].charCodeAt(0))) len++;
		}

		return path.substr(2, len - 2).replace(String.fromCharCode(Path.AltDirectorySeparatorChar), String.fromCharCode(Path.DirectorySeparatorChar));
	}

	// assumes Environment.IsRunningOnWindows == true
	private static SameRoot(root: string, path: string): boolean {
		// compare root - if enough details are available
		if ((root.length < 2) || (path.length < 2))
			return false;

		// UNC handling
		if (Path.IsDsc(root[0].charCodeAt(0)) && Path.IsDsc(root[1].charCodeAt(0))) {
			if (!(Path.IsDsc(path[0].charCodeAt(0)) && Path.IsDsc(path[1].charCodeAt(0))))
				return false;

			const rootShare: string = Path.GetServerAndShare(root);
			const pathShare: string = Path.GetServerAndShare(path);

			return TString.Compare(rootShare, pathShare, true /*, CultureInfo.InvariantCulture */) === 0;
		}

		// same volume/drive
		if (!(root[0] === path[0]))
			return false;
		// presence of the separator
		if (path[1].charCodeAt(0) !== Path.VolumeSeparatorChar)
			return false;
		if ((root.length > 2) && (path.length > 2)) {
			// but don't directory compare the directory separator
			return (Path.IsDsc(root[2].charCodeAt(0)) && Path.IsDsc(path[2].charCodeAt(0)));
		}
		return true;
	}

	public static Join(...paths: string[]) {
		const result: string[] = [];
		for (let i = 0; i < paths.length; i++) {
			const index = paths[i].lastIndexOf(String.fromCharCode(Path.DirectorySeparatorChar));
			if (index === paths[i].length - 1) {
				result.push(paths[i].substring(0, index));
			} else {
				result.push(paths[i]);
			}
		}
		return result.join(String.fromCharCode(Path.DirectorySeparatorChar));
	}
	private static CanonicalizePath(path: string): string {
		// STEP 1: Check for empty string
		if (path == null)
			return path;
		if (Environment.IsRunningOnWindows)
			path = path.trim();

		if (path.length === 0)
			return path;

		// STEP 2: Check to see if this is only a root
		const root: string = Path.GetPathRoot(path);
		// it will return '\' for path '\', while it should return 'c:\' or so.
		// Note: commenting this out makes the need for the (target == 1...) check in step 5
		//if (root == path) return path;

		// STEP 3: split the directories, this gets rid of consecutative "/"'s
		const dirs: string[] = TString.Split(path, Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
		// STEP 4: Get rid of directories containing . and ..
		let target: int = 0;

		const isUnc: boolean = Environment.IsRunningOnWindows && root.length > 2 && Path.IsDsc(root[0].charCodeAt(0)) && Path.IsDsc(root[1].charCodeAt(0));

		// Set an overwrite limit for UNC paths since '\' + server + share
		// must not be eliminated by the '..' elimination algorithm.
		const limit: int = isUnc ? 3 : 0;

		for (let i: int = 0; i < dirs.length; i++) {
			// WIN32 path components must be trimmed
			if (Environment.IsRunningOnWindows)
				dirs[i] = TString.TrimEnd(dirs[i]);

			if (dirs[i] === "." || (i != 0 && dirs[i].length === 0))
				continue;
			else if (dirs[i] === "..") {
				// don't overwrite path segments below the limit
				if (target > limit)
					target--;
			} else
				dirs[target++] = dirs[i];
		}

		// STEP 5: Combine everything.
		if (target == 0 || (target == 1 && dirs[0] == ""))
			return root;
		else {
			let ret: string = TString._Join(Path.DirectorySeparatorStr, dirs, 0, target);
			if (Environment.IsRunningOnWindows) {
				// append leading '\' of the UNC path that was lost in STEP 3.
				if (isUnc)
					ret = Path.DirectorySeparatorStr + ret;

				if (!Path.SameRoot(root, ret))
					ret = root + ret;

				if (isUnc) {
					return ret;
				} else if (!Path.IsDsc(path[0].charCodeAt(0)) && Path.SameRoot(root, path)) {
					if (ret.length <= 2 && !ret.endsWith(Path.DirectorySeparatorStr)) // '\' after "c:"
						ret += Path.DirectorySeparatorChar;
					return ret;
				} else {
					const current: string = Directory.GetCurrentDirectory();
					if (current.length > 1 && current[1].charCodeAt(0) === Path.VolumeSeparatorChar) {
						// DOS local file path
						if (ret.length === 0 || Path.IsDsc(ret[0].charCodeAt(0)))
							ret += '\\';
						return current.substr(0, 2) + ret;
					} else if (Path.IsDsc(current[current.length - 1].charCodeAt(0)) && Path.IsDsc(ret[0].charCodeAt(0)))
						return current + ret.substr(1);
					else
						return current + ret;
				}
			}
			return ret;
		}
	}

	// required for FileIOPermission (and most proibably reusable elsewhere too)
	// both path MUST be "full paths"
	private static /* internal */  IsPathSubsetOf(subset: string, path: string): boolean {
		if (subset.length > path.length)
			return false;

		// check that everything up to the last separator match
		let slast: int = subset.lastIndexOfAny(TString.FromCharArrayToStringArray(Path.PathSeparatorChars));
		if (TString.Compare(subset, 0, path, 0, slast) != 0)
			return false;

		slast++;
		// then check if the last segment is identical
		const plast: int = path.indexOfAny(TString.FromCharArrayToStringArray(Path.PathSeparatorChars), slast);
		if (plast >= slast) {
			return TString.Compare(subset, slast, path, slast, path.length - plast) === 0;
		}
		if (subset.length !== path.length)
			return false;

		return TString.Compare(subset, slast, path, slast, subset.length - slast) === 0;
	}


	public static Combine(...paths: string[]): string {
		if (paths == null)
			throw new ArgumentNullException("paths");

		let need_sep: boolean = false;
		var ret = new StringBuilder();
		let pathsLen: int = paths.length;
		let slen: int = 0;
		foreach(paths, (s: string) => {
			need_sep = false;
			if (s == null)
				throw new ArgumentNullException("One of the paths contains a null value", "paths");
			if (s.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
				throw new ArgumentException("Illegal characters in path.");

			pathsLen--;
			if (Path.IsPathRooted(s))
				ret.Length = 0;

			ret.Append(s);
			slen = s.length;
			if (slen > 0 && pathsLen > 0) {
				const p1end: char = s[slen - 1].charCodeAt(0);
				if (p1end !== Path.DirectorySeparatorChar && p1end !== Path.AltDirectorySeparatorChar && p1end !== Path.VolumeSeparatorChar)
					need_sep = true;
			}

			if (need_sep)
				ret.Append(Path.DirectorySeparatorStr);
		});

		return ret.ToString();
	}

	/* #if NET_4_0
	public
	#else
	internal
	#endif
	static string Combine(string path1, string path2, string path3) {
		if (path1 == null)
			throw new ArgumentNullException("path1");

		if (path2 == null)
			throw new ArgumentNullException("path2");

		if (path3 == null)
			throw new ArgumentNullException("path3");

		return Combine(new string[] { path1, path2, path3 });
	}

	#if NET_4_0
	public
	#else
	internal
	#endif
	static string Combine(string path1, string path2, string path3, string path4) {
		if (path1 == null)
			throw new ArgumentNullException("path1");

		if (path2 == null)
			throw new ArgumentNullException("path2");

		if (path3 == null)
			throw new ArgumentNullException("path3");

		if (path4 == null)
			throw new ArgumentNullException("path4");

		return Combine(new string[] { path1, path2, path3, path4 });
	} */

	/* 	public  internal  static Validate(path: string): void {
			Path.Validate(path, "path");
		} */

	public /* internal */ static Validate(path: string, parameterName: string = 'path'): void {
		if (path == null)
			throw new ArgumentNullException(parameterName);
		if (TString.IsNullOrWhiteSpace(path))
			throw new ArgumentException(Locale.GetText("Path is empty"));
		if (path.indexOfAny(TString.FromCharArrayToStringArray(Path.InvalidPathChars)) !== -1)
			throw new ArgumentException(Locale.GetText("Path contains invalid chars"));
		if (Environment.IsRunningOnWindows) {
			const idx: int = path.indexOf(':');
			if (idx >= 0 && idx != 1)
				throw new ArgumentException(parameterName);
		}
	}
}


Path.StaticConstructor();