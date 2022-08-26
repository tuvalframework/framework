


interface String {
    indexOfAny(array: string[], start?: number): number;
    lastIndexOfAny(array: string[], start?: number): number;
    startsWith(str: string | String): boolean;
    equals(str: string | String): boolean;
    toInt16Array(): Int16Array;
    contains(s: string): boolean;
    hashCode(): number;
    getChars(srcBegin: number, srcEnd: number, dst: Int16Array, dstBegin: number): void;
    getBytes(): Uint8Array;
    getBytes(encoding: string): Uint8Array;
    isEmpty(): boolean;
}

interface StringConstructor {
    IsNullOrEmpty(value: string): boolean;
    Concat(...strs: string[]): string;
    Compare(str1: string | String, str2: string | String, ignoreCase: boolean): number;
    Empty: string;
    valueOf(x: number): string;
    valueOf(x: boolean): string;
    valueOf(buf: Int16Array): string;
    valueOf(x: Int16Array, start: number, len: number): string;
}
String.IsNullOrEmpty = function (value: string): boolean {
    return value == null || value === '';
};

String.Concat = function (...str: string[]): string {
    let result: string = '';
    for (let i = 0; i < str.length; i++) {
        result += str[i];
    }

    return result;
};

String.Compare = function (str1: string, str2: string, ignoreCase: boolean = true): number {
    if (ignoreCase) {
        return str1.toLocaleUpperCase().localeCompare(str2.toLocaleUpperCase());
    } else {
        return str1.localeCompare(str2);
    }
};

String.valueOf = function (...args: any[]): string {
    if (args.length === 1 && args[0] instanceof Int16Array) {
        const buf: Int16Array = args[0];
        return buf.toString();
    } else if (args.length === 1 && typeof args[0] === 'number') {
        return String.fromCharCode(args[0]);
    } else if (args.length === 1 && typeof args[0] === 'boolean') {
        return args[0] ? 'true' : 'false';
    } else if (args.length === 3 && args[0] instanceof Int16Array && typeof args[1] === 'number' && typeof args[2] === 'number') {
        const buf: Int16Array = args[0];
        const start: number = args[1];
        const len: number = args[2];
        let result = '';
        for (let i = start; i < len; i++) {
            result += String.fromCharCode(buf[i]);
        }
        return result;
    }
    return undefined as any
};

String.Empty = '';


String.prototype.isEmpty = function (): boolean {
    return this.length === 0;
};

String.prototype.indexOfAny = function (array: string[], start: number = 0): number {
    for (let i = 0; i < array.length; i++) {
        const index = String.prototype.indexOf.call(this, array[i], start);
        if (index > -1) {
            return index;
        }
    }
    return -1;
};
String.prototype.lastIndexOfAny = function (array: string[], start: number = 0): number {
    for (let i = this.length - 1; i >= 0; i--) {
        let index = -1;
        for (let k = array.length - 1; k >= 0; k--) {
            if (this.charCodeAt(i) === array[k].charCodeAt(0)) {
                index = i;
            }
        }
        //const index = String.prototype.lastIndexOf.call(this, array[i], start);
        if (index > -1) {
            return index;
        }
    }
    return -1;
};

String.prototype.startsWith = function (str: string): boolean {
    const startStr = String.prototype.slice.call(this, 0, str.length);
    return startStr === str;
};
String.prototype.equals = function (str: string): boolean {
    return this.toString() === str;
};


String.prototype.toInt16Array = function (): Int16Array {
    if (this.length === 0) {
        return null as any;
    }
    const array: Int16Array = new Int16Array(this.length);
    for (let i: number = 0; i < this.length; i++) {
        array[i] = this.charCodeAt(i);
    }
    return array;
};

String.prototype.getBytes = function (): Uint8Array {
    const array: Int16Array = this.toInt16Array();
    return new Uint8Array(array);
};

String.prototype.contains = function (s: string): boolean {
    return this.indexOf(s.toString()) > -1;
};

String.prototype.hashCode = function (): number {
    let h: number = this.hash || 0;
    if (h === 0 && this.length > 0) {

        for (let i = 0; i < this.length; i++) {
            h = 31 * h + this.charCodeAt(i);
        }
        //this.hash = h;
    }
    return h;
}

String.prototype.getChars = function (srcBegin: number, srcEnd: number, dst: Int16Array, dstBegin: number): void {
    while (srcBegin < srcEnd) {
        dst[dstBegin++] = this.charCodeAt(srcBegin++);
    }
}
