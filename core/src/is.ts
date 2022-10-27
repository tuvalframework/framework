//import { UTF8 } from './Encoding/UTF8';
import { as } from './as';
import { System } from './SystemTypes';
import { IEquatable } from './IEquatable';
import { _NUMBER, _STRING, _BOOLEAN, _UNDEFINED, _OBJECT, _SYMBOL, _FUNCTION, VOID0, LENGTH } from './Reflection/TypeInfo';
import { Primitive } from './Primitive';
import { ArrayLikeWritable } from './Collections/Array/ArrayLikeWritable';
import { BigInteger, BigNumber, NativeBigInt } from './Math/BigNumber';
import { LazyValue } from './LazyValue';

declare const DedicatedWorkerGlobalScope;
declare const openDatabase, webkitIndexedDB, mozIndexedDB, OIndexedDB, msIndexedDB;

export function isTypeOf<T>(obj: any, typeName: Symbol): obj is T {

    if (obj != null) {
        if (typeName === System.Types.Primitives.Number || typeName === System.Types.Primitives.Float) {
            return typeof obj === 'number';
        } else if (typeName === System.Types.Primitives.String) {
            return typeof obj === 'string';
        } else if (typeName === System.Types.Primitives.Boolean) {
            return typeof obj === 'boolean';
        }
    }

    if (typeName === System.Types.Primitives.Number || typeName === System.Types.Primitives.Float) {
        return typeof obj === 'number';
    }
    return as(obj, typeName) != null;
}

export function isAll<T>(obj: any[], typeName: Symbol): boolean {

    if (obj == null) {
        return false;
    }
    if (!Array.isArray(obj)) {
        return isTypeOf(obj, typeName);
    }
    for (let i = 0; i < obj.length; i++) {
        if (!isTypeOf(obj[i], typeName)) {
            return false;
        }
    }
    return true;
}

export function isFloat(obj: any): boolean {
    return Number(obj) === obj && obj % 1 !== 0;
}

export function isInt(obj: any): boolean {
    return isTypeOf(obj, System.Types.Primitives.Number);
}

export function isChar(obj: any): boolean {
    return isTypeOf(obj, System.Types.Primitives.Number);
}

export function isString(obj: any): boolean {
    return isTypeOf(obj, System.Types.Primitives.String);
}

export function isBoolean(obj: any): boolean {
    return isTypeOf(obj, System.Types.Primitives.Boolean);
}

/* export function is<T>(obj: any, objConstructor?: Constructor<T> | Interface): obj is T {
  if (obj == null) {
    return false;
  }

  if (objConstructor instanceof Interface) {
    // Interface casting
    if (isImplement<T>(obj, type(objConstructor))) {
      return true;
    }
  } else if (obj instanceof objConstructor) {
    return true;
  }
  return false;
} */

/**
 * Will detect if a member exists (using 'in').
 * Returns true if a property or method exists on the object or its prototype.
 * @param instance
 * @param property Name of the member.
 * @param ignoreUndefined When ignoreUndefined is true, if the member exists but is undefined, it will return false.
 * @returns {boolean}
 */
function hasMember(instance: any, property: string, ignoreUndefined: boolean = true): boolean {
    return instance && !is.primitive(instance) && (property) in (instance) && (ignoreUndefined || instance[property] !== VOID0);
}



export class is {

    public static AsyncFunction(input: any): boolean {
        return is.function(input) && input.constructor.name === 'AsyncFunction'
    }

    public static Promise<T = any>(promise: any): promise is Promise<T> {
        return !!promise && is.function(promise.then)
    }

    public static CharArray(value: any): boolean {
        return value instanceof Uint16Array;
    }
    public static ByteArray(value: any): boolean {
        return value instanceof Uint8Array;
    }
    public static BooleanArray(value: any): boolean {
        return Array.isArray(value) && is.boolean(value[0]);
    }

    public static FloatArray(value: any): boolean {
        return value instanceof Float32Array;
    }
    public static DoubleArray(value: any): boolean {
        return value instanceof Float64Array;
    }

    public static LongArray(value: any): boolean {
        return Array.isArray(value) && value[0] instanceof BigInteger;
    }

    public static WebSQLValid() {
        return typeof openDatabase === 'function';
    }
    public static LocalStorageValid(): boolean {
        try {
            return (
                typeof localStorage !== 'undefined' &&
                'setItem' in localStorage &&
                // in IE8 typeof localStorage.setItem === 'object'
                !!localStorage.setItem
            );
        } catch (e) {
            return false;
        }
    }
    public static IndexedDBValid(): boolean {
        function getIDB() {
            /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
            try {
                if (typeof indexedDB !== 'undefined') {
                    return indexedDB;
                }
                if (typeof webkitIndexedDB !== 'undefined') {
                    return webkitIndexedDB;
                }
                if (typeof mozIndexedDB !== 'undefined') {
                    return mozIndexedDB;
                }
                if (typeof OIndexedDB !== 'undefined') {
                    return OIndexedDB;
                }
                if (typeof msIndexedDB !== 'undefined') {
                    return msIndexedDB;
                }
            } catch (e) {
                return;
            }
        }

        const idb = getIDB();

        try {
            // Initialize IndexedDB; fall back to vendor-prefixed versions
            // if needed.
            if (!idb) {
                return false;
            }
            // We mimic PouchDB here;
            //
            // We test for openDatabase because IE Mobile identifies itself
            // as Safari. Oh the lulz...
            var isSafari =
                typeof openDatabase !== 'undefined' &&
                /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) &&
                !/Chrome/.test(navigator.userAgent) &&
                !/BlackBerry/.test(navigator.platform);

            var hasFetch =
                typeof fetch === 'function' &&
                fetch.toString().indexOf('[native code') !== -1;

            // Safari <10.1 does not meet our requirements for IDB support
            // (see: https://github.com/pouchdb/pouchdb/issues/5572).
            // Safari 10.1 shipped with fetch, we can use that to detect it.
            // Note: this creates issues with `window.fetch` polyfills and
            // overrides; see:
            // https://github.com/localForage/localForage/issues/856
            return (
                (!isSafari || hasFetch) &&
                typeof indexedDB !== 'undefined' &&
                // some outdated implementations of IDB that appear on Samsung
                // and HTC Android devices <4.4 are missing IDBKeyRange
                // See: https://github.com/mozilla/localForage/issues/128
                // See: https://github.com/mozilla/localForage/issues/272
                typeof IDBKeyRange !== 'undefined'
            );
        } catch (e) {
            return false;
        }
    }
    public static mobileDevice(): boolean {
        // RegEx pattern from detectmobilebrowsers.com (public domain)
        const pattern = new RegExp("(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec" +
            "|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)" +
            "i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)" +
            "|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk");
        const match = pattern.exec(window.navigator.userAgent.toLowerCase());
        return (match as any).length > 0;
    }
    public static undefined(obj: any): boolean {
        return obj === undefined;
    }
    public static defined(obj: any) {
        return obj !== undefined;
    }

    public static nil(obj: any) {
        return obj == null;
    }

    public static Int8Array(value: any): boolean {
        return value instanceof Int8Array;
    }
    public static Uint8Array(value: any): boolean {
        return value instanceof Uint8Array;
    }
    public static Uint8ClampedArray(value: any): boolean {
        return value instanceof Uint8ClampedArray;
    }
    public static Int16Array(value: any): boolean {
        return value instanceof Int16Array;
    }
    public static Uint16Array(value: any): boolean {
        return value instanceof Uint16Array;
    }
    public static Int32Array(value: any): boolean {
        return value instanceof Int32Array;
    }
    public static Uint32Array(value: any): boolean {
        return value instanceof Uint32Array;
    }
    public static Float32Array(value: any): boolean {
        return value instanceof Float32Array;
    }
    public static Float64Array(value: any): boolean {
        return value instanceof Float64Array;
    }
    public static BigInt64Array(value: any): boolean {
        return value instanceof BigInt64Array;
    }
    public static BigUint64Array(value: any): boolean {
        return value instanceof BigUint64Array;
    }

    /*  public static UTF8(value: string): boolean {
         return UTF8.IsValid(value);
     } */

    public static nan(value: any): boolean {
        return value !== value;
    }

    public static null(value: any): boolean {
        return value == null;
    }
    public static notNull(value: any): boolean {
        return value != null;
    }

    public static nullOrEmpty(value: any): boolean {
        return is.null(value) || value === '';
    }

    public static int(value: any): value is number {
        return typeof value === 'number';
    }
    public static long(value: any): value is BigNumber {
        return (value instanceof BigInteger) || (value instanceof NativeBigInt);
    }
    public static double(value: any): value is BigNumber {
        return (value instanceof BigInteger) || (value instanceof NativeBigInt);
    }
    public static char(value: any): value is number {
        return typeof value === 'number';
    }

    public static float(value: any): value is number {
        return isFloat(value);
    }

    /**
    * Returns true if the value parameter is a string.
    * @param value
    * @returns {boolean}
    */
    public static string(value: any): value is string {
        return typeof value === _STRING;
    }

    /**
     * Returns true if the value parameter is a function.
     * @param value
     * @returns {boolean}
     */
    public static function(value: any): value is Function {
        return typeof value === _FUNCTION;
    }

    public static lazy<T>(value: any): value is LazyValue<T> {
        return value instanceof LazyValue;
    }


    public static array<T = any>(value: any): value is Array<T> {
        return Array.isArray(value) || value instanceof Int8Array || value instanceof Uint8Array || value instanceof Int16Array || value instanceof Uint16Array ||
            value instanceof Int32Array || value instanceof Uint32Array || value instanceof Float32Array || value instanceof Float64Array;
    }

    public static typeof<T>(obj: any, typeName: Symbol): obj is T {
        return isTypeOf<T>(obj, typeName);
    }

    public static equals(item1: any, item2: any): boolean {
        if (is.typeof<IEquatable<any>>(item1, System.Types.IEquatable)) {
            return item1.Equals(item2);
        } else if (Number.isNaN(item1) && Number.isNaN(item2)) {
            return true;
        } else if (Number.isFinite(item1) && Number.isFinite(item2)) {
            return true;
        }
        return item1 === item2;
    }

    /**
     * Returns true if is a number and is NaN.
     * @param value
     * @returns {boolean}
     */
    public static trueNaN(value: any): value is number {
        return typeof value === _NUMBER && isNaN(value);
    }

    /**
    * Returns true if the value is a boolean, string, number, null, or undefined.
    * @param value
    * @param allowUndefined if set to true will return true if the value is undefined.
    * @returns {boolean}
    */
    public static primitive(value: any, allowUndefined: boolean = false): value is Primitive {
        const t = typeof value;
        switch (t) {
            case _BOOLEAN:
            case _STRING:
            case _NUMBER:
                return true;
            case _UNDEFINED:
                return allowUndefined;
            case _OBJECT:
                return value === null;

        }
        return false;
    }

    /**
     * For detecting if the value can be used as a key.
     * @param value
     * @param allowUndefined
     * @returns {boolean|boolean}
     */
    public static primitiveOrSymbol(
        value: any,
        allowUndefined: boolean = false): value is Primitive | symbol {
        return typeof value === _SYMBOL ? true : is.primitive(value, allowUndefined);
    }

    /**
     * Returns true if the value is a string, number, or symbol.
     * @param value
     * @returns {boolean}
     */
    public static propertyKey(value: any): value is string | number | symbol {
        const t = typeof value;
        switch (t) {
            case _STRING:
            case _NUMBER:
            case _SYMBOL:
                return true;
        }
        return false;
    }

    /**
    * Returns true if the value parameter is an object.
    * @param value
    * @param allowNull If false (default) null is not considered an object.
    * @returns {boolean}
    */
    public static object(value: any, allowNull: boolean = false): boolean {
        return typeof value === _OBJECT && (allowNull || value !== null);
    }


    /**
     * Guarantees a number value or NaN instead.
     * @param value
     * @returns {number}
     */
    public static numberOrNaN(value: any): number {
        return isNaN(value) ? NaN : value;
    }

    /**
     * Returns true if the value parameter is a number.
     * @param value
     * @param ignoreNaN Default is false. When true, NaN is not considered a number and will return false.
     * @returns {boolean}
     */
    public static number(value: any, ignoreNaN: boolean = false): value is number {
        return typeof value === _NUMBER && (!ignoreNaN || !isNaN(value));
    }


    public static arrayLike<T>(instance: any): instance is ArrayLikeWritable<T> {
        /*
         * NOTE:
         *
         * Functions:
         * Enumerating a function although it has a .length property will yield nothing or unexpected results.
         * Effectively, a function is not like an array.
         *
         * Strings:
         * Behave like arrays but don't have the same exact methods.
         */
        return instance instanceof Array
            || is.string(instance)
            || !is.function(instance) && hasMember(instance, LENGTH);
    }

    /**
    * Returns true if the value parameter is null or undefined.
    * @param value
    * @returns {boolean}
    */
    public static nullOrUndefined(value: any): value is null | undefined {
        return value == null;
    }

    /**
     * Returns true if the value parameter is a boolean.
     * @param value
     * @returns {boolean}
     */
    public static boolean(value: any): value is boolean {
        return typeof value === _BOOLEAN;
    }

    /**
    * Returns true if the target matches the type (instanceof).
    * @param target
    * @param type
    * @returns {T|null}
    */
    public static instanceof<T>(target: Object, type: { new(...params: any[]): T })/* : target is T */ {
        return target instanceof type;
    }

    public static browser(): boolean {
        return typeof window !== 'undefined' &&
            // browser case
            ({}.toString.call(window) === '[object Window]' ||
                // electron case
                {}.toString.call(window) === '[object global]');

    }
    public static mobile(): boolean {
        return false;
    }

    public static arrayish(obj: any): boolean {
        if (!obj) {
            return false;
        }

        return obj instanceof Array || Array.isArray(obj) ||
            (obj.length >= 0 && obj.splice instanceof Function);
    }

    public static callable(obj: any): boolean {

        const fnToStr = Function.prototype.toString;

        const constructorRegex = /^\s*class\b/;
        const isES6ClassFn = function isES6ClassFunction(value) {
            try {
                var fnStr = fnToStr.call(value);
                return constructorRegex.test(fnStr);
            } catch (e) {
                return false; // not a function
            }
        };

        const tryFunctionObject = function tryFunctionToStr(value) {
            try {
                if (isES6ClassFn(value)) { return false; }
                fnToStr.call(value);
                return true;
            } catch (e) {
                return false;
            }
        };
        const toStr = Object.prototype.toString;
        const fnClass = '[object Function]';
        const genClass = '[object GeneratorFunction]';
        const hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

        function isCallable(value) {
            if (!value) { return false; }
            if (typeof value !== 'function' && typeof value !== 'object') { return false; }
            if (typeof value === 'function' && !value.prototype) { return true; }
            if (hasToStringTag) { return tryFunctionObject(value); }
            if (isES6ClassFn(value)) { return false; }
            const strClass = toStr.call(value);
            return strClass === fnClass || strClass === genClass;
        }
        return isCallable(obj);
    }

    public static html(str: string): boolean {
        const htmlTags = [
            "a", "abbr", "address", "area", "article",
            "aside",
            "audio",
            "b",
            "base",
            "bdi",
            "bdo",
            "blockquote",
            "body",
            "br",
            "button",
            "canvas",
            "caption",
            "cite",
            "code",
            "col",
            "colgroup",
            "data",
            "datalist",
            "dd",
            "del",
            "details",
            "dfn",
            "dialog",
            "div",
            "dl",
            "dt",
            "em",
            "embed",
            "fieldset",
            "figcaption",
            "figure",
            "footer",
            "form",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "head",
            "header",
            "hgroup",
            "hr",
            "html",
            "i",
            "iframe",
            "img",
            "input",
            "ins",
            "kbd",
            "keygen",
            "label",
            "legend",
            "li",
            "link",
            "main",
            "map",
            "mark",
            "math",
            "menu",
            "menuitem",
            "meta",
            "meter",
            "nav",
            "noscript",
            "object",
            "ol",
            "optgroup",
            "option",
            "output",
            "p",
            "param",
            "picture",
            "pre",
            "progress",
            "q",
            "rb",
            "rp",
            "rt",
            "rtc",
            "ruby",
            "s",
            "samp",
            "script",
            "section",
            "select",
            "slot",
            "small",
            "source",
            "span",
            "strong",
            "style",
            "sub",
            "summary",
            "sup",
            "svg",
            "table",
            "tbody",
            "td",
            "template",
            "textarea",
            "tfoot",
            "th",
            "thead",
            "time",
            "title",
            "tr",
            "track",
            "u",
            "ul",
            "var",
            "video",
            "wbr"
        ];
        const basic = /\s?<!doctype html>|(<html\b[^>]*>|<body\b[^>]*>|<x-[^>]+>)+/i;
        const full = new RegExp(htmlTags.map(function (el) {
            return '<' + el + '\\b[^>]*>';
        }).join('|'), 'i');

        if (basic.test(str)) {
            return true;
        }
        return full.test(str);
    }
    public static workerContext(): boolean {
        return typeof DedicatedWorkerGlobalScope !== 'undefined';
        /*  try {
             return DedicatedWorkerGlobalScope !== undefined;
         } catch  {
             return false;
         } */
    }

    public static NodeEnvironment(): boolean {
        return typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
    }

    public static localhost(): boolean {
        // if( window.location.protocol == 'file:' ){ return 0; }
        if (window.location.host.replace(/localhost|127\.0\.0\.1/i, '').replace(`:${location.port}`, '') === '') {
            return true;
        }
        return false;
    }
}