import { ByteArray } from './float';
import { TString } from './Text/TString';

declare var TuvalSettings;

export abstract class Console {
    public static Error = class {
        public static Write(str: string, ...args: any[]) {
            setTimeout(() => {
                console.error(TString.Format(str, args));
            }, 10);

        }
        public static WriteLine(str: string, ...args: any[]) {
            setTimeout(() => {
                console.error(TString.Format(str, ...args));
            }, 10);
        }
    }

    public abstract Write(value: any);
    public abstract Write(str: string, ...args: any[]);

    public abstract WriteLine();
    public abstract WriteLine(value: any);
    public abstract WriteLine(str: string, ...args: any[]);

    public abstract WriteHex(b: ByteArray);

    public static Write(value: any);
    public static Write(str: string, ...args: any[]);
    public static Write(...args: any[]) {
        if (args.length === 1) {
            const value: any = args[0];
            if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
                TuvalSettings.print(TString.Format1(TString.ToString(value), ...args));
            } else {
                console.log(TString.Format1(TString.ToString(value), ...args));
            }
        } else if (args.length > 1 && typeof args[0] === 'string') {
            const str: string = args[0];
            const _args: any[] = args.slice(1, arguments.length);
            if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
                TuvalSettings.print(TString.Format1(TString.ToString(str), ..._args));
            } else {
                console.log(TString.Format1(TString.ToString(str), ..._args));
            }
        }
    }

    public static WriteLine();
    public static WriteLine(value: any);
    public static WriteLine(str: string, ...args: any[]);
    public static WriteLine(...args: any[]) {
        if (args.length === 0) {
            const value: any = "\n";
            if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
                TuvalSettings.print(value);
            } else {
                console.log(value);
            }
        } else if (args.length === 1) {
            const value: any = args[0];
            if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
                TuvalSettings.print(TString.Format1(TString.ToString(value), ...args) + "\n");
            } else {
                console.log(TString.Format1(TString.ToString(value), ...args));
            }
        } else if (args.length > 1 && typeof args[0] === 'string') {
            const str: string = args[0];
            const _args: any[] = args.slice(1, arguments.length);
            if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
                TuvalSettings.print(TString.Format1(TString.ToString(str), ..._args) + "\n");
            } else {
                console.log(TString.Format1(TString.ToString(str), ..._args));
            }
        }
    }

    public static WriteHex(b: ByteArray) {
        if (typeof TuvalSettings !== 'undefined' && typeof TuvalSettings.print === 'function') {
            const hex = (d) => TuvalSettings.print((Object(d).buffer instanceof ArrayBuffer ? new Uint8Array(d.buffer) :
                typeof d === 'string' ? (new (TextEncoder as any)('utf-8')).encode(d) :
                    new Uint8ClampedArray(d)).reduce((p, c, i, a) => p + (i % 16 === 0 ? i.toString(16).padStart(6, 0) + '  ' : ' ') +
                        c.toString(16).padStart(2, 0) + (i === a.length - 1 || i % 16 === 15 ?
                            ' '.repeat((15 - i % 16) * 3) + Array.from(a).splice(i - i % 16, 16).reduce((r, v: any) =>
                                r + (v > 31 && v < 127 || v > 159 ? String.fromCharCode(v) : '.'), '  ') + '\n' : ''), ''));
            hex(b);
        } else {
            const hex = (d) => console.log((Object(d).buffer instanceof ArrayBuffer ? new Uint8Array(d.buffer) :
                typeof d === 'string' ? (new (TextEncoder as any)('utf-8')).encode(d) :
                    new Uint8ClampedArray(d)).reduce((p, c, i, a) => p + (i % 16 === 0 ? i.toString(16).padStart(6, 0) + '  ' : ' ') +
                        c.toString(16).padStart(2, 0) + (i === a.length - 1 || i % 16 === 15 ?
                            ' '.repeat((15 - i % 16) * 3) + Array.from(a).splice(i - i % 16, 16).reduce((r, v: any) =>
                                r + (v > 31 && v < 127 || v > 159 ? String.fromCharCode(v) : '.'), '  ') + '\n' : ''), ''));
            hex(b);
        }
    }
}
