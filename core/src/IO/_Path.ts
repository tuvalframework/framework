import { Environment } from "../Environment";
import { Exception } from "../Exception";
import { NotImplementedException } from "../Exceptions";
import { ArgumentException } from "../Exceptions/ArgumentException";
import { ArgumentNullException } from "../Exceptions/ArgumentNullException";
import { char, CharArray, int, New, uint } from "../float";
import { is } from "../is";
import { Locale } from "../Locale";
import { newOutEmpty, Out } from "../Out";
import { StringBuilder } from "../Text/StringBuilder";
import { TString } from "../Text/TString";
declare var Directory;

export class _Path {
    public /* internal */ static readonly MAX_PATH: int = 260;
    public /* internal */ static readonly ERROR_SUCCESS: int = 0;
    public /* internal */ static readonly MAX_DIRECTORY_PATH: int = 248;
    private static readonly dirEqualsVolume: boolean;
    public static readonly DirectorySeparatorChar: string;
    public static readonly AltDirectorySeparatorChar: string;
    public static readonly VolumeSeparatorChar: string;
    public static readonly InvalidPathChars: string[];
    public static PathSeparatorChars: string[]
    public static WhitespaceChars: string[];
    public /* internal */  static readonly InternalInvalidPathChars: string[];
    public static readonly PathSeparator: char;
    public static StaticConstructor() {
        (_Path as any).DirectorySeparatorChar = '\\';
        (_Path as any).AltDirectorySeparatorChar = '/';
        (_Path as any).VolumeSeparatorChar = ':';
        (_Path as any).InvalidPathChars = ['\"', '<', '>', '|', '\0', '\b', '\u0010', '\u0011', '\u0012', '\u0014', '\u0015', '\u0016', '\u0017', '\u0018', '\u0019'];
        (_Path as any).InternalInvalidPathChars = New.CharArray(['\"', '<', '>', '|', '\0', '\b', '\u0010', '\u0011', '\u0012', '\u0014', '\u0015', '\u0016', '\u0017', '\u0018', '\u0019']);
        (_Path as any).PathSeparator = ';';
        (_Path as any).WhitespaceChars = New.CharArray(['\t', '\n', '\v', '\f', '\r', ' ', '\u00A0', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008', '\u2009', '\u200A', '\u200B', '\u3000', '\uFEFF']);

        (_Path as any).dirEqualsVolume = (_Path.DirectorySeparatorChar === _Path.VolumeSeparatorChar);
        (_Path as any).PathSeparatorChars = [
            _Path.DirectorySeparatorChar,
            _Path.AltDirectorySeparatorChar,
            _Path.VolumeSeparatorChar
        ];
    }
    private constructor() {

    }
    public static ChangeExtension(path: string, extension: string): string {
        let chr: string;
        if (path == null) {
            return null as any;
        }
        _Path.CheckInvalidPathChars(path);
        let str: string = path;
        let length: int = path.length;
        do {
            const int32: int = length - 1;
            length = int32;
            if (int32 < 0) {
                break;
            }
            chr = path[length];
            if (chr !== '.') {
                continue;
            }
            str = path.substring(0, length);
            break;
        } while (chr !== _Path.DirectorySeparatorChar && chr !== _Path.AltDirectorySeparatorChar && chr !== _Path.VolumeSeparatorChar);
        if (extension != null && path.length !== 0) {
            if (extension.length === 0 || extension[0] !== '.') {
                str = TString.Concat(str, ".");
            }
            str = TString.Concat(str, extension);
        }
        return str;
    }

    public /* internal */ static CheckInvalidPathChars(path: string): void {
        if (-1 !== path.indexOfAny(_Path.InternalInvalidPathChars)) {
            throw new ArgumentException(Environment.GetResourceString("Argument_InvalidPathChars"));
        }
    }
    public /* internal */ static CheckSearchPattern(searchPattern: string): void {
        if ((Environment.OSInfo & Environment.OSName.Win9x) !== Environment.OSName.Invalid /* && _Path.CanPathCircumventSecurityNative(searchPattern) */) {
            throw new ArgumentException(Environment.GetResourceString("Arg_InvalidSearchPattern"));
        }
        while (true) {
            const int32: int = searchPattern.indexOf("..");
            const int321: int = int32;
            if (int32 == -1) {
                return;
            }
            if (int321 + 2 === searchPattern.length) {
                throw new ArgumentException(Environment.GetResourceString("Arg_InvalidSearchPattern"));
            }
            if (searchPattern[int321 + 2] === _Path.DirectorySeparatorChar || searchPattern[int321 + 2] === _Path.AltDirectorySeparatorChar) {
                break;
            }
            searchPattern = searchPattern.substring(int321 + 2);
        }
        throw new ArgumentException(Environment.GetResourceString("Arg_InvalidSearchPattern"));
    }

    public static Combine(path1: string, path2: string): string {
        if (path1 == null || path2 == null) {
            throw new ArgumentNullException((path1 == null ? "path1" : "path2"));
        }
        _Path.CheckInvalidPathChars(path1);
        _Path.CheckInvalidPathChars(path2);
        if (path2.length === 0) {
            return path1;
        }
        if (path1.length === 0) {
            return path2;
        }
        if (_Path.IsPathRooted(path2)) {
            return path2;
        }
        const chr: string = path1[path1.length - 1];
        if (chr === _Path.DirectorySeparatorChar || chr === _Path.AltDirectorySeparatorChar || chr === _Path.VolumeSeparatorChar) {
            return TString.Concat(path1, path2);
        }
        return TString.Concat(path1, _Path.DirectorySeparatorChar, path2);
    }

    public /* internal */ static FixupPath(path: string): string {
        let str: Out<string> = newOutEmpty(TString.Empty);
        const int32: int = _Path.nGetFullPathHelper(path, _Path.InternalInvalidPathChars, _Path.WhitespaceChars, _Path.DirectorySeparatorChar, _Path.AltDirectorySeparatorChar, _Path.VolumeSeparatorChar, false, str);
        if (int32 !== 0) {
            //__Error.WinIOError(int32, path);
            throw new Exception('IOError');
        }
        return str.value;
    }
    public static GetDirectoryName(path: string): string {
        // LAMESPEC: For empty string MS docs say both
        // return null AND throw exception.  Seems .NET throws.
        if (path === TString.Empty)
            throw new ArgumentException("Invalid path");

        if (path == null || _Path.GetPathRoot(path) === path)
            return null as any;

        if (path.trim().length === 0)
            throw new ArgumentException("Argument string consists of whitespace characters only.");

        if (path.indexOfAny(_Path.InvalidPathChars) > -1) {
            throw new ArgumentException("Path contains invalid characters");
        }

        let nLast: int = TString.LastIndexOfAny(path, _Path.PathSeparatorChars, path.length);
        if (nLast === 0)
            nLast++;

        if (nLast > 0) {
            const ret: string = path.substring(0, nLast);
            const l: int = ret.length;

            if (l >= 2 && _Path.DirectorySeparatorChar == '\\' && ret[l - 1] === _Path.VolumeSeparatorChar)
                return ret + _Path.DirectorySeparatorChar;
            else if (l === 1 && _Path.DirectorySeparatorChar === '\\' && path.length >= 2 && path[nLast] === _Path.VolumeSeparatorChar)
                return ret + _Path.VolumeSeparatorChar;
            else {
                //
                // Important: do not use CanonicalizePath here, use
                // the custom CleanPath here, as this should not
                // return absolute paths
                //
                return _Path.CleanPath(ret);
            }
        }

        return String.Empty;
    }
    public /* internal */ static CleanPath(s: string): string {
        let l: int = s.length;
        let sub: int = 0;
        let alt: int = 0;
        let start: int = 0;

        // Host prefix?
        const s0: string = s[0];
        if (l > 2 && s0 === '\\' && s[1] === '\\') {
            start = 2;
        }

        // We are only left with root
        if (l === 1 && (s0 === _Path.DirectorySeparatorChar || s0 === _Path.AltDirectorySeparatorChar))
            return s;

        // Cleanup
        for (let i: int = start; i < l; i++) {
            let c: string = s[i];

            if (c !== _Path.DirectorySeparatorChar && c !== _Path.AltDirectorySeparatorChar)
                continue;
            if (_Path.DirectorySeparatorChar !== _Path.AltDirectorySeparatorChar && c === _Path.AltDirectorySeparatorChar)
                alt++;
            if (i + 1 == l)
                sub++;
            else {
                c = s[i + 1];
                if (c === _Path.DirectorySeparatorChar || c === _Path.AltDirectorySeparatorChar)
                    sub++;
            }
        }

        if (sub == 0 && alt == 0)
            return s;

        const copy: CharArray = New.CharArray(l - sub);
        if (start !== 0) {
            copy[0] = '\\'.charCodeAt(0);
            copy[1] = '\\'.charCodeAt(0);
        }
        for (let i: int = start, j = start; i < l && j < copy.length; i++) {
            let c: char = s[i].charCodeAt(0);

            if (c !== _Path.DirectorySeparatorChar.charCodeAt(0) && c !== _Path.AltDirectorySeparatorChar.charCodeAt(0)) {
                copy[j++] = c;
                continue;
            }

            // For non-trailing cases.
            if (j + 1 !== copy.length) {
                copy[j++] = _Path.DirectorySeparatorChar.charCodeAt(0);
                for (; i < l - 1; i++) {
                    c = s[i + 1].charCodeAt(0);
                    if (c !== _Path.DirectorySeparatorChar.charCodeAt(0) && c !== _Path.AltDirectorySeparatorChar.charCodeAt(0)) {
                        break;
                    }
                }
            }
        }
        return TString.FromCharArray(copy);
    }
    public /* internal */ static IsDirectorySeparator(c: string): boolean {
        return c === _Path.DirectorySeparatorChar || c === _Path.AltDirectorySeparatorChar;
    }
    public static GetPathRoot(path: string): string {
        if (path == null)
            return null as any;

        if (path.trim().length === 0)
            throw new ArgumentException("The specified path is not of a legal form.");

        if (!_Path.IsPathRooted(path))
            return TString.Empty;

        if (_Path.DirectorySeparatorChar === '/') {
            // UNIX
            return _Path.IsDirectorySeparator(path[0]) ? _Path.DirectorySeparatorChar : TString.Empty;
        } else {
            // Windows
            let len: int = 2;

            if (path.length == 1 && _Path.IsDirectorySeparator(path[0]))
                return _Path.DirectorySeparatorChar;
            else if (path.length < 2)
                return String.Empty;

            if (_Path.IsDirectorySeparator(path[0]) && _Path.IsDirectorySeparator(path[1])) {
                // UNC: \\server or \\server\share
                // Get server
                while (len < path.length && !_Path.IsDirectorySeparator(path[len])) len++;

                // Get share
                if (len < path.length) {
                    len++;
                    while (len < path.length && !_Path.IsDirectorySeparator(path[len])) len++;
                }

                return _Path.DirectorySeparatorChar +
                    _Path.DirectorySeparatorChar +
                    path.substring(2, len).replace(_Path.AltDirectorySeparatorChar, _Path.DirectorySeparatorChar);
            } else if (_Path.IsDirectorySeparator(path[0])) {
                // path starts with '\' or '/'
                return _Path.DirectorySeparatorChar;
            } else if (path[1] === _Path.VolumeSeparatorChar) {
                // C:\folder
                if (path.length >= 3 && (_Path.IsDirectorySeparator(path[2]))) len++;
            } else
                return Directory.GetCurrentDirectory().Substring(0, 2);// + path.Substring (0, len);
            return path.substring(0, len);
        }
    }

    public static IsPathRooted(path: string): boolean {
        if (path == null || path.length === 0)
            return false;

        if (path.indexOfAny(_Path.InvalidPathChars) != -1)
            throw new ArgumentException("Illegal characters in path.");


        const c: string = path[0];
        return (c === _Path.DirectorySeparatorChar || c === _Path.AltDirectorySeparatorChar ||
            (!_Path.dirEqualsVolume && path.length > 1 && path[1] === _Path.VolumeSeparatorChar));
    }

    public static GetExtension(path: string): string {
        let chr: string;
        if (path == null) {
            return null as any;
        }
        _Path.CheckInvalidPathChars(path);
        const length: int = path.length;
        let int32: int = length;
        do {
            const int321: int = int32 - 1;
            int32 = int321;
            if (int321 < 0) {
                break;
            }
            chr = path[int32];
            if (chr !== '.') {
                continue;
            }
            if (int32 === length - 1) {
                return TString.Empty;
            }
            return path.substring(int32, length/*  - int32 */);
        }
        while (chr !== _Path.DirectorySeparatorChar && chr !== _Path.AltDirectorySeparatorChar && chr !== _Path.VolumeSeparatorChar);
        return TString.Empty;
    }

    public static GetFileName(path: string): string {
        let chr: string;
        if (path != null) {
            _Path.CheckInvalidPathChars(path);
            let _length: int = path.length;
            let int32: int = _length;
            do {
                const int321: int = int32 - 1;
                int32 = int321;
                if (int321 < 0) {
                    return path;
                }
                chr = path[int32];
            }
            while (chr !== _Path.DirectorySeparatorChar && chr !== _Path.AltDirectorySeparatorChar && chr !== _Path.VolumeSeparatorChar);
            return path.substring(int32 + 1, _length);
        }
        return path;
    }

    public static GetFileNameWithoutExtension(path: string): string {
        path = _Path.GetFileName(path);
        if (path == null) {
            return null as any;
        }
        const int32: int = path.lastIndexOf('.');
        const int321: int = int32;
        if (int32 === -1) {
            return path;
        }
        return path.substring(0, int321);
    }

    public static GetFullPath(path: string): string {
        const fullPathInternal: string = _Path.GetFullPathInternal(path);
        const strArrays: string[] = [fullPathInternal];
        //(new FileIOPermission(FileIOPermissionAccess.PathDiscovery, strArrays, false, false)).Demand();
        return fullPathInternal;
    }

    public /* internal */ static GetFullPathInternal(path: string): string {
        let str: Out<string> = newOutEmpty(TString.Empty);
        if (path == null) {
            throw new ArgumentNullException("path");
        }
        if (TString.Compare(path, 0, "http:", 0, 5, true, null as any/* CultureInfo.InvariantCulture */) === 0 || TString.Compare(path, 0, "file:", 0, 5, true, null as any/* CultureInfo.InvariantCulture */) === 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_PathUriFormatNotSupported"));
        }
        const int32: int = _Path.nGetFullPathHelper(path, _Path.InternalInvalidPathChars, _Path.WhitespaceChars, _Path.DirectorySeparatorChar, _Path.AltDirectorySeparatorChar, _Path.VolumeSeparatorChar, true, str);
        if (int32 !== 0) {
            //__Error.WinIOError(int32, path);
            throw new Exception('IOError');
        }
        return str.value;
    }
    /* public static GetPathRoot(path: string): string {
        if (path == null) {
            return null as any;
        }
        path = _Path.FixupPath(path);
        return path.substring(0, _Path.GetRootLength(path));
    } */

    public /* internal */ static GetRootLength(path: string): int {
        _Path.CheckInvalidPathChars(path);
        let int32: int = 0;
        const length: int = path.length;
        if (length >= 1 && _Path.IsDirectorySeparator(path[0])) {
            int32 = 1;
            if (length >= 2 && _Path.IsDirectorySeparator(path[1])) {
                int32 = 2;
                let int321: int = 2;
                while (int32 < length) {
                    if (path[int32] === _Path.DirectorySeparatorChar || path[int32] === _Path.AltDirectorySeparatorChar) {
                        const int322: int = int321 - 1;
                        int321 = int322;
                        if (int322 <= 0) {
                            break;
                        }
                    }
                    int32++;
                }
            }
        }
        else if (length >= 2 && path[1] === _Path.VolumeSeparatorChar) {
            int32 = 2;
            if (length >= 3 && _Path.IsDirectorySeparator(path[2])) {
                int32++;
            }
        }
        return int32;
    }

    public static GetTempFileName(): string {
        const tempPath: string = _Path.GetTempPath();
        const stringBuilder: StringBuilder = new StringBuilder(260);
        if (Win32Native.GetTempFileName(tempPath, "tmp", 0, stringBuilder) == 0) {
            throw new Exception('IOError');
        }
        return stringBuilder.ToString();
    }

    public static GetTempPath(): string {
        //(new EnvironmentPermission(PermissionState.Unrestricted)).Demand();
        const stringBuilder: StringBuilder = new StringBuilder(260);
        const tempPath: uint = Win32Native.GetTempPath(260, stringBuilder);
        const str: string = stringBuilder.ToString();
        if (tempPath === 0) {
            //__Error.WinIOError();
            throw new Exception('IOError');
        }
        return str;
    }

    public static HasExtension(path: string): boolean {
        let chr: string;
        if (path != null) {
            _Path.CheckInvalidPathChars(path);
            let length: int = path.length;
            do {
                const int32: int = length - 1;
                length = int32;
                if (int32 < 0) {
                    break;
                }
                chr = path[length];
                if (chr !== '.') {
                    continue;
                }
                if (length !== path.length - 1) {
                    return true;
                }
                return false;
            }
            while (chr !== _Path.DirectorySeparatorChar && chr !== _Path.AltDirectorySeparatorChar && chr !== _Path.VolumeSeparatorChar);
        }
        return false;
    }

    public /* internal */ static InternalCombine(path1: string, path2: string): string {
        if (path1 == null || path2 == null) {
            throw new ArgumentNullException((path1 == null ? "path1" : "path2"));
        }
        _Path.CheckInvalidPathChars(path1);
        _Path.CheckInvalidPathChars(path2);
        if (path2.length == 0) {
            throw new ArgumentException(Environment.GetResourceString("Argument_PathEmpty"), "path2");
        }
        if (_Path.IsPathRooted(path2)) {
            throw new ArgumentException(Environment.GetResourceString("Arg_Path2IsRooted"), "path2");
        }
        const length: int = path1.length;
        if (length === 0) {
            return path2;
        }
        const chr: string = path1[length - 1];
        if (chr === _Path.DirectorySeparatorChar || chr === _Path.AltDirectorySeparatorChar || chr === _Path.VolumeSeparatorChar) {
            return TString.Concat(path1, path2);
        }
        return TString.Concat(path1, _Path.DirectorySeparatorChar, path2);
    }

    /*   public static IsDirectorySeparator(c: string): boolean {
          if (c === _Path.DirectorySeparatorChar) {
              return true;
          }
          return c === _Path.AltDirectorySeparatorChar;
      } */

    /*  public static IsPathRooted(path: string): boolean {
         if (path != null) {
             _Path.CheckInvalidPathChars(path);
             const length: int = path.length;
             if (length >= 1 && (path[0].charCodeAt(0) === _Path.DirectorySeparatorChar || path[0].charCodeAt(0) === _Path.AltDirectorySeparatorChar) || length >= 2 && path[1].charCodeAt(0) === _Path.VolumeSeparatorChar) {
                 return true;
             }
         }
         return false;
     } */

    public static GetInvalidPathChars(): CharArray {
        const buffer = new Uint16Array(36);
        buffer[0] = '\"'.charCodeAt(0);
        buffer[1] = '<'.charCodeAt(0);
        buffer[2] = '>'.charCodeAt(0);
        buffer[3] = '|'.charCodeAt(0);
        buffer[4] = '\0'.charCodeAt(0);
        buffer[5] = 1;
        buffer[6] = 2;
        buffer[7] = 3;
        buffer[8] = 4;
        buffer[9] = 5;
        buffer[10] = 6;
        buffer[11] = 7;
        buffer[12] = 8;
        buffer[13] = 9;
        buffer[14] = 10;
        buffer[15] = 11;
        buffer[16] = 12;
        buffer[17] = 13;
        buffer[18] = 14;
        buffer[19] = 15;
        buffer[20] = 16;
        buffer[21] = 17;
        buffer[22] = 18;
        buffer[23] = 19;
        buffer[24] = 20;
        buffer[25] = 21;
        buffer[26] = 22;
        buffer[27] = 23;
        buffer[28] = 24;
        buffer[29] = 25;
        buffer[30] = 26;
        buffer[31] = 27;
        buffer[32] = 28;
        buffer[33] = 29;
        buffer[34] = 30;
        buffer[35] = 31;

        return buffer;
    }

    public static nGetFullPathHelper(path: string, invalidPathChars: string[], whitespaceChars: string[], directorySeparator: string, altDirectorySeparator: string, volumeSeparator: string, fullCheck: boolean, newPath: Out<string>): int {
        throw new NotImplementedException('nGetFullPathHelper');
    }
    public /* internal */ static Validate(path: string): void;
    public /* internal */ static Validate(path: string, parameterName: string): void;
    public /* internal */ static Validate(...args: any[]): void {
        if (args.length === 1 && is.string(args[0])) {
            const path: string = args[0];
            _Path.Validate(path, "path");
        } else if (args.length === 2 && is.string(args[0]) && is.string(args[1])) {
            const path: string = args[0];
            const parameterName: string = args[1];
            if (path == null)
                throw new ArgumentNullException(parameterName);
            if (TString.IsNullOrWhiteSpace(path))
                throw new ArgumentException(Locale.GetText("Path is empty"));
            if (path.indexOfAny(_Path.InvalidPathChars) != -1)
                throw new ArgumentException(Locale.GetText("Path contains invalid chars"));
            if (Environment.IsRunningOnWindows) {
                const idx: int = path.indexOf(':');
                if (idx >= 0 && idx !== 1)
                    throw new ArgumentException(parameterName);
            }
        }
    }
}

class Win32Native {
    public static GetTempPath(num: int, stringBuilder: StringBuilder): int {
        return -1;;
    }
    public static GetTempFileName(tempPath: string, prefix: string, num: int, stringBuilder: StringBuilder): int {
        return -1;
    }
}
_Path.StaticConstructor();