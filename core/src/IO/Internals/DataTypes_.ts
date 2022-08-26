import { Encoding } from '../../Encoding/Encoding';
import { TBuffer } from '../Buffer/TBuffer';
import { Convert } from '../../convert';
import { CharacterSplitter } from '../../Text/TextSplitter';
/*
export function LONG(target: any, name: string): any {
    return class {
        public constructor(target: any, name: string) {
            console.log('long');
            Object.defineProperty(target, name, {
                get: (function () {
                    const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
                    return function () {
                        this.seek(this.pointer + size);
                        return this.ReadLong();
                    }
                })(),
                set: (function () {
                    const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
                    return function (value) {
                        this.seek(this.pointer + size);
                        this.WriteLong(Convert.ToInt32(value));
                    }
                })()
            });
            target.__SIZE__ = (target.__SIZE__ === undefined ? 0 : target.__SIZE__) + GetTypeSize(WinDataTypes.LONG);
        }
    }
} */
export abstract class UMPDataType {
    public constructor(target: any, name: string) {
        const self: any = this;
        //target['$' + name] = null;
        if (!Array.isArray(target.__FIELDS__)) {
            target.__FIELDS__ = [];
        }
        target.__FIELDS__.push(name);
        Object.defineProperty(target, name, {
            get: (function () {
                const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
                return function () {
                    if (this.pointer === undefined) {
                        return this['$' + name];
                    } else {
                        this.seek(this.pointer + size);
                        return self.Read(this);
                    }
                }
            })(),
            set: (function () {
                const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
                return function (value: any) {
                    if (this.pointer === undefined) {
                        this['$' + name] = value;
                    } else {
                        if (value != null) {
                            this.seek(this.pointer + size);
                            self.Write(this, value);
                        }
                    }
                }
            })()
        });
        target.__SIZE__ = (target.__SIZE__ === undefined ? 0 : target.__SIZE__) + this.GetSize();
    }
    public abstract Write(buffer: TBuffer, value: any);
    public abstract Read(buffer: TBuffer): any;
    public abstract GetSize(): number;
}

export enum WinDataTypes {
    APIENTRY = 1,
    ATOM = 2,
    BOOL = 3,
    BOOLEAN = 4,
    BYTE = 5,
    CALLBACK = 6,
    CCHAR = 7,
    CHAR = 8,
    COLORREF = 9,
    CONST = 10,
    DWORD = 11,
    DWORDLONG = 12,
    DWORD_PTR = 13,
    DWORD32 = 14,
    DWORD64 = 15,
    FLOAT = 16,
    HACCEL = 17,
    HALF_PTR = 18,
    HANDLE = 19,
    HBITMAP = 20,
    HBRUSH = 21,
    HCOLORSPACE = 22,
    HCONV = 23,
    HCONVLIST = 24,
    HCURSOR = 25,
    HDC = 26,
    HDDEDATA = 27,
    HDESK = 28,
    HDROP = 29,
    HDWP = 30,
    HENHMETAFILE = 31,
    HFILE = 32,
    HFONT = 33,
    HGDIOBJ = 34,
    HGLOBAL = 35,
    HHOOK = 36,
    HICON = 37,
    HINSTANCE = 38,
    HKEY = 39,
    HKL = 40,
    HLOCAL = 41,
    HMENU = 42,
    HMETAFILE = 43,
    HMODULE = 44,
    HMONITOR = 45,
    HPALETTE = 46,
    HPEN = 47,
    HRESULT = 48,
    HRGN = 49,
    HRSRC = 50,
    HSZ = 51,
    HWINSTA = 52,
    HWND = 53,
    INT = 54,
    INT_PTR = 55,
    INT8 = 56,
    INT16 = 57,
    INT32 = 58,
    INT64 = 59,
    LANGID = 60,
    LCID = 61,
    LCTYPE = 62,
    LGRPID = 63,
    LONG = 64,
    LONGLONG = 65,
    LONG_PTR = 66,
    LONG32 = 67,
    LONG64 = 68,
    LPARAM = 69,
    LPBOOL = 70,
    LPBYTE = 71,
    LPCOLORREF = 72,
    LPCSTR = 73,
    LPCTSTR = 74,
    LPCVOID = 75,
    LPCWSTR = 76,
    LPDWORD = 77,
    LPHANDLE = 78,
    LPINT = 79,
    LPLONG = 80,
    LPSTR = 81,
    LPTSTR = 82,
    LPVOID = 83,
    LPWORD = 84,
    LPWSTR = 85,
    LRESULT = 86,
    PBOOL = 87,
    PBOOLEAN = 88,
    PBYTE = 89,
    PCHAR = 90,
    PCSTR = 91,
    PCTSTR = 92,
    PCWSTR = 93,
    PDWORD = 94,
    PDWORDLONG = 95
}

/*
interface DataTypeMathcObject {
    [key: number]: DataTypeMatch;
}

interface DataTypeMatch {
    ConvertFunction: Function;
    Decorator: Function;
}

const Types: DataTypeMathcObject = {};

Types[WinDataTypes.LONG] = {
    ConvertFunction: Convert.ToLong,
    Decorator: LONG$
} */
/* const ConvertFunction:Function[] = [];
ConvertFunction[WinDataTypes.LONG] = Convert.ToLong; */

/* function LONG$(target: any, name: string) {
    console.log('long');
    Object.defineProperty(target, name, {
        get: (function () {
            const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
            return function () {
                this.seek(this.pointer + size);
                return this.ReadLong();
            }
        })(),
        set: (function () {
            const size: number = target.__SIZE__ === undefined ? 0 : target.__SIZE__;
            return function (value) {
                this.seek(this.pointer + size);
                this.WriteLong(Convert.ToInt32(value));
            }
        })()
    });
    target.__SIZE__ = (target.__SIZE__ === undefined ? 0 : target.__SIZE__) + GetTypeSize(WinDataTypes.LONG);
}
 */