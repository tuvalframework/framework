import { ByteArray } from './../float';
import { int, float, CharArray, char, New } from '../float';
import { TChar } from "../Extensions/TChar";
import { is } from './../is';
import { ArgumentException } from './../Exceptions/ArgumentException';
import { IFormatProvider } from './../IFormatProvider';
import { Exception } from '../Exception';
import { TBuffer } from '../IO';
import { StringComparison } from './StringComparison';
import { CultureInfo } from '../Globalization/CultureInfo';
import { CompareOptions } from '../Globalization/CompareInfo';
import { FormatException } from '../Extensions/FormatException';
import { ArgumentNullException } from '../Exceptions/ArgumentNullException';
import { Convert } from '../convert';
import { ArgumentOutOfRangeException } from '../Exceptions/ArgumentOutOfRangeException';
import { NotImplementedException } from '../Exceptions/NotImplementedException';
import { EventBus } from '../Events/EventBus';

//from underscore.string
var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
};

function multiArgs(args: any[], fn) {
    var result: any[] = [], i;
    for (i = 0; i < args.length; i++) {
        result.push(args[i]);
        if (fn) fn.call(args, args[i], i);
    }
    return result;
}

function escapeRegExp(s) {
    // most part from https://github.com/skulpt/skulpt/blob/ecaf75e69c2e539eff124b2ab45df0b01eaf2295/src/str.js#L242
    var c;
    var i;
    var ret: any[] = [];
    var re = /^[A-Za-z0-9]+$/;
    s = ensureString(s);
    for (i = 0; i < s.length; ++i) {
        c = s.charAt(i);

        if (re.test(c)) {
            ret.push(c);
        }
        else {
            if (c === "\\000") {
                ret.push("\\000");
            }
            else {
                ret.push("\\" + c);
            }
        }
    }
    return ret.join("");
}

function ensureString(string) {
    return string == null ? '' : '' + string;
}

//from underscore.string
const reversedEscapeChars: any = {};
for (let key in escapeChars) {
    reversedEscapeChars[escapeChars[key]] = key;
}

const ENTITIES: any = {
    "amp": "&",
    "gt": ">",
    "lt": "<",
    "quot": "\"",
    "apos": "'",
    "AElig": 198,
    "Aacute": 193,
    "Acirc": 194,
    "Agrave": 192,
    "Aring": 197,
    "Atilde": 195,
    "Auml": 196,
    "Ccedil": 199,
    "ETH": 208,
    "Eacute": 201,
    "Ecirc": 202,
    "Egrave": 200,
    "Euml": 203,
    "Iacute": 205,
    "Icirc": 206,
    "Igrave": 204,
    "Iuml": 207,
    "Ntilde": 209,
    "Oacute": 211,
    "Ocirc": 212,
    "Ograve": 210,
    "Oslash": 216,
    "Otilde": 213,
    "Ouml": 214,
    "THORN": 222,
    "Uacute": 218,
    "Ucirc": 219,
    "Ugrave": 217,
    "Uuml": 220,
    "Yacute": 221,
    "aacute": 225,
    "acirc": 226,
    "aelig": 230,
    "agrave": 224,
    "aring": 229,
    "atilde": 227,
    "auml": 228,
    "ccedil": 231,
    "eacute": 233,
    "ecirc": 234,
    "egrave": 232,
    "eth": 240,
    "euml": 235,
    "iacute": 237,
    "icirc": 238,
    "igrave": 236,
    "iuml": 239,
    "ntilde": 241,
    "oacute": 243,
    "ocirc": 244,
    "ograve": 242,
    "oslash": 248,
    "otilde": 245,
    "ouml": 246,
    "szlig": 223,
    "thorn": 254,
    "uacute": 250,
    "ucirc": 251,
    "ugrave": 249,
    "uuml": 252,
    "yacute": 253,
    "yuml": 255,
    "copy": 169,
    "reg": 174,
    "nbsp": 160,
    "iexcl": 161,
    "cent": 162,
    "pound": 163,
    "curren": 164,
    "yen": 165,
    "brvbar": 166,
    "sect": 167,
    "uml": 168,
    "ordf": 170,
    "laquo": 171,
    "not": 172,
    "shy": 173,
    "macr": 175,
    "deg": 176,
    "plusmn": 177,
    "sup1": 185,
    "sup2": 178,
    "sup3": 179,
    "acute": 180,
    "micro": 181,
    "para": 182,
    "middot": 183,
    "cedil": 184,
    "ordm": 186,
    "raquo": 187,
    "frac14": 188,
    "frac12": 189,
    "frac34": 190,
    "iquest": 191,
    "times": 215,
    "divide": 247,
    "OElig;": 338,
    "oelig;": 339,
    "Scaron;": 352,
    "scaron;": 353,
    "Yuml;": 376,
    "fnof;": 402,
    "circ;": 710,
    "tilde;": 732,
    "Alpha;": 913,
    "Beta;": 914,
    "Gamma;": 915,
    "Delta;": 916,
    "Epsilon;": 917,
    "Zeta;": 918,
    "Eta;": 919,
    "Theta;": 920,
    "Iota;": 921,
    "Kappa;": 922,
    "Lambda;": 923,
    "Mu;": 924,
    "Nu;": 925,
    "Xi;": 926,
    "Omicron;": 927,
    "Pi;": 928,
    "Rho;": 929,
    "Sigma;": 931,
    "Tau;": 932,
    "Upsilon;": 933,
    "Phi;": 934,
    "Chi;": 935,
    "Psi;": 936,
    "Omega;": 937,
    "alpha;": 945,
    "beta;": 946,
    "gamma;": 947,
    "delta;": 948,
    "epsilon;": 949,
    "zeta;": 950,
    "eta;": 951,
    "theta;": 952,
    "iota;": 953,
    "kappa;": 954,
    "lambda;": 955,
    "mu;": 956,
    "nu;": 957,
    "xi;": 958,
    "omicron;": 959,
    "pi;": 960,
    "rho;": 961,
    "sigmaf;": 962,
    "sigma;": 963,
    "tau;": 964,
    "upsilon;": 965,
    "phi;": 966,
    "chi;": 967,
    "psi;": 968,
    "omega;": 969,
    "thetasym;": 977,
    "upsih;": 978,
    "piv;": 982,
    "ensp;": 8194,
    "emsp;": 8195,
    "thinsp;": 8201,
    "zwnj;": 8204,
    "zwj;": 8205,
    "lrm;": 8206,
    "rlm;": 8207,
    "ndash;": 8211,
    "mdash;": 8212,
    "lsquo;": 8216,
    "rsquo;": 8217,
    "sbquo;": 8218,
    "ldquo;": 8220,
    "rdquo;": 8221,
    "bdquo;": 8222,
    "dagger;": 8224,
    "Dagger;": 8225,
    "bull;": 8226,
    "hellip;": 8230,
    "permil;": 8240,
    "prime;": 8242,
    "Prime;": 8243,
    "lsaquo;": 8249,
    "rsaquo;": 8250,
    "oline;": 8254,
    "frasl;": 8260,
    "euro;": 8364,
    "image;": 8465,
    "weierp;": 8472,
    "real;": 8476,
    "trade;": 8482,
    "alefsym;": 8501,
    "larr;": 8592,
    "uarr;": 8593,
    "rarr;": 8594,
    "darr;": 8595,
    "harr;": 8596,
    "crarr;": 8629,
    "lArr;": 8656,
    "uArr;": 8657,
    "rArr;": 8658,
    "dArr;": 8659,
    "hArr;": 8660,
    "forall;": 8704,
    "part;": 8706,
    "exist;": 8707,
    "empty;": 8709,
    "nabla;": 8711,
    "isin;": 8712,
    "notin;": 8713,
    "ni;": 8715,
    "prod;": 8719,
    "sum;": 8721,
    "minus;": 8722,
    "lowast;": 8727,
    "radic;": 8730,
    "prop;": 8733,
    "infin;": 8734,
    "ang;": 8736,
    "and;": 8743,
    "or;": 8744,
    "cap;": 8745,
    "cup;": 8746,
    "int;": 8747,
    "there4;": 8756,
    "sim;": 8764,
    "cong;": 8773,
    "asymp;": 8776,
    "ne;": 8800,
    "equiv;": 8801,
    "le;": 8804,
    "ge;": 8805,
    "sub;": 8834,
    "sup;": 8835,
    "nsub;": 8836,
    "sube;": 8838,
    "supe;": 8839,
    "oplus;": 8853,
    "otimes;": 8855,
    "perp;": 8869,
    "sdot;": 8901,
    "lceil;": 8968,
    "rceil;": 8969,
    "lfloor;": 8970,
    "rfloor;": 8971,
    "lang;": 9001,
    "rang;": 9002,
    "loz;": 9674,
    "spades;": 9824,
    "clubs;": 9827,
    "hearts;": 9829,
    "diams;": 9830
};

export class TString {
    private static readonly regexNumber = /{(\d+(:\w*)?)}/g;
    private static readonly regexObject = /{(\w+(:\w*)?)}/g;
    public static Empty: string = '';
    public static IsNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value === 'undefined') {
                return true;
            }

            return value.toString().replace(/\s/g, '').length < 1;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    public static StringArrayFromCharArray(value: char[]): string[] {
        return value.map(ch => String.fromCharCode(ch));
    }
    public static IndexOfAny(source: string, anyOf: string[], startIndex: number, count?: number) /*int*/ {
        startIndex = isNaN(startIndex) ? 0 : startIndex;
        if (startIndex < 0) {
            startIndex = 0;
        }
        if (count === undefined) {
            count = source.length;
        }
        count = isNaN(count) ? -1 : ((count >= 0) ? count : -1);

        if (anyOf != null && source != null && source != "") {
            var i /*int*/;
            var l /*int*/ = anyOf.length;
            var endIndex /*int*/;
            /* if ((count < 0) || (count > l - startIndex)) {
                endIndex = l - 1;
            }
            else {
                endIndex = startIndex + count - 1;
            } */
            for (i = 0; i <= anyOf.length - 1; i++) {
                const index = source.substring(startIndex).indexOf(anyOf[i]);
                if (index > - 1) {
                    return startIndex + index;
                }
            }
        }
        return - 1;
    }


    public static InternalAllocateStr(length: int): CharArray {
        return New.CharArray(length);
    }
    private static JoinUnchecked(separator: string, value: string[], startIndex: int, count: int): string {
        // Unchecked parameters
        // startIndex, count must be >= 0; startIndex + count must be <= value.length
        // separator and value must not be null

        let length: int = 0;
        let maxIndex: int = startIndex + count;
        // Precount the number of characters that the resulting string will have
        for (let i: int = startIndex; i < maxIndex; i++) {
            const s: string = value[i];
            if (s != null)
                length += s.length;
        }
        length += separator.length * (count - 1);
        if (length <= 0)
            return TString.Empty;

        const tmp: CharArray = TString.InternalAllocateStr(length);

        maxIndex--;
        //fixed(char * dest = tmp, sepsrc = separator) {
        const dest = tmp;
        // Copy each string from value except the last one and add a separator for each
        let pos: int = 0;
        for (let i: int = startIndex; i < maxIndex; i++) {
            const source: string = value[i];
            if (source != null) {
                if (source.length > 0) {
                    const src: CharArray = TString.ToCharArray(source);
                    //fixed(char * src = source)
                    TString.CharCopy(Convert.ToCharArray(dest, pos), src, source.length);
                    pos += source.length;
                }
            }
            if (separator.length > 0) {
                TString.CharCopy(Convert.ToCharArray(dest, pos), TString.ToCharArray(separator), separator.length);
                pos += separator.length;
            }
            //}


            // Append last string that does not get an additional separator
            const sourceLast: string = value[maxIndex];
            if (sourceLast != null) {
                if (sourceLast.length > 0) {
                    // fixed(char * src = sourceLast)
                    TString.CharCopy(Convert.ToCharArray(dest, pos), TString.ToCharArray(sourceLast), sourceLast.length);
                }
            }
        }
        return TString.FromCharArray(tmp);
    }

    public static TrimEnd(value: string): string {
        throw new NotImplementedException('');
    }
    private static CharCopy(dest: CharArray, src: CharArray, count: int): void {
        // Same rules as for memcpy, but with the premise that
        // chars can only be aligned to even addresses if their
        // enclosing types are correctly aligned
        const destB = Convert.ToByteArray(dest);
        const srcB = Convert.ToByteArray(src);
        const destS = Convert.ToShortArray(dest);
        const srcS = Convert.ToShortArray(src);
        /*  const destI = Convert.ToInt32Array(dest);
         const srcI = Convert.ToInt32Array(src); */

        let destIndex = 0;
        let srcIndex = 0;
        if (((Convert.ToInt32(destIndex) | Convert.ToInt32(srcIndex)) & 3) !== 0) {
            if ((Convert.ToInt32(destIndex) & 2) !== 0 && (Convert.ToInt32(srcIndex) & 2) !== 0 && count > 0) {
                destS[destIndex] = srcS[srcIndex];
                destIndex++;
                srcIndex++;
                count--;
            }
            if (((Convert.ToInt32(destIndex) | Convert.ToInt32(srcIndex)) & 2) !== 0) {
                TString.memcpy2(destB, srcB, count * 2);
                return;
            }
        }
        TString.memcpy4(destB, srcB, count * 2);
    }

    private static memcpy4(dest: ByteArray, src: ByteArray, size: int): void {
        /*while (size >= 32) {
            // using long is better than int and slower than double
            // FIXME: enable this only on correct alignment or on platforms
            // that can tolerate unaligned reads/writes of doubles
            ((double*)dest) [0] = ((double*)src) [0];
            ((double*)dest) [1] = ((double*)src) [1];
            ((double*)dest) [2] = ((double*)src) [2];
            ((double*)dest) [3] = ((double*)src) [3];
            dest += 32;
            src += 32;
            size -= 32;
        }*/
        const destI = Convert.ToInt32Array(dest);
        const srcI = Convert.ToInt32Array(src);
        let destIndex = 0;
        let srcIndex = 0;
        while (size >= 16) {
            destI[destIndex + 0] = srcI[srcIndex + 0];
            destI[destIndex + 1] = srcI[srcIndex + 1];
            destI[destIndex + 2] = srcI[srcIndex + 2];
            destI[destIndex + 3] = srcI[srcIndex + 3];
            destIndex += 16;
            srcIndex += 16;
            size -= 16;
        }
        while (size >= 4) {
            destI[destIndex + 0] = srcI[srcIndex + 0];
            destIndex += 4;
            srcIndex += 4;
            size -= 4;
        }
        while (size > 0) {
            dest[destIndex + 0] = src[srcIndex + 0];
            destIndex += 1;
            srcIndex += 1;
            --size;
        }
    }

    private static memcpy2(dest: ByteArray, src: ByteArray, size: int): void {
        const destS = Convert.ToShortArray(dest);
        const srcS = Convert.ToShortArray(src);
        let destIndex = 0;
        let srcIndex = 0;
        while (size >= 8) {
            destS[destIndex + 0] = srcS[srcIndex + 0];
            destS[destIndex + 1] = srcS[srcIndex + 1];
            destS[destIndex + 2] = srcS[srcIndex + 2];
            destS[destIndex + 3] = srcS[srcIndex + 3];
            destIndex += 8;
            srcIndex += 8;
            size -= 8;
        }
        while (size >= 2) {
            destS[destIndex + 0] = srcS[srcIndex + 0];
            destIndex += 2;
            srcIndex += 2;
            size -= 2;
        }
        if (size > 0)
            dest[destIndex + 0] = src[srcIndex + 0];
    }

    public static _Join(separator: string, value: string[], startIndex: int, count: int): string {
        if (value == null)
            throw new ArgumentNullException("value");
        if (startIndex < 0)
            throw new ArgumentOutOfRangeException("startIndex", "< 0");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count", "< 0");
        if (startIndex > value.length - count)
            throw new ArgumentOutOfRangeException("startIndex", "startIndex + count > value.length");

        if (startIndex == value.length)
            return TString.Empty;
        if (separator == null)
            separator = TString.Empty;

        return TString.JoinUnchecked(separator, value, startIndex, count);
    }

    public static Join(delimiter: string, ...args: (string | object | Array<any>)[]): string {
        try {
            let firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = TString.Empty;
                let count = 0;

                for (let i = 0; i < firstArg.length; i++) {
                    let current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    }
                    else {
                        tempString += current;
                    }
                }

                return tempString;
            }
            else if (typeof firstArg === 'object') {
                let tempString = TString.Empty;
                let objectArg = firstArg;
                let keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += (<any>objectArg)[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }

            let stringArray = <string[]>args;

            return TString.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    }

    public static Format1(format: string, ...args: any[]): string {
        if (format == null) {
            throw new ArgumentNullException("format");
        }
        /*
        Contract.Ensures(Contract.Result<StringBuilder>() != null);
        Contract.EndContractBlock(); */
        let temp: string = '';
        function Append(ch: char) {
            temp += String.fromCharCode(ch);
        }
        function Append1(ch: char, pad: number) {
            for (let i = 0; i < pad; i++) {
                temp += String.fromCharCode(ch);
            }
        }
        function Append2(s: string) {
            temp += s;
        }
        let pos: int = 0;
        const len: int = format.length;
        let ch: char = '\\x0'.charCodeAt(0);

        /*   ICustomFormatter cf = null;
          if (provider != null) {
              cf = (ICustomFormatter)provider.GetFormat(typeof(ICustomFormatter));
          } */

        while (true) {
            let p: int = pos;
            let i: int = pos;
            while (pos < len) {
                ch = format[pos].charCodeAt(0);

                pos++;
                if (ch === '}'.charCodeAt(0)) {
                    if (pos < len && format[pos] == '}') // Treat as escape character for }}
                        pos++;
                    else
                        throw new Exception('Format error');
                }

                if (ch === '{'.charCodeAt(0)) {
                    if (pos < len && format[pos] === '{') // Treat as escape character for {{
                        pos++;
                    else {
                        pos--;
                        break;
                    }
                }

                Append(ch);
            }

            if (pos == len) break;
            pos++;
            if (pos === len || (ch = format[pos].charCodeAt(0)) < '0'.charCodeAt(0) || ch > '9'.charCodeAt(0)) {
                throw new Exception('Format Error');
            }
            let index: int = 0;
            do {
                index = index * 10 + ch - '0'.charCodeAt(0);
                pos++;
                if (pos === len) throw new Exception('Format Error');
                ch = format[pos].charCodeAt(0);
            } while (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0) && index < 1000000);
            if (index >= args.length) throw new FormatException("Format_IndexOutOfRange");
            while (pos < len && (ch = format[pos].charCodeAt(0)) === ' '.charCodeAt(0)) pos++;
            let leftJustify: boolean = false;
            let width: int = 0;
            if (ch === ','.charCodeAt(0)) {
                pos++;
                while (pos < len && format[pos] === ' ') {
                    pos++;
                }

                if (pos == len) {
                    throw new Exception('Format Error');
                }
                ch = format[pos].charCodeAt(0);
                if (ch === '-'.charCodeAt(0)) {
                    leftJustify = true;
                    pos++;
                    if (pos == len) {
                        throw new Exception('Format Error');
                    }
                    ch = format[pos].charCodeAt(0);
                }
                if (ch < '0'.charCodeAt(0) || ch > '9'.charCodeAt(0)) {
                    throw new Exception('Format Error');
                }
                do {
                    width = width * 10 + ch - '0'.charCodeAt(0);
                    pos++;
                    if (pos == len) {
                        throw new Exception('Format Error');
                    }
                    ch = format[pos].charCodeAt(0);
                } while (ch >= '0'.charCodeAt(0) && ch <= '9'.charCodeAt(0) && width < 1000000);
            }

            while (pos < len && (ch = format[pos].charCodeAt(0)) === ' '.charCodeAt(0)) {
                pos++;
            }
            const arg: any = args[index];
            let fmt: string = '';
            if (ch === ':'.charCodeAt(0)) {
                pos++;
                p = pos;
                i = pos;
                while (true) {
                    if (pos === len) throw new Exception('Format Error');
                    ch = format[pos].charCodeAt(0);
                    pos++;
                    if (ch === '{'.charCodeAt(0)) {
                        if (pos < len && format[pos] === '{')  // Treat as escape character for {{
                            pos++;
                        else
                            throw new Exception('Format Error');
                    }
                    else if (ch === '}'.charCodeAt(0)) {
                        if (pos < len && format[pos] === '}')  // Treat as escape character for }}
                            pos++;
                        else {
                            pos--;
                            break;
                        }
                    }

                    /*  if (fmt == null) {
                         fmt = new StringBuilder();
                     } */
                    fmt += String.fromCharCode(ch);
                }
            }
            if (ch !== '}'.charCodeAt(0)) {
                throw new Exception('Format Error');
            }
            pos++;
            let sFmt: string = null as any;
            let s: string = null as any;
            /*   if (cf != null) {
                  if (fmt != null) {
                      sFmt = fmt.ToString();
                  }
                  s = cf.Format(sFmt, arg, provider);
              } */

            if (s == null) {
                /*   IFormattable formattableArg = arg as IFormattable;


                  if (formattableArg != null) {
                      if (sFmt == null && fmt != null) {
                          sFmt = fmt.ToString();
                      }

                      s = formattableArg.ToString(sFmt, provider);
                  } else if (arg != null) { */
                s = arg == null ? '' : arg.toString();
                //}
            }

            if (s == null) {
                s = TString.Empty;
            }
            const pad: int = width - s.length;
            if (!leftJustify && pad > 0) {
                Append1(' '.charCodeAt(0), pad);
            }
            Append2(s);
            if (leftJustify && pad > 0) Append1(' '.charCodeAt(0), pad);
        }
        return temp;
    }
    public static Format(format: string, ...args: any[]): string {
        if (typeof format !== 'string') {
            format = (format as any).toString();
        }
        try {
            if (format.match(TString.regexNumber)) {
                return TString._format(TString.regexNumber, format, args);
            }

            if (format.match(TString.regexObject)) {
                return TString._format(TString.regexObject, format, args, true);
            }

            return format;
        }
        catch (e) {
            console.log(e);
            return String.Empty;
        }
    }

    private static _format(regex: any, format: string, args: any, parseByObject: boolean = false): string {
        return format.replace(regex, function (match, x) { //0
            let s = match.split(':');
            if (s.length > 1) {
                x = s[0].replace('{', '');
                match = s[1].replace('}', ''); //U
            }

            let arg;
            if (parseByObject) {
                arg = args[0][x];
            }
            else {
                arg = args[x];
            }

            if (arg == null || arg === undefined || match.match(/{\d+}/)) {
                return arg;
            }

            arg = TString.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : String.Empty;
        });
    }

    private static parsePattern(match: 'L' | 'U' | 'd' | 's' | 'n' | string, arg: string | Date | number | any): string {
        switch (match) {
            case 'L': {
                arg = arg.toLowerCase();
                return arg;
            }
            case 'U': {
                arg = arg.toUpperCase();
                return arg;
            }
            case 'd': {
                if (typeof (arg) === 'string') {
                    return TString.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return TString.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return TString.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return TString.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            }
            case 'n': {//Tausender Trennzeichen
                if (typeof (arg) !== "string")
                    arg = arg.toString();
                let replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }

                let numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;

                if (numberparts.length > 1) {
                    parts = [TString.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }

                let integer = parts[0];

                var mod = integer.length % 3;
                var output = (mod > 0 ? (integer.substring(0, mod)) : String.Empty);
                var firstGroup = output;
                var remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + TString.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            }
            default: {
                break;
            }
        }

        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !TString.IsNullOrWhiteSpace(arg)) {
            return TString.formatNumber(arg, match);
        }

        return arg;
    }

    private static getDisplayDateFromString(input: string): string {
        let splitted: string[];
        splitted = input.split('-');

        if (splitted.length <= 1) {
            return input;
        }

        let day = splitted[splitted.length - 1];
        let month = splitted[splitted.length - 2];
        let year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];

        return `${day}.${month}.${year}`;
    }

    private static getSortableDateFromString(input: string): string {
        let splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }

        let times = splitted[splitted.length - 1].split(' ');
        let time = String.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }

        let year = splitted[splitted.length - 1].split(' ')[0];
        let month = splitted[splitted.length - 2];
        let day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`

        if (!TString.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += `T${time}`;
        }
        else {
            result += "T00:00:00";
        }

        return result;
    }

    private static formatNumber(input: number, formatTemplate: string): string {
        let count = formatTemplate.length;
        let stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }

        let remainingCount = count - stringValue.length;
        remainingCount += 1; //Array must have an extra entry

        return new Array(remainingCount).join('0') + stringValue;
    }

    private static join(delimiter: string, ...args: string[]): string {
        let temp = String.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && TString.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }

            let arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (TString.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }

                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }

        return temp;
    }

    public static Concat(...args: any[]): string {
        let tempStr: string = '';
        for (let i = 0; i < args.length; i++) {
            tempStr += args[i].toString();
        }
        return tempStr;
    }

    private static IsBOMWhitespace(c: string): boolean {
        return false;
    }

    public static Trim(str: string, ...trimChars: string[]): string {
        function createTrimmedString(start: int, end: int) {
            const int32: int = end - start + 1;
            if (int32 === this.Length) {
                return this;
            }
            if (int32 === 0) {
                return TString.Empty;
            }
            return str.substring(start, int32);
        }

        function trimHelper1(trimType: int): string {
            let length: int = str.length - 1;
            let int32 = 0;
            if (trimType !== 1) {
                int32 = 0;
                while (int32 < this.Length && (TChar.IsWhiteSpace(this[int32]) || TString.IsBOMWhitespace(str[int32]))) {
                    int32++;
                }
            }
            if (trimType !== 0) {
                length = str.length - 1;
                while (length >= int32 && (TChar.IsWhiteSpace(this[length]) || TString.IsBOMWhitespace(this[int32]))) {
                    length--;
                }
            }
            return createTrimmedString(int32, length);
        }
        function trimHelper2(_trimChars: string[], trimType: int): string {
            let length: int = str.length - 1;
            let i: int = 0;
            if (trimType !== 1) {
                for (i = 0; i < str.length; i++) {
                    let int32: int = 0;
                    const chr: string = this[i];
                    int32 = 0;
                    while (int32 < _trimChars.length && _trimChars[int32] !== chr) {
                        int32++;
                    }
                    if (int32 === _trimChars.length) {
                        break;
                    }
                }
            }
            if (trimType !== 0) {
                for (length = this.Length - 1; length >= i; length--) {
                    let int321: int = 0;
                    const chr1: string = str[length];
                    int321 = 0;
                    while (int321 < _trimChars.length && _trimChars[int321] !== chr1) {
                        int321++;
                    }
                    if (int321 === _trimChars.length) {
                        break;
                    }
                }
            }
            return createTrimmedString(i, length);
        }



        if (trimChars == null || trimChars.length === 0) {
            return trimHelper1(2);
        }
        return trimHelper2(trimChars, 2);
    }

    public static GetHashCode(str: string): number {
        let h: number = (str as any).hash || 0;
        if (h === 0 && str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                h = 31 * h + str.charCodeAt(i);
            }
            //this.hash = h;
        }
        return h;
    }
    /* public static Format(str: string, ...args: any[]): string {
        var formatted: string = str;
        for (var i = 0; i < args.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, args[i]);
        }
        return formatted;
    } */

    /**
     * Extracts a string between left and right strings.
        *
        * Example:

        * S('<a>foo</a>').between('<a>', '</a>').s // => 'foo'
        * S('<a>foo</a></a>').between('<a>', '</a>').s // => 'foo'
        * S('<a><a>foo</a></a>').between('<a>', '</a>').s // => '<a>foo'
        * S('<a>foo').between('<a>', '</a>').s // => ''
        * S('Some strings } are very {weird}, dont you think?').between('{', '}').s // => 'weird'
        * S('This is a test string').between('test').s // => ' string'
        * S('This is a test string').between('', 'test').s // => 'This is a '
     * @param s
     * @param left
     * @param right
     */
    public static Between(s: string, left: string, right: string) {
        const startPos = s.indexOf(left);
        const endPos = s.indexOf(right, startPos + left.length);
        if (endPos === -1 && right != null) {
            return TString.Empty;
        }
        else if (endPos === -1 && right == null) {
            return s.substring(startPos + left.length);
        }
        else {
            return s.slice(startPos + left.length, endPos);
        }
    }

    public static Camelize(s: string): string {
        s = TString.Trim(s);
        s = s.replace(/(\-|_|\s)+(.)?/g, function (mathc, sep, c) {
            return (c ? c.toUpperCase() : '');
        });
        return s;
    }
    public static Capitalize(s: string): string {
        return s.substr(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public static CharAt(s: string, index: int): string {
        return s.charAt(index);
    }

    public static ChompLeft(s: string, prefix: string): string {
        if (s.indexOf(prefix) === 0) {
            s = s.slice(prefix.length);
        }
        return s;
    }
    public static ChompRight(s: string, suffix: string) {
        if (s.endsWith(suffix)) {
            s = s.slice(0, s.length - suffix.length);
        }
        return s;
    }

    //#thanks Google
    public static CollapseWhitespace(s: string): string {
        s = s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
        return s;
    }

    public static Contains(s: string, ss: string): boolean {
        return s.indexOf(ss) >= 0;
    }

    public static Count(s: string, ss: string): int {
        function count(self, substr): int {
            let count: int = 0
            var pos = self.indexOf(substr)

            while (pos >= 0) {
                count += 1
                pos = self.indexOf(substr, pos + 1)
            }

            return count;
        }
        return count(s, ss);
    }
    public static Dasherize(s: string): string {
        s = TString.Trim(s).replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
        return s;
    }

    public static EqualsIgnoreCase(s: string, prefix: string): boolean {
        return s.toLowerCase() === prefix.toLowerCase();
    }

    public static Latinise(s: string): string {
        // from http://semplicewebsites.com/removing-accents-javascript
        const latin_map = { "Á": "A", "Ă": "A", "Ắ": "A", "Ặ": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ǎ": "A", "Â": "A", "Ấ": "A", "Ậ": "A", "Ầ": "A", "Ẩ": "A", "Ẫ": "A", "Ä": "A", "Ǟ": "A", "Ȧ": "A", "Ǡ": "A", "Ạ": "A", "Ȁ": "A", "À": "A", "Ả": "A", "Ȃ": "A", "Ā": "A", "Ą": "A", "Å": "A", "Ǻ": "A", "Ḁ": "A", "Ⱥ": "A", "Ã": "A", "Ꜳ": "AA", "Æ": "AE", "Ǽ": "AE", "Ǣ": "AE", "Ꜵ": "AO", "Ꜷ": "AU", "Ꜹ": "AV", "Ꜻ": "AV", "Ꜽ": "AY", "Ḃ": "B", "Ḅ": "B", "Ɓ": "B", "Ḇ": "B", "Ƀ": "B", "Ƃ": "B", "Ć": "C", "Č": "C", "Ç": "C", "Ḉ": "C", "Ĉ": "C", "Ċ": "C", "Ƈ": "C", "Ȼ": "C", "Ď": "D", "Ḑ": "D", "Ḓ": "D", "Ḋ": "D", "Ḍ": "D", "Ɗ": "D", "Ḏ": "D", "ǲ": "D", "ǅ": "D", "Đ": "D", "Ƌ": "D", "Ǳ": "DZ", "Ǆ": "DZ", "É": "E", "Ĕ": "E", "Ě": "E", "Ȩ": "E", "Ḝ": "E", "Ê": "E", "Ế": "E", "Ệ": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ḙ": "E", "Ë": "E", "Ė": "E", "Ẹ": "E", "Ȅ": "E", "È": "E", "Ẻ": "E", "Ȇ": "E", "Ē": "E", "Ḗ": "E", "Ḕ": "E", "Ę": "E", "Ɇ": "E", "Ẽ": "E", "Ḛ": "E", "Ꝫ": "ET", "Ḟ": "F", "Ƒ": "F", "Ǵ": "G", "Ğ": "G", "Ǧ": "G", "Ģ": "G", "Ĝ": "G", "Ġ": "G", "Ɠ": "G", "Ḡ": "G", "Ǥ": "G", "Ḫ": "H", "Ȟ": "H", "Ḩ": "H", "Ĥ": "H", "Ⱨ": "H", "Ḧ": "H", "Ḣ": "H", "Ḥ": "H", "Ħ": "H", "Í": "I", "Ĭ": "I", "Ǐ": "I", "Î": "I", "Ï": "I", "Ḯ": "I", "İ": "I", "Ị": "I", "Ȉ": "I", "Ì": "I", "Ỉ": "I", "Ȋ": "I", "Ī": "I", "Į": "I", "Ɨ": "I", "Ĩ": "I", "Ḭ": "I", "Ꝺ": "D", "Ꝼ": "F", "Ᵹ": "G", "Ꞃ": "R", "Ꞅ": "S", "Ꞇ": "T", "Ꝭ": "IS", "Ĵ": "J", "Ɉ": "J", "Ḱ": "K", "Ǩ": "K", "Ķ": "K", "Ⱪ": "K", "Ꝃ": "K", "Ḳ": "K", "Ƙ": "K", "Ḵ": "K", "Ꝁ": "K", "Ꝅ": "K", "Ĺ": "L", "Ƚ": "L", "Ľ": "L", "Ļ": "L", "Ḽ": "L", "Ḷ": "L", "Ḹ": "L", "Ⱡ": "L", "Ꝉ": "L", "Ḻ": "L", "Ŀ": "L", "Ɫ": "L", "ǈ": "L", "Ł": "L", "Ǉ": "LJ", "Ḿ": "M", "Ṁ": "M", "Ṃ": "M", "Ɱ": "M", "Ń": "N", "Ň": "N", "Ņ": "N", "Ṋ": "N", "Ṅ": "N", "Ṇ": "N", "Ǹ": "N", "Ɲ": "N", "Ṉ": "N", "Ƞ": "N", "ǋ": "N", "Ñ": "N", "Ǌ": "NJ", "Ó": "O", "Ŏ": "O", "Ǒ": "O", "Ô": "O", "Ố": "O", "Ộ": "O", "Ồ": "O", "Ổ": "O", "Ỗ": "O", "Ö": "O", "Ȫ": "O", "Ȯ": "O", "Ȱ": "O", "Ọ": "O", "Ő": "O", "Ȍ": "O", "Ò": "O", "Ỏ": "O", "Ơ": "O", "Ớ": "O", "Ợ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ȏ": "O", "Ꝋ": "O", "Ꝍ": "O", "Ō": "O", "Ṓ": "O", "Ṑ": "O", "Ɵ": "O", "Ǫ": "O", "Ǭ": "O", "Ø": "O", "Ǿ": "O", "Õ": "O", "Ṍ": "O", "Ṏ": "O", "Ȭ": "O", "Ƣ": "OI", "Ꝏ": "OO", "Ɛ": "E", "Ɔ": "O", "Ȣ": "OU", "Ṕ": "P", "Ṗ": "P", "Ꝓ": "P", "Ƥ": "P", "Ꝕ": "P", "Ᵽ": "P", "Ꝑ": "P", "Ꝙ": "Q", "Ꝗ": "Q", "Ŕ": "R", "Ř": "R", "Ŗ": "R", "Ṙ": "R", "Ṛ": "R", "Ṝ": "R", "Ȑ": "R", "Ȓ": "R", "Ṟ": "R", "Ɍ": "R", "Ɽ": "R", "Ꜿ": "C", "Ǝ": "E", "Ś": "S", "Ṥ": "S", "Š": "S", "Ṧ": "S", "Ş": "S", "Ŝ": "S", "Ș": "S", "Ṡ": "S", "Ṣ": "S", "Ṩ": "S", "ẞ": "SS", "Ť": "T", "Ţ": "T", "Ṱ": "T", "Ț": "T", "Ⱦ": "T", "Ṫ": "T", "Ṭ": "T", "Ƭ": "T", "Ṯ": "T", "Ʈ": "T", "Ŧ": "T", "Ɐ": "A", "Ꞁ": "L", "Ɯ": "M", "Ʌ": "V", "Ꜩ": "TZ", "Ú": "U", "Ŭ": "U", "Ǔ": "U", "Û": "U", "Ṷ": "U", "Ü": "U", "Ǘ": "U", "Ǚ": "U", "Ǜ": "U", "Ǖ": "U", "Ṳ": "U", "Ụ": "U", "Ű": "U", "Ȕ": "U", "Ù": "U", "Ủ": "U", "Ư": "U", "Ứ": "U", "Ự": "U", "Ừ": "U", "Ử": "U", "Ữ": "U", "Ȗ": "U", "Ū": "U", "Ṻ": "U", "Ų": "U", "Ů": "U", "Ũ": "U", "Ṹ": "U", "Ṵ": "U", "Ꝟ": "V", "Ṿ": "V", "Ʋ": "V", "Ṽ": "V", "Ꝡ": "VY", "Ẃ": "W", "Ŵ": "W", "Ẅ": "W", "Ẇ": "W", "Ẉ": "W", "Ẁ": "W", "Ⱳ": "W", "Ẍ": "X", "Ẋ": "X", "Ý": "Y", "Ŷ": "Y", "Ÿ": "Y", "Ẏ": "Y", "Ỵ": "Y", "Ỳ": "Y", "Ƴ": "Y", "Ỷ": "Y", "Ỿ": "Y", "Ȳ": "Y", "Ɏ": "Y", "Ỹ": "Y", "Ź": "Z", "Ž": "Z", "Ẑ": "Z", "Ⱬ": "Z", "Ż": "Z", "Ẓ": "Z", "Ȥ": "Z", "Ẕ": "Z", "Ƶ": "Z", "Ĳ": "IJ", "Œ": "OE", "ᴀ": "A", "ᴁ": "AE", "ʙ": "B", "ᴃ": "B", "ᴄ": "C", "ᴅ": "D", "ᴇ": "E", "ꜰ": "F", "ɢ": "G", "ʛ": "G", "ʜ": "H", "ɪ": "I", "ʁ": "R", "ᴊ": "J", "ᴋ": "K", "ʟ": "L", "ᴌ": "L", "ᴍ": "M", "ɴ": "N", "ᴏ": "O", "ɶ": "OE", "ᴐ": "O", "ᴕ": "OU", "ᴘ": "P", "ʀ": "R", "ᴎ": "N", "ᴙ": "R", "ꜱ": "S", "ᴛ": "T", "ⱻ": "E", "ᴚ": "R", "ᴜ": "U", "ᴠ": "V", "ᴡ": "W", "ʏ": "Y", "ᴢ": "Z", "á": "a", "ă": "a", "ắ": "a", "ặ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ǎ": "a", "â": "a", "ấ": "a", "ậ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ä": "a", "ǟ": "a", "ȧ": "a", "ǡ": "a", "ạ": "a", "ȁ": "a", "à": "a", "ả": "a", "ȃ": "a", "ā": "a", "ą": "a", "ᶏ": "a", "ẚ": "a", "å": "a", "ǻ": "a", "ḁ": "a", "ⱥ": "a", "ã": "a", "ꜳ": "aa", "æ": "ae", "ǽ": "ae", "ǣ": "ae", "ꜵ": "ao", "ꜷ": "au", "ꜹ": "av", "ꜻ": "av", "ꜽ": "ay", "ḃ": "b", "ḅ": "b", "ɓ": "b", "ḇ": "b", "ᵬ": "b", "ᶀ": "b", "ƀ": "b", "ƃ": "b", "ɵ": "o", "ć": "c", "č": "c", "ç": "c", "ḉ": "c", "ĉ": "c", "ɕ": "c", "ċ": "c", "ƈ": "c", "ȼ": "c", "ď": "d", "ḑ": "d", "ḓ": "d", "ȡ": "d", "ḋ": "d", "ḍ": "d", "ɗ": "d", "ᶑ": "d", "ḏ": "d", "ᵭ": "d", "ᶁ": "d", "đ": "d", "ɖ": "d", "ƌ": "d", "ı": "i", "ȷ": "j", "ɟ": "j", "ʄ": "j", "ǳ": "dz", "ǆ": "dz", "é": "e", "ĕ": "e", "ě": "e", "ȩ": "e", "ḝ": "e", "ê": "e", "ế": "e", "ệ": "e", "ề": "e", "ể": "e", "ễ": "e", "ḙ": "e", "ë": "e", "ė": "e", "ẹ": "e", "ȅ": "e", "è": "e", "ẻ": "e", "ȇ": "e", "ē": "e", "ḗ": "e", "ḕ": "e", "ⱸ": "e", "ę": "e", "ᶒ": "e", "ɇ": "e", "ẽ": "e", "ḛ": "e", "ꝫ": "et", "ḟ": "f", "ƒ": "f", "ᵮ": "f", "ᶂ": "f", "ǵ": "g", "ğ": "g", "ǧ": "g", "ģ": "g", "ĝ": "g", "ġ": "g", "ɠ": "g", "ḡ": "g", "ᶃ": "g", "ǥ": "g", "ḫ": "h", "ȟ": "h", "ḩ": "h", "ĥ": "h", "ⱨ": "h", "ḧ": "h", "ḣ": "h", "ḥ": "h", "ɦ": "h", "ẖ": "h", "ħ": "h", "ƕ": "hv", "í": "i", "ĭ": "i", "ǐ": "i", "î": "i", "ï": "i", "ḯ": "i", "ị": "i", "ȉ": "i", "ì": "i", "ỉ": "i", "ȋ": "i", "ī": "i", "į": "i", "ᶖ": "i", "ɨ": "i", "ĩ": "i", "ḭ": "i", "ꝺ": "d", "ꝼ": "f", "ᵹ": "g", "ꞃ": "r", "ꞅ": "s", "ꞇ": "t", "ꝭ": "is", "ǰ": "j", "ĵ": "j", "ʝ": "j", "ɉ": "j", "ḱ": "k", "ǩ": "k", "ķ": "k", "ⱪ": "k", "ꝃ": "k", "ḳ": "k", "ƙ": "k", "ḵ": "k", "ᶄ": "k", "ꝁ": "k", "ꝅ": "k", "ĺ": "l", "ƚ": "l", "ɬ": "l", "ľ": "l", "ļ": "l", "ḽ": "l", "ȴ": "l", "ḷ": "l", "ḹ": "l", "ⱡ": "l", "ꝉ": "l", "ḻ": "l", "ŀ": "l", "ɫ": "l", "ᶅ": "l", "ɭ": "l", "ł": "l", "ǉ": "lj", "ſ": "s", "ẜ": "s", "ẛ": "s", "ẝ": "s", "ḿ": "m", "ṁ": "m", "ṃ": "m", "ɱ": "m", "ᵯ": "m", "ᶆ": "m", "ń": "n", "ň": "n", "ņ": "n", "ṋ": "n", "ȵ": "n", "ṅ": "n", "ṇ": "n", "ǹ": "n", "ɲ": "n", "ṉ": "n", "ƞ": "n", "ᵰ": "n", "ᶇ": "n", "ɳ": "n", "ñ": "n", "ǌ": "nj", "ó": "o", "ŏ": "o", "ǒ": "o", "ô": "o", "ố": "o", "ộ": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ö": "o", "ȫ": "o", "ȯ": "o", "ȱ": "o", "ọ": "o", "ő": "o", "ȍ": "o", "ò": "o", "ỏ": "o", "ơ": "o", "ớ": "o", "ợ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ȏ": "o", "ꝋ": "o", "ꝍ": "o", "ⱺ": "o", "ō": "o", "ṓ": "o", "ṑ": "o", "ǫ": "o", "ǭ": "o", "ø": "o", "ǿ": "o", "õ": "o", "ṍ": "o", "ṏ": "o", "ȭ": "o", "ƣ": "oi", "ꝏ": "oo", "ɛ": "e", "ᶓ": "e", "ɔ": "o", "ᶗ": "o", "ȣ": "ou", "ṕ": "p", "ṗ": "p", "ꝓ": "p", "ƥ": "p", "ᵱ": "p", "ᶈ": "p", "ꝕ": "p", "ᵽ": "p", "ꝑ": "p", "ꝙ": "q", "ʠ": "q", "ɋ": "q", "ꝗ": "q", "ŕ": "r", "ř": "r", "ŗ": "r", "ṙ": "r", "ṛ": "r", "ṝ": "r", "ȑ": "r", "ɾ": "r", "ᵳ": "r", "ȓ": "r", "ṟ": "r", "ɼ": "r", "ᵲ": "r", "ᶉ": "r", "ɍ": "r", "ɽ": "r", "ↄ": "c", "ꜿ": "c", "ɘ": "e", "ɿ": "r", "ś": "s", "ṥ": "s", "š": "s", "ṧ": "s", "ş": "s", "ŝ": "s", "ș": "s", "ṡ": "s", "ṣ": "s", "ṩ": "s", "ʂ": "s", "ᵴ": "s", "ᶊ": "s", "ȿ": "s", "ɡ": "g", "ß": "ss", "ᴑ": "o", "ᴓ": "o", "ᴝ": "u", "ť": "t", "ţ": "t", "ṱ": "t", "ț": "t", "ȶ": "t", "ẗ": "t", "ⱦ": "t", "ṫ": "t", "ṭ": "t", "ƭ": "t", "ṯ": "t", "ᵵ": "t", "ƫ": "t", "ʈ": "t", "ŧ": "t", "ᵺ": "th", "ɐ": "a", "ᴂ": "ae", "ǝ": "e", "ᵷ": "g", "ɥ": "h", "ʮ": "h", "ʯ": "h", "ᴉ": "i", "ʞ": "k", "ꞁ": "l", "ɯ": "m", "ɰ": "m", "ᴔ": "oe", "ɹ": "r", "ɻ": "r", "ɺ": "r", "ⱹ": "r", "ʇ": "t", "ʌ": "v", "ʍ": "w", "ʎ": "y", "ꜩ": "tz", "ú": "u", "ŭ": "u", "ǔ": "u", "û": "u", "ṷ": "u", "ü": "u", "ǘ": "u", "ǚ": "u", "ǜ": "u", "ǖ": "u", "ṳ": "u", "ụ": "u", "ű": "u", "ȕ": "u", "ù": "u", "ủ": "u", "ư": "u", "ứ": "u", "ự": "u", "ừ": "u", "ử": "u", "ữ": "u", "ȗ": "u", "ū": "u", "ṻ": "u", "ų": "u", "ᶙ": "u", "ů": "u", "ũ": "u", "ṹ": "u", "ṵ": "u", "ᵫ": "ue", "ꝸ": "um", "ⱴ": "v", "ꝟ": "v", "ṿ": "v", "ʋ": "v", "ᶌ": "v", "ⱱ": "v", "ṽ": "v", "ꝡ": "vy", "ẃ": "w", "ŵ": "w", "ẅ": "w", "ẇ": "w", "ẉ": "w", "ẁ": "w", "ⱳ": "w", "ẘ": "w", "ẍ": "x", "ẋ": "x", "ᶍ": "x", "ý": "y", "ŷ": "y", "ÿ": "y", "ẏ": "y", "ỵ": "y", "ỳ": "y", "ƴ": "y", "ỷ": "y", "ỿ": "y", "ȳ": "y", "ẙ": "y", "ɏ": "y", "ỹ": "y", "ź": "z", "ž": "z", "ẑ": "z", "ʑ": "z", "ⱬ": "z", "ż": "z", "ẓ": "z", "ȥ": "z", "ẕ": "z", "ᵶ": "z", "ᶎ": "z", "ʐ": "z", "ƶ": "z", "ɀ": "z", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬁ": "fi", "ﬂ": "fl", "ĳ": "ij", "œ": "oe", "ﬆ": "st", "ₐ": "a", "ₑ": "e", "ᵢ": "i", "ⱼ": "j", "ₒ": "o", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ₓ": "x" };

        s = s.replace(/[^A-Za-z0-9\[\] ]/g, function (x) {
            return latin_map[x] || x;
        });
        return s;
    }

    public static DecodeHtmlEntities(s: string): string { //https://github.com/substack/node-ent/blob/master/index.js
        s = s.replace(/&#(\d+);?/g, function (_, code) {
            return String.fromCharCode(code);
        })
            .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
                return String.fromCharCode(parseInt(hex, 16));
            })
            .replace(/&([^;\W]+;?)/g, function (m, e) {
                var ee = e.replace(/;$/, '');
                var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);

                if (typeof target === 'number') {
                    return String.fromCharCode(target);
                }
                else if (typeof target === 'string') {
                    return target;
                }
                else {
                    return m;
                }
            })

        return s;
    }

    public static Clone(value: string[]): string[];
    public static Clone(value: string): string;
    public static Clone(...args: any[]): string | string[] {
        if (args.length === 1 && typeof args[0] === 'string') {
            const value: string = args[0];
            return new String(value).toString();
        } else if (args.length === 1 && Array.isArray(args[0])) {
            const value: string[] = args[0];
            return value.map((str) => {
                return new String(value).toString();
            });
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static Reverse(str: string) {
        return str.split("").reverse().join("");
    }
    public static EndsWith(s: string): boolean {
        const suffixes = Array.prototype.slice.call(arguments, 0);
        for (let i = 0; i < suffixes.length; ++i) {
            const l = s.length - suffixes[i].length;
            if (l >= 0 && s.indexOf(suffixes[i], l) === l) {
                return true;
            }
        }
        return false;
    }
    public static EscapeHTML(s: string): string { //from underscore.string
        return s.replace(/[&<>"']/g, function (m) { return '&' + reversedEscapeChars[m] + ';'; });
    }

    public static EnsureLeft(s: string, prefix: string): string {
        if (s.indexOf(prefix) === 0) {
            return s;
        } else {
            return (prefix + s);
        }
    }

    public static EnsureRight(s: string, suffix: string): string {
        if (TString.EndsWith(suffix)) {
            return s;
        } else {
            return (s + suffix);
        }
    }

    public static Humanize(s: string): string { //modified from underscore.string
        if (s === null || s === undefined) {
            return TString.Empty;
        }
        s = TString.Capitalize(TString.Underscore(s).replace(/_id$/, '').replace(/_/g, ' ').trim());
        return s;
    }

    public static IsAlpha(s: string): boolean {
        return !/[^a-z\xDF-\xFF]|^$/.test(s.toLowerCase());
    }

    public static IsAlphaNumeric(s: string): boolean {
        return !/[^0-9a-z\xDF-\xFF]/.test(s.toLowerCase());
    }

    public IsEmpty(s: string): boolean {
        return s === null || s === undefined ? true : /^[\s\xa0]*$/.test(s);
    }

    public static IsLower(s: string): boolean {
        return TString.IsAlpha(s) && s.toLowerCase() === s;
    }

    public static IsNumeric(s: string): boolean {
        return !/[^0-9]/.test(s);
    }

    public static IsUpper(s: string): boolean {
        return TString.IsAlpha(s) && s.toUpperCase() === s;
    }

    public static Left(s: string, N: int): string {
        if (N >= 0) {
            s = s.substr(0, N);
            return s;
        } else {
            return TString.Right(s, -N);
        }
    }

    public static Lines(n: string): string[] { //convert windows newlines to unix newlines then convert to an Array of lines
        return TString.ReplaceAll(n, '\r\n', '\n').split('\n');
    }

    public static Pad(s: string, len: int, ch: string): string { //https://github.com/component/pad
        if (ch == null) {
            ch = ' ';
        }
        if (s.length >= len) {
            return s;
        }
        len = len - s.length;
        const left = Array(Math.ceil(len / 2) + 1).join(ch);
        const right = Array(Math.floor(len / 2) + 1).join(ch);
        return (left + s + right);
    }

    public static PadLeft(s: string, len: int, ch: string): string { //https://github.com/component/pad
        if (ch == null) {
            ch = ' ';
        }
        if (s.length >= len) {
            return s;
        }
        return Array(len - s.length + 1).join(ch) + s;
    }

    public static PadRight(s: string, len: int, ch: string): string { //https://github.com/component/pad
        if (ch == null) {
            ch = ' ';
        }
        if (s.length >= len) {
            return s;
        }
        return s + Array(len - s.length + 1).join(ch);
    }

    public static ParseCSV(s: string, delimiter: string, qualifier: string, escape: string, lineDelimiter: string): string[] | string[][] { //try to parse no matter what
        delimiter = delimiter || ',';
        escape = escape || '\\'
        if (typeof qualifier == 'undefined')
            qualifier = '"';

        let i = 0;
        const fieldBuffer: any[] = [];
        let fields: string[] = [];
        let len = s.length;
        let inField: boolean = false;
        let inUnqualifiedString = false;
        const self = this;
        const ca = function (i) {
            return s.charAt(i)
        };
       /*  if (typeof lineDelimiter !== 'undefined') */ const rows: string[][] = [];

        if (!qualifier)
            inField = true;

        while (i < len) {
            var current = ca(i);
            switch (current) {
                case escape:
                    //fix for issues #32 and #35
                    if (inField && ((escape !== qualifier) || ca(i + 1) === qualifier)) {
                        i += 1;
                        fieldBuffer.push(ca(i));
                        break;
                    }
                    if (escape !== qualifier) {
                        break;
                    }
                    continue;
                case qualifier:
                    inField = !inField;
                    break;
                case delimiter:
                    if (inUnqualifiedString) {
                        inField = false;
                        inUnqualifiedString = false;
                    }
                    if (inField && qualifier)
                        fieldBuffer.push(current);
                    else {
                        fields.push(fieldBuffer.join(''))
                        fieldBuffer.length = 0;
                    }
                    break;
                case lineDelimiter:
                    if (inUnqualifiedString) {
                        inField = false;
                        inUnqualifiedString = false;
                        fields.push(fieldBuffer.join(''));
                        rows.push(fields);
                        fields = [];
                        fieldBuffer.length = 0;
                    }
                    else if (inField) {
                        fieldBuffer.push(current);
                    } else {
                        if (rows) {
                            fields.push(fieldBuffer.join(''))
                            rows.push(fields);
                            fields = [];
                            fieldBuffer.length = 0;
                        }
                    }
                    break;
                case ' ':
                    if (inField)
                        fieldBuffer.push(current);
                    break;
                default:
                    if (inField)
                        fieldBuffer.push(current);
                    else if (current !== qualifier) {
                        fieldBuffer.push(current);
                        inField = true;
                        inUnqualifiedString = true;
                    }
                    break;
            }
            i += 1;
        }

        fields.push(fieldBuffer.join(''));
        if (rows) {
            rows.push(fields);
            return rows;
        }
        return fields;
    }

    public static ReplaceAll(s: string, ss: string, r: string): string {
        const tokens: string[] = s.split(ss);
        const result = tokens.join(r);
        /* s = s.replace(new RegExp(ss, 'i'), r); */
        //s = s.split(ss).join(r)
        return result;
    }

    public static SplitLeft(s: string, sep: string, maxSplit: int, limit: int) {
        function splitLeft(self, sep, maxSplit, limit) {

            if (typeof maxSplit === 'undefined') {
                maxSplit = -1;
            }

            var splitResult = self.split(sep);
            var splitPart1 = splitResult.slice(0, maxSplit);
            var splitPart2 = splitResult.slice(maxSplit);

            if (splitPart2.length === 0) {
                splitResult = splitPart1;
            } else {
                splitResult = splitPart1.concat(splitPart2.join(sep));
            }

            if (typeof limit === 'undefined') {
                return splitResult;
            } else if (limit < 0) {
                return splitResult.slice(limit);
            } else {
                return splitResult.slice(0, limit);
            }

        }
        return splitLeft(s, sep, maxSplit, limit);
    }

    public static SplitRight(s: string, sep: string, maxSplit: int, limit: int): string {
        function splitRight(self, sep, maxSplit, limit): any {

            if (typeof maxSplit === 'undefined') {
                maxSplit = -1;
            }
            if (typeof limit === 'undefined') {
                limit = 0;
            }

            var splitResult = [self];

            for (var i = self.length - 1; i >= 0; i--) {

                if (
                    splitResult[0].slice(i).indexOf(sep) === 0 &&
                    (splitResult.length <= maxSplit || maxSplit === -1)
                ) {
                    splitResult.splice(1, 0, splitResult[0].slice(i + sep.length)); // insert
                    splitResult[0] = splitResult[0].slice(0, i)
                }
            }

            if (limit >= 0) {
                return splitResult.slice(-limit);
            } else {
                return splitResult.slice(0, -limit);
            }

        }

        return splitRight(s, sep, maxSplit, limit);
    }

    public static Strip(s: string, ...args: string[]): string {
        var ss = s;
        for (let i: int = 0, n = args.length; i < n; i++) {
            ss = ss.split(args[i]).join('');
        }
        return ss;
    }

    public static StripLeft(s: string, chars: string): string {
        var regex;
        var pattern;
        var ss = ensureString(s);

        if (chars === undefined) {
            pattern = /^\s+/g;
        }
        else {
            regex = escapeRegExp(chars);
            pattern = new RegExp("^[" + regex + "]+", "g");
        }

        return ss.replace(pattern, "");
    }

    public static StripRight(s: string, chars: string): string {
        var regex;
        var pattern;
        var ss = ensureString(s);

        if (chars === undefined) {
            pattern = /\s+$/g;
        }
        else {
            regex = escapeRegExp(chars);
            pattern = new RegExp("[" + regex + "]+$", "g");
        }

        return ss.replace(pattern, "");
    }

    public static Right(s: string, N: int): string {
        if (N >= 0) {
            s = s.substr(s.length - N, N);
            return s;
        } else {
            return TString.Left(s, -N);
        }
    }


    public static StartsWith(s: string): boolean {
        var prefixes = Array.prototype.slice.call(arguments, 0);
        for (var i = 0; i < prefixes.length; ++i) {
            if (s.lastIndexOf(prefixes[i], 0) === 0) return true;
        }
        return false;
    }

    public static StripPunctuation(s: string): string {
        //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
        return s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    }

    public stripTags(s: string, ...args: string[]): string { //from sugar.js
        const _args = args.length > 0 ? args : [''];
        multiArgs(args, function (tag) {
            s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
        });
        return s;
    }

    public static Template(s: string, values, opening, closing): string {
        const TMPL_OPEN = '{{';
        const TMPL_CLOSE = '}}';
        var opening = opening || TMPL_OPEN
        var closing = closing || TMPL_CLOSE

        var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
        var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
        var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
        var matches = s.match(r) || [];

        matches.forEach(function (match) {
            var key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
            var value = typeof values[key] == 'undefined' ? '' : values[key];
            s = s.replace(match, value);
        });
        return s;
    }

    public static Times(s: string, n: int): string {
        return new Array(n + 1).join(s);
    }

    public static TitleCase(s: string): string {
        if (s) {
            s = s.replace(/(^[a-z]| [a-z]|-[a-z]|_[a-z])/g,
                function ($1) {
                    return $1.toUpperCase();
                }
            );
        }
        return s;
    }

    public static ToBoolean(s: string): boolean {
        s = s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
    }

    public static ToFloat(s: string, precision: int): float {
        const num = parseFloat(s)
        if (precision) {
            return parseFloat(num.toFixed(precision));
        }
        else {
            return num;
        }
    }

    public static ToInt(s: string): int { //thanks Google
        // If the string starts with '0x' or '-0x', parse as hex.
        return /^\s*-?0x/i.test(s) ? parseInt(s, 16) : parseInt(s, 10)
    }

    /*  public static Trim(s: string): string {
         s = s.trim()
         return s;
     } */

    public static TrimLeft(s: string): string {
        s = s.trimLeft();
        return s;
    }

    public static TrimRight(s: string): string {
        s = s.trimRight();
        return s;
    }

    public static truncate(s: string, length: int, pruneStr: string): string { //from underscore.string, author: github.com/rwz
        const str = s;

        length = ~~length;
        pruneStr = pruneStr || '...';

        if (str.length <= length) {
            return str;
        }

        var tmpl = function (c) { return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
            template = str.slice(0, length + 1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

        if (template.slice(template.length - 2).match(/\w\w/))
            template = template.replace(/\s*\S+$/, '');
        else
            template = (template.slice(0, template.length - 1)).trimRight();

        return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr;
    }

    public static ToCSV(s: string, ...args: any[]) {
    }



    //#modified from https://github.com/epeli/underscore.string
    public static Underscore(s: string): string {
        var s = TString.Trim(s).replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
        return s;
    }

    public static UnescapeHTML(s: string): string { //from underscore.string
        return s.replace(/\&([^;]+);/g, function (entity, entityCode) {
            var match;

            if (entityCode in escapeChars) {
                return escapeChars[entityCode];
            } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
                return String.fromCharCode(parseInt(match[1], 16));
            } else if (match = entityCode.match(/^#(\d+)$/)) {
                return String.fromCharCode(~~match[1]);
            } else {
                return entity;
            }
        });
    }

    public static ValueOf(s: string): string {
        return s.valueOf();
    }
    public static WrapHTML(s: string, tagName: string, tagAttrs: any): string {
        let el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
        if (typeof tagAttrs == 'object') for (var prop in tagAttrs) elAttr += ' ' + prop + '="' + TString.EscapeHTML(tagAttrs[prop]) + '"';
        s = wrapped.concat('<', el, elAttr, '>', s, '</', el, '>');
        return s;
    }
    public static ToCharArray(s: string): CharArray {
        if (s == null || s.length === 0) {
            return null as any;
        }

        const buffer = new Uint16Array(s.length);
        for (let i = 0; i < s.length; i++) {
            buffer[i] = s.charCodeAt(i);
        }
        return buffer;
    }


    public static IndexOfOrdinal(str: string, value: string, startIndex: int, count: int, options: CompareOptions): int {
        if (value == null)
            throw new ArgumentNullException("value");
        if (startIndex < 0)
            throw new ArgumentOutOfRangeException("startIndex");
        if (count < 0 || (str.length - startIndex) < count)
            throw new ArgumentOutOfRangeException("count");

        if (options === CompareOptions.Ordinal)
            return TString.IndexOfOrdinalUnchecked(str, value, startIndex, count);
        // return TString.IndexOfOrdinalIgnoreCaseUnchecked(str, value, startIndex, count);
        throw new Exception('');
    }

    public static IndexOfOrdinalUnchecked(str: string, value: string): int;
    public static IndexOfOrdinalUnchecked(str: string, value: string, startIndex: int, count: int): int;
    public static IndexOfOrdinalUnchecked(...args: any[]): int {
        if (args.length === 2 && typeof args[0] === 'string') {
            const str: string = args[0];
            const value: string = args[1];
            return TString.IndexOfOrdinalUnchecked(str, value, 0, length);
        } else if (args.length === 4) {
            const str: string = args[0];
            const value: string = args[1];
            const startIndex: int = args[2];
            const count: int = args[3];
            const valueLen: int = value.length;
            if (count < valueLen)
                return -1;

            if (valueLen <= 1) {
                if (valueLen === 1) {
                    //return TString.IndexOfUnchecked(str, value[0], startIndex, count);
                    throw new Exception('');
                }
                return startIndex;
            }

            let strIndex: int = 0;
            let valueIndex: int = 0;
            const strptr = TString.ToCharArray(str);
            const valueptr = TString.ToCharArray(value);
            let ap = startIndex;
            let thisEnd = ap + count - valueLen + 1;

            while (ap !== thisEnd) {
                if (strptr[ap] === valueptr[valueIndex]) {
                    for (let i: int = 1; i < valueLen; i++) {
                        if (strptr[ap + i] !== valueptr[i]) {
                            ap++;
                            continue;
                        }
                    }
                    return (ap - strIndex);
                }

            }
            return -1;
        }
        throw new ArgumentOutOfRangeException('');
    }

    public static FromCharArrayToStringArray(ca: CharArray): string[] {
        let result: string[] = [];
        for (let i = 0; i < ca.length; i++) {
            result.push(String.fromCharCode(ca[i]));
        }
        return result;
    }

    public static FromCharArray(ca: CharArray): string;
    public static FromCharArray(ca: CharArray, index: int, count: int): string;
    public static FromCharArray(...args: any[]): string {
        if (args.length === 1 && is.CharArray(args[0])) {
            const ca: CharArray = args[0];
            if (ca == null || ca.length === 0) {
                return TString.Empty;
            }

            let buffer: string = '';
            for (let i = 0; i < ca.length; i++) {
                buffer += String.fromCharCode(ca[i]);
            }
            return buffer;
        } else if (args.length === 3 && is.CharArray(args[0]) && is.int(args[1]) && is.int(args[2])) {
            const ca: CharArray = args[0];
            const index: int = args[1];
            const count: int = args[2];
            return TString.FromCharArray(ca.slice(index, index + count))
        }

        throw new ArgumentException("Argument count is not matched.");

    }
    public static CreateStringFromASCII(bytes: ByteArray, index: int, count: int): string {
        let str: string = TString.Empty;
        const byteArray = bytes.slice(index, index + count);
        for (let i = 0; i < byteArray.length; i++) {
            str += String.fromCharCode(byteArray[i]);
        }
        return str;
    }

    public static CopyTo(s: string, sIndex: int, chars: CharArray, cIndex: int, length: int): void {
        const buffer: CharArray = TString.ToCharArray(s.substr(sIndex));
        for (let i = 0; i < length; i++) {
            chars[i + cIndex] = buffer[i];
        }
    }
    public static ToString(value: any, formatProvider?: IFormatProvider): string {
        if (is.string(value)) {
            return value;
        } else if (is.number(value)) {
            return value.toString()
        } else if (is.boolean(value)) {
            return value ? 'true' : 'false';
        } else if (is.function(value.ToString)) {
            return value.ToString();
        } else if (is.function(value.toString)) {
            return value.toString();
        }
        throw new Exception('toString Not Found in object.');
    }

    public static CopyToByteArray(src: string, charIndex: int, destination: ByteArray, byteIndex: int, charCount: int): void {
        const charBuffer = TString.ToCharArray(src);
        TBuffer.InternalBlockCopy(charBuffer, charIndex * 2, destination, byteIndex, charCount * 2 /**Char = 2 Byte :) */);
    }

    public static Equals(str1: string, str2: string, comp?: StringComparison): boolean {
        return TString.Compare(str1, str2, true) === 0;
    }

    public static Split(str: string, str1: char, str2: char): string[] {
        const result: string[] = [];
        const split1: string[] = str.split(String.fromCharCode(str2));
        for (let i = 0; i < split1.length; i++) {
            const split2 = split1[i].split(String.fromCharCode(str1));
            for (let k; k < split2.length; k++) {
                result.push(split2[k]);
            }
        }
        return result;
    }
    public static Compare(strA: string, strB: string, ignoreCase: boolean): int;
    public static Compare(strA: string, strAIndex: int, strB: string, strBIndex: int, last: int): int;
    public static Compare(strA: string, strB: string, cultureInfo: CultureInfo, compareOptions: CompareOptions): int;
    public static Compare(strA: string, strB: string, stringComparison: StringComparison): int;
    public static Compare(strA: string, indexA: int, strB: string, indexB: int, length: int, culture: any, options: any): int;
    public static Compare(...args: any[]): int {
        if (args.length === 3) {
            const strA: string = args[0];
            const strB: string = args[1];
            const ignoreCase: boolean = args[2];
            return strA.localeCompare(strB);
        } else if (args.length === 7) {
            const strA: string = args[0];
            const indexA: int = args[1];
            const strB: string = args[2];
            const indexB: int = args[3];
            const length: int = args[4];
            const culture: any = args[5];
            const options: any = args[6];
            return strA.localeCompare(strB);
        }
        throw new ArgumentException('');
    }
    public static LastIndexOfAny(str: string, array: string[], start: number = 0): number {
        let result: int = -1;
        for (let i = array.length - 1; i >= 0; i--) {
            const index = str.lastIndexOf(array[i], start);
            if (index > -1) {
                result = Math.max(result, index);
            }
        }
        return result;
    }
    public static IsNullOrEmpty(value: string): boolean {
        return is.nullOrEmpty(value);
    }
    public static Remove(source: string, startIndex: int, count: int) {
        return source.slice(0, startIndex) + source.slice(startIndex + count);
    }
}

EventBus.Default.fire('TStringLoaded', null);