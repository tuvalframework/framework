import { byte } from "../byte";
import { Convert } from "../convert";
import { Delegate } from "../Delegate";
import { Event } from "../Event";
import { ByteArray, int } from "../float";
import { Allocator } from "../IO/Internals/Memory";
import { Browser } from "./Browser";
import { Override, Virtual } from "../Reflection/Decorators/ClassInfo";
import { FS, PATH, PATH_FS } from "../IO/Internals/FS";
import { is } from "../is";
import { Exception } from "../Exception";
import { TString } from "../Extensions";

declare var setImmediate, postMessage, wasmTable;

const ENVIRONMENT_IS_WEB = true;
const ENVIRONMENT_IS_WORKER = false;
type PSTR = int;
type Pointer = int;

const ModuleOptions: any = {};
export class MonitorRunDependenciesDelegate extends Delegate<(runDependencies: int) => void> { };
export class DependenciesFulfilledDelegate extends Delegate<() => void> { };
export class RuntimeInitializedDelegate extends Delegate<() => void> { };
export class BeforeRunDelegate extends Delegate<() => void> { };

export abstract class TModule {
    private allocator: Allocator = null as any;
    protected out: any = ModuleOptions['print'] || console.log.bind(console);
    protected err: any = ModuleOptions['printErr'] || console.warn.bind(console);
    protected buffer: ArrayBuffer = null as any;
    protected HEAP8: Int8Array = null as any;
    protected HEAPU8: Uint8Array = null as any;
    protected HEAP16: Int16Array = null as any;
    protected HEAPU16: Uint16Array = null as any;
    protected HEAP32: Int32Array = null as any;
    protected HEAPU32: Uint32Array = null as any;
    protected HEAPF32: Float32Array = null as any;
    protected HEAPF64: Float64Array = null as any;
    public Browser: Browser = null as any;
    private static readonly dataURIPrefix = 'data:application/octet-stream;base64,';
    private static readonly fileURIPrefix = "file://";
    private runDependencies: int = 0;
    private runDependencyTracking: any = {};
    private runDependencyWatcher: any = null;
    private ABORT: boolean = false;
    private EXITSTATUS: int = 0;
    private monitorRunDependencies: Event<MonitorRunDependenciesDelegate> = new Event();
    private dependenciesFulfilled: Event<DependenciesFulfilledDelegate> = new Event();
    public OnBeforeRun: Event<BeforeRunDelegate> = new Event();
    private calledRun: boolean = false;
    public OnRuntimeInitialized: Event<RuntimeInitializedDelegate> = new Event();
    // shouldRunNow refers to calling main(), not run().
    private shouldRunNow: boolean = true;
    private scriptDirectory: string = null as any;
    protected readBinary: Function = null as any;
    private UTF8Decoder: any = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
    private UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
    public preloadPlugins: any[] = [];
    public preloadedImages: any = {};
    public constructor() {
        this.initMemory();
        this.Browser = new Browser(this as any);
        if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
                this.scriptDirectory = self.location.href;
            } else if (typeof document !== 'undefined' && document.currentScript) { // web
                this.scriptDirectory = (document as any).currentScript.src;
            }
            // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
            // otherwise, slice off the final part of the url to find the script directory.
            // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
            // and scriptDirectory will correctly be replaced with an empty string.
            if (!TString.IsNullOrEmpty(this.scriptDirectory) && this.scriptDirectory.indexOf('blob:') !== 0) {
                this.scriptDirectory = this.scriptDirectory.substr(0, this.scriptDirectory.lastIndexOf('/') + 1);
            } else {
                this.scriptDirectory = '';
            }
        }

        if (ENVIRONMENT_IS_WORKER) {
            this.readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                xhr.responseType = 'arraybuffer';
                xhr.send(null);
                return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
            };
        }

        // Run ilk defa çağrıldığında dependensy lar tamamlandığında çalışaçak kodu ekliyoruz.
        this.runCaller = () => {
            // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
            if (!this.calledRun) {
                this.Run();
            }
            if (!this.calledRun) {
                this.dependenciesFulfilled.add(this.runCaller as any); // try this again later, after new deps are fulfilled
            }
        };
        this.dependenciesFulfilled.add(this.runCaller as any);
        //-------------------------------------------
    }

    // end include: runtime_math.js
    // A counter of dependencies for calling run(). If we need to
    // do asynchronous work before running, increment this and
    // decrement it. Incrementing must happen in a place like
    // Module.preRun (used by emcc to add file preloading).
    // Note that you can add dependencies in preRun, even though
    // it happens right before run - run will be postponed until
    // the dependencies are met.
    private static runDependencies: int = 0;
    private static runDependencyWatcher: any = null;
    private static dependenciesFulfilled: any = null; // overridden to take different actions when all run dependencies are fulfilled
    private static runDependencyTracking: any = {};

    public getUniqueRunDependency(id: string): string {
        var orig = id;
        while (1) {
            if (!TModule.runDependencyTracking[id]) {
                return id;
            }
            id = orig + Math.random();
        }
        throw new Exception('');
    }


    //#region Memory Methods
    protected updateGlobalBufferAndViews(buf: ArrayBuffer) {
        this.buffer = buf;
        this.HEAP8 = new Int8Array(buf);
        this.HEAP16 = new Int16Array(buf);
        this.HEAP32 = new Int32Array(buf);
        this.HEAPU8 = new Uint8Array(buf);
        this.HEAPU16 = new Uint16Array(buf);
        this.HEAPU32 = new Uint32Array(buf);
        this.HEAPF32 = new Float32Array(buf);
        this.HEAPF64 = new Float64Array(buf);
    }

    private initMemory(): void {
        const buffer = new ArrayBuffer(1024 * 1024 * 8);
        this.updateGlobalBufferAndViews(buffer);
        this.allocator = new Allocator(buffer);
    }

    protected _malloc(size: int): int {
        return this.allocator.alloc(size);
    }
    protected _free(size: int): int {
        return this.allocator.free(size);
    }
    protected _memset(pointer: int, value: byte, size: int): void {
        for (let i = 0; i < size; i++) {
            this.HEAP8[pointer + i] = Convert.ToByte(value);
        }
    }
    protected _memcpy(dest: int, src: byte, count: int): void {
        for (let i = 0; i < count; i++) {
            this.HEAP8[dest + i] = this.HEAP8[src + i];
        }
    }
    //#endregion

    // #region String Methods
    /**
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
    private UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
        // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
        // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
        while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

        if (endPtr - idx > 16 && heap.subarray && this.UTF8Decoder) {
            return this.UTF8Decoder.decode(heap.subarray(idx, endPtr));
        } else {
            var str = '';
            // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
            while (idx < endPtr) {
                // For UTF8 byte structure, see:
                // http://en.wikipedia.org/wiki/UTF-8#Description
                // https://www.ietf.org/rfc/rfc2279.txt
                // https://tools.ietf.org/html/rfc3629
                var u0 = heap[idx++];
                if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
                var u1 = heap[idx++] & 63;
                if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
                var u2 = heap[idx++] & 63;
                if ((u0 & 0xF0) == 0xE0) {
                    u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                } else {
                    if ((u0 & 0xF8) != 0xF0) this.warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
                    u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
                }

                if (u0 < 0x10000) {
                    str += String.fromCharCode(u0);
                } else {
                    var ch = u0 - 0x10000;
                    str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
                }
            }
        }
        return str;
    }

    protected UTF8ToString(ptr, maxBytesToRead?) {
        return ptr ? this.UTF8ArrayToString(this.HEAPU8, ptr, maxBytesToRead) : '';
    }

    // Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
    // encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
    // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
    // Parameters:
    //   str: the Javascript string to copy.
    //   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
    //   outIdx: The starting offset in the array to begin the copying.
    //   maxBytesToWrite: The maximum number of bytes this function can write to the array.
    //                    This count should include the null terminator,
    //                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
    //                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
    // Returns the number of bytes written, EXCLUDING the null terminator.

    private stringToUTF8Array(str: string, heap: Uint8Array, outIdx: int, maxBytesToWrite: int): int {
        if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
            return 0;

        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
        for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
            var u = str.charCodeAt(i); // possibly a lead surrogate
            if (u >= 0xD800 && u <= 0xDFFF) {
                var u1 = str.charCodeAt(++i);
                u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
            }
            if (u <= 0x7F) {
                if (outIdx >= endIdx) break;
                heap[outIdx++] = u;
            } else if (u <= 0x7FF) {
                if (outIdx + 1 >= endIdx) break;
                heap[outIdx++] = 0xC0 | (u >> 6);
                heap[outIdx++] = 0x80 | (u & 63);
            } else if (u <= 0xFFFF) {
                if (outIdx + 2 >= endIdx) break;
                heap[outIdx++] = 0xE0 | (u >> 12);
                heap[outIdx++] = 0x80 | ((u >> 6) & 63);
                heap[outIdx++] = 0x80 | (u & 63);
            } else {
                if (outIdx + 3 >= endIdx) break;
                if (u >= 0x200000) this.warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
                heap[outIdx++] = 0xF0 | (u >> 18);
                heap[outIdx++] = 0x80 | ((u >> 12) & 63);
                heap[outIdx++] = 0x80 | ((u >> 6) & 63);
                heap[outIdx++] = 0x80 | (u & 63);
            }
        }
        // Null-terminate the pointer to the buffer.
        heap[outIdx] = 0;
        return outIdx - startIdx;
    }

    // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
    // null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
    // Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
    // Returns the number of bytes written, EXCLUDING the null terminator.

    protected stringToUTF8(str: string, outPtr: PSTR, maxBytesToWrite: int): int {
        this.assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        return this.stringToUTF8Array(str, this.HEAPU8, outPtr, maxBytesToWrite);
    }

    // Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
    private lengthBytesUTF8(str: string): int {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            var u = str.charCodeAt(i); // possibly a lead surrogate
            if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
            if (u <= 0x7F) ++len;
            else if (u <= 0x7FF) len += 2;
            else if (u <= 0xFFFF) len += 3;
            else len += 4;
        }
        return len;
    }
    protected intArrayFromString(stringy: string, dontAddNull?: any, length?: int) {
        var len = length! > 0 ? length : this.lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = this.stringToUTF8Array(stringy, u8array as any, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array;
    }

    // Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
    // a copy of that string as a Javascript String object.

    private AsciiToString(ptr: PSTR): string {
        var str = '';
        while (1) {
            var ch = this.HEAPU8[((ptr++) >> 0)];
            if (!ch) return str;
            str += String.fromCharCode(ch);
        }
        return null as any;
    }

    // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
    // null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.
    private stringToAscii(str: string, outPtr: PSTR): void {
        return this.writeAsciiToMemory(str, outPtr, false) as any;
    }

    private UTF16ToString(ptr: PSTR, maxBytesToRead: int): string {
        this.assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
        var endPtr = ptr;
        // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
        // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
        var idx = endPtr >> 1;
        var maxIdx = idx + maxBytesToRead / 2;
        // If maxBytesToRead is not passed explicitly, it will be undefined, and this
        // will always evaluate to true. This saves on code size.
        while (!(idx >= maxIdx) && this.HEAPU16[idx]) ++idx;
        endPtr = idx << 1;

        if (endPtr - ptr > 32 && this.UTF16Decoder) {
            return this.UTF16Decoder.decode(this.HEAPU8.subarray(ptr, endPtr));
        } else {
            var str = '';

            // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
            // will always evaluate to true. The loop is then terminated on the first null char.
            for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
                var codeUnit = this.HEAP16[(((ptr) + (i * 2)) >> 1)];
                if (codeUnit == 0) break;
                // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
                str += String.fromCharCode(codeUnit);
            }

            return str;
        }
    }

    // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
    // null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
    // Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
    // Parameters:
    //   str: the Javascript string to copy.
    //   outPtr: Byte address in Emscripten HEAP where to write the string to.
    //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
    //                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
    //                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
    // Returns the number of bytes written, EXCLUDING the null terminator.

    private stringToUTF16(str: string, outPtr: PSTR, maxBytesToWrite: int): int {
        this.assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
        this.assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
        if (maxBytesToWrite === undefined) {
            maxBytesToWrite = 0x7FFFFFFF;
        }
        if (maxBytesToWrite < 2) return 0;
        maxBytesToWrite -= 2; // Null terminator.
        var startPtr = outPtr;
        var numCharsToWrite = (maxBytesToWrite < str.length * 2) ? (maxBytesToWrite / 2) : str.length;
        for (var i = 0; i < numCharsToWrite; ++i) {
            // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
            var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
            this.HEAP16[((outPtr) >> 1)] = codeUnit;
            outPtr += 2;
        }
        // Null-terminate the pointer to the HEAP.
        this.HEAP16[((outPtr) >> 1)] = 0;
        return outPtr - startPtr;
    }

    // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

    private lengthBytesUTF16(str: string): int {
        return str.length * 2;
    }

    private UTF32ToString(ptr: PSTR, maxBytesToRead: int): string {
        this.assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
        var i = 0;

        var str = '';
        // If maxBytesToRead is not passed explicitly, it will be undefined, and this
        // will always evaluate to true. This saves on code size.
        while (!(i >= maxBytesToRead / 4)) {
            var utf32 = this.HEAP32[(((ptr) + (i * 4)) >> 2)];
            if (utf32 == 0) break;
            ++i;
            // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            if (utf32 >= 0x10000) {
                var ch = utf32 - 0x10000;
                str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
            } else {
                str += String.fromCharCode(utf32);
            }
        }
        return str;
    }

    // Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
    // null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
    // Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
    // Parameters:
    //   str: the Javascript string to copy.
    //   outPtr: Byte address in Emscripten HEAP where to write the string to.
    //   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
    //                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
    //                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
    // Returns the number of bytes written, EXCLUDING the null terminator.

    private stringToUTF32(str: string, outPtr: PSTR, maxBytesToWrite: int): int {
        this.assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
        this.assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
        // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
        if (maxBytesToWrite === undefined) {
            maxBytesToWrite = 0x7FFFFFFF;
        }
        if (maxBytesToWrite < 4) return 0;
        var startPtr = outPtr;
        var endPtr = startPtr + maxBytesToWrite - 4;
        for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
            if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
                var trailSurrogate = str.charCodeAt(++i);
                codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
            }
            this.HEAP32[((outPtr) >> 2)] = codeUnit;
            outPtr += 4;
            if (outPtr + 4 > endPtr) break;
        }
        // Null-terminate the pointer to the HEAP.
        this.HEAP32[((outPtr) >> 2)] = 0;
        return outPtr - startPtr;
    }

    // Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

    private lengthBytesUTF32(str: string): int {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
            // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
            // See http://unicode.org/faq/utf_bom.html#utf16-3
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
            len += 4;
        }

        return len;
    }

    // Allocate heap space for a JS string, and write it there.
    // It is the responsibility of the caller to free() that memory.
    private allocateUTF8(str: string): PSTR {
        var size = this.lengthBytesUTF8(str) + 1;
        var ret = this._malloc(size);
        if (ret) this.stringToUTF8Array(str, this.HEAP8 as any, ret, size);
        return ret;
    }

    // Allocate stack space for a JS string, and write it there.
    /* private allocateUTF8OnStack(str: string): PSTR {
        var size = this.lengthBytesUTF8(str) + 1;
        var ret = stackAlloc(size);
        stringToUTF8Array(str, HEAP8, ret, size);
        return ret;
    } */

    // Deprecated: This function should not be called because it is unsafe and does not provide
    // a maximum length limit of how many bytes it is allowed to write. Prefer calling the
    // function stringToUTF8Array() instead, which takes in a maximum length that can be used
    // to be secure from out of bounds writes.
    /** @deprecated
        @param {boolean=} dontAddNull */
    private writeStringToMemory(string: string, buffer: PSTR, dontAddNull: boolean): void {
        this.warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

        var /** @type {number} */ lastChar, /** @type {number} */ end;
        if (dontAddNull) {
            // stringToUTF8Array always appends null. If we don't want to do that, remember the
            // character that existed at the location where the null will be placed, and restore
            // that after the write (below).
            end = buffer + this.lengthBytesUTF8(string);
            lastChar = this.HEAP8[end];
        }
        this.stringToUTF8(string, buffer, Infinity);
        if (dontAddNull) this.HEAP8[end] = lastChar; // Restore the value under the null character.
    }

    private writeArrayToMemory(array: ByteArray, buffer: PSTR) {
        this.assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
        this.HEAP8.set(array, buffer);
    }

    /** @param {boolean=} dontAddNull */
    private writeAsciiToMemory(str: string, buffer: PSTR, dontAddNull: boolean): void {
        for (var i = 0; i < str.length; ++i) {
            const a: any = str.charCodeAt(i);
            const b: any = str.charCodeAt(i);
            this.assert(((a === b) as any) & 0xff);
            this.HEAP8[((buffer++) >> 0)] = str.charCodeAt(i);
        }
        // Null-terminate the pointer to the HEAP.
        if (!dontAddNull) this.HEAP8[((buffer) >> 0)] = 0;
    }

    // #endregion

    private read_(url: string): string {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return xhr.responseText;
    }
    private readAsync(url: string, onload: Function, onerror: Function): void {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (xhr.status === 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
                onload(xhr.response);
                return;
            }
            onerror();
        };
        (xhr as any).onerror = onerror;
        xhr.send(null);
    };

    protected warnOnce(text): void {
        if (!(this.warnOnce as any).shown) (this.warnOnce as any).shown = {};
        if (!(this.warnOnce as any).shown[text]) {
            (this.warnOnce as any).shown[text] = 1;
            this.err(text);
        }
    }
    private demangle(func) {
        this.warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
        return func;
    }


    private demangleAll(text): string {
        var regex =
            /\b_Z[\w\d_]+/g;
        return text.replace(regex,
            function (x) {
                var y = this.demangle(x);
                return x === y ? x : (y + ' [' + x + ']');
            });
    }

    private jsStackTrace(): string {
        var error = new Error();
        if (!error.stack) {
            // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
            // so try that as a special-case.
            try {
                throw new Error();
            } catch (e: any) {
                error = e;
            }
            if (!error.stack) {
                return '(no stack trace available)';
            }
        }
        return error.stack.toString();
    }

    private stackTrace(): any {
        var js = this.jsStackTrace();
        if (TModule['extraStackTrace']) js += '\n' + TModule['extraStackTrace']();
        return this.demangleAll(js);
    }

    protected abort(what) {
        if (TModule['onAbort']) {
            TModule['onAbort'](what);
        }

        what += '';
        this.err(what);

        this.ABORT = true;
        this.EXITSTATUS = 1;

        var output = 'abort(' + what + ') at ' + this.stackTrace();
        what = output;

        // Use a wasm runtime error, because a JS error might be seen as a foreign
        // exception, which means we'd run destructors on it. We need the error to
        // simply make the program stop.
        var e = new (WebAssembly as any).RuntimeError(what);

        // Throw the error whether or not MODULARIZE is set because abort is used
        // in code paths apart from instantiation where an exception is expected
        // to be thrown when abort is called.
        throw e;
    }

    protected assert(condition, text?) {
        if (!condition) {
            this.abort('Assertion failed: ' + text);
        }
    }




    public AddRunDependency(id: string): void {
        this.runDependencies++;

        if (this.monitorRunDependencies) {
            this.monitorRunDependencies(this.runDependencies);
        }

        if (id) {
            this.assert(!this.runDependencyTracking[id]);
            this.runDependencyTracking[id] = 1;
            if (this.runDependencyWatcher === null && typeof setInterval !== 'undefined') {
                // Check for missing dependencies every few seconds
                this.runDependencyWatcher = setInterval(() => {
                    if (this.ABORT) {
                        clearInterval(this.runDependencyWatcher);
                        this.runDependencyWatcher = null;
                        return;
                    }
                    var shown = false;
                    for (let dep in this.runDependencyTracking) {
                        if (!shown) {
                            shown = true;
                            this.err('still waiting on run dependencies:');
                        }
                        this.err('dependency: ' + dep);
                    }
                    if (shown) {
                        this.err('(end of list)');
                    }
                }, 10000);
            }
        } else {
            this.err('warning: run dependency added without ID');
        }
    }

    public RemoveRunDependency(id: string): void {
        this.runDependencies--;

        if (this.monitorRunDependencies) {
            this.monitorRunDependencies(this.runDependencies);
        }

        if (id) {
            this.assert(this.runDependencyTracking[id]);
            delete this.runDependencyTracking[id];
        } else {
            this.err('warning: run dependency removed without ID');
        }
        if (this.runDependencies === 0) {
            if (this.runDependencyWatcher !== null) {
                clearInterval(this.runDependencyWatcher);
                this.runDependencyWatcher = null;
            }
            if (this.dependenciesFulfilled) {
                var callback = this.dependenciesFulfilled;
                this.dependenciesFulfilled = new Event();
                callback(); // can add another dependenciesFulfilled
            }
        }
    }

    @Virtual
    public PreRun() {

    }
    private _preRun(): void {

        if (this.OnBeforeRun != null) {
            this.OnBeforeRun();
            this.OnBeforeRun = null as any; // tekrar çağrılmasını önlüyoruz.
        }
        this.PreRun();

        /*   if (Module['preRun']) {
            if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
            while (Module['preRun'].length) {
              addOnPreRun(Module['preRun'].shift());
            }
          }

          callRuntimeCallbacks(__ATPRERUN__); */
    }

    @Virtual
    public InitRuntime(): void {

    }

    @Virtual
    public PreMain(): void {

    }

    @Virtual
    public CallMain(...args: any[]) {

    }

    @Virtual
    public PostRun(): void {

    }

    private runCaller: Function = null as any;
    private depCheck(): boolean {
        // a preRun added a dependency, run will be called later
        if (this.runDependencies > 0) {
            return true;
        }
        return false;
    }

    private preRunCalled: boolean = false;
    public Run(...args: any[]): void {
        // args = args || arguments_;

        /*  if (this.runDependencies > 0) {
             return;
         } */
        if (this.depCheck()) {
            return;
        }

        //stackCheckInit();

        if (!this.preRunCalled) {
            this._preRun();
            this.preRunCalled = true;

            // a preRun added a dependency, run will be called later
            if (this.depCheck()) {
                return;
            }
        }

        const doRun = () => {
            // run may have just been called through dependencies being fulfilled just in this very frame,
            // or while the async setStatus time below was happening
            if (this.calledRun) return;
            this.calledRun = true;
            //Module['calledRun'] = true;

            if (this.ABORT) return;

            this.InitRuntime();

            this.PreMain();

            if (this.OnRuntimeInitialized) {
                this.OnRuntimeInitialized();
            }

            if (this.shouldRunNow) this.CallMain(args);

            this.PostRun();
        }

        if (TModule['setStatus']) {
            TModule['setStatus']('Running...');
            setTimeout(function () {
                setTimeout(function () {
                    TModule['setStatus']('');
                }, 1);
                doRun();
            }, 1);
        } else {
            doRun();
        }
        //checkStackCookie();
    }


    private hasPrefix(str: string, prefix: string): boolean {
        return ((String as any).prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0) as any;
    }
    protected isDataURI(filename: string): boolean {
        return this.hasPrefix(filename, TModule.dataURIPrefix);
    }
    protected locateFile(path: string): string {
        if (TModule['locateFile']) {
            return TModule['locateFile'](path, this.scriptDirectory);
        }
        return this.scriptDirectory + path;
    }
    protected isFileURI(filename: string): boolean {
        return this.hasPrefix(filename, TModule.fileURIPrefix);
    }

    private noExitRuntime: boolean = false;
    public setMainLoop(browserIterationFunc: Function, fps: int, simulateInfiniteLoop: int, arg: int, noSetTiming: boolean): void {
        this.noExitRuntime = true;

        this.assert(!this.Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');

        this.Browser.mainLoop.func = browserIterationFunc;
        this.Browser.mainLoop.arg = arg;

        var thisMainLoopId = this.Browser.mainLoop.currentlyRunningMainloop;

        this.Browser.mainLoop.Runner = () => {
            if (this.ABORT) {
                return;
            }
            if (this.Browser.mainLoop.queue.length > 0) {
                var start = Date.now();
                var blocker = this.Browser.mainLoop.queue.shift();
                blocker.func(blocker.arg);
                if (this.Browser.mainLoop.remainingBlockers) {
                    var remaining = this.Browser.mainLoop.remainingBlockers;
                    var next = remaining % 1 === 0 ? remaining - 1 : Math.floor(remaining);
                    if (blocker.counted) {
                        this.Browser.mainLoop.remainingBlockers = next;
                    } else {
                        // not counted, but move the progress along a tiny bit
                        next = next + 0.5; // do not steal all the next one's progress
                        this.Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
                    }
                }
                console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
                this.Browser.mainLoop.UpdateStatus();

                // catches pause/resume main loop from blocker execution
                if (thisMainLoopId < this.Browser.mainLoop.currentlyRunningMainloop) {
                    return;
                }

                setTimeout(this.Browser.mainLoop.Runner, 0);
                return;
            }

            // catch pauses from non-main loop sources
            if (thisMainLoopId < this.Browser.mainLoop.currentlyRunningMainloop) {
                return;
            }

            // Implement very basic swap interval control
            this.Browser.mainLoop.currentFrameNumber = this.Browser.mainLoop.currentFrameNumber + 1 | 0;
            if (this.Browser.mainLoop.timingMode === 1/*EM_TIMING_RAF*/ && this.Browser.mainLoop.timingValue > 1 && this.Browser.mainLoop.currentFrameNumber % this.Browser.mainLoop.timingValue !== 0) {
                // Not the scheduled time to render this frame - skip.
                this.Browser.mainLoop.Scheduler();
                return;
            } else if (this.Browser.mainLoop.timingMode === 0/*EM_TIMING_SETTIMEOUT*/) {
                this.Browser.mainLoop.tickStartTime = this._emscripten_get_now();
            }

            // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
            // VBO double-buffering and reduce GPU stalls.

            /* if (this.Browser.mainLoop.method === 'timeout' && Module.ctx) {
                warnOnce('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
                Browser.mainLoop.method = ''; // just warn once per call to set main loop
            } */

            this.Browser.mainLoop.runIter(browserIterationFunc);

            //checkStackCookie();

            // catch pauses from the main loop itself
            if (thisMainLoopId < this.Browser.mainLoop.currentlyRunningMainloop) return;

            // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
            // to queue the newest produced audio samples.
            // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
            //       do not need to be hardcoded into this function, but can be more generic.
            //if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();

            this.Browser.mainLoop.Scheduler();
        }

        if (!noSetTiming) {
            if (fps && fps > 0) this._emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
            else this._emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)

            this.Browser.mainLoop.Scheduler();
        }

        if (simulateInfiniteLoop) {
            throw 'unwind';
        }
    }
    public _emscripten_get_now(): int {
        return performance.now();
    }
    private setImmediates: any[] = undefined as any;
    private _emscripten_set_main_loop_timing(mode: int, value: int) {
        this.Browser.mainLoop.timingMode = mode;
        this.Browser.mainLoop.timingValue = value;

        if (!this.Browser.mainLoop.func) {
            console.error('emscripten_set_main_loop_timing: Cannot set timing mode for main loop since a main loop does not exist! Call emscripten_set_main_loop first to set one up.');
            return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
        }

        if (mode === 0 /*EM_TIMING_SETTIMEOUT*/) {
            this.Browser.mainLoop.Scheduler = () => {
                var timeUntilNextTick = Math.max(0, this.Browser.mainLoop.tickStartTime + value - this._emscripten_get_now()) | 0;
                setTimeout(this.Browser.mainLoop.Runner, timeUntilNextTick); // doing this each time means that on exception, we stop
            };
            this.Browser.mainLoop.method = 'timeout';
        } else if (mode == 1 /*EM_TIMING_RAF*/) {
            this.Browser.mainLoop.Scheduler = () => {
                this.Browser.requestAnimationFrame(this.Browser.mainLoop.Runner);
            };
            this.Browser.mainLoop.method = 'rAF';
        } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
            if (typeof setImmediate === 'undefined') {
                // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
                const setImmediates: any[] = [];
                var emscriptenMainLoopMessageId = 'setimmediate';
                var Browser_setImmediate_messageHandler = (event) => {
                    // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
                    // so check for both cases.
                    if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                        event.stopPropagation();
                        setImmediates.shift()();
                    }
                }
                addEventListener("message", Browser_setImmediate_messageHandler, true);
                setImmediate = /** @type{function(function(): ?, ...?): number} */((func) => {
                    setImmediates.push(func);
                    if (ENVIRONMENT_IS_WORKER) {
                        if (this.setImmediates === undefined) {
                            this.setImmediates = [];
                        }
                        this.setImmediates.push(func);
                        postMessage({ target: emscriptenMainLoopMessageId }); // In --proxy-to-worker, route the message via proxyClient.js
                    } else postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
                })
            }
            this.Browser.mainLoop.Scheduler = () => {
                setImmediate(this.Browser.mainLoop.Runner);
            };
            this.Browser.mainLoop.method = 'immediate';
        }
        return 0;
    }
    public _emscripten_set_main_loop(func: Function, fps: int, simulateInfiniteLoop: int, arg?: int, noSetTiming?: boolean) {
        this.setMainLoop(func, fps, simulateInfiniteLoop, arg as any, noSetTiming as any);
    }

    public _emscripten_async_wget(url: int, file: int, onload: Function, onerror: Function);
    public _emscripten_async_wget(url: string, file: string, onload: Function, onerror: Function);
    public _emscripten_async_wget(...args: any[]) {
        this.noExitRuntime = true;
        let _url: string = '', _file: string = '', onload: Function, onerror: Function;

        if (args.length === 4 && is.int(args[0] && is.int(args[1]))) {
            _url = this.UTF8ToString(args[0]);
            _file = this.UTF8ToString(args[1]);
        } else if (args.length === 4 && is.string(args[0]) && is.string(args[1])) {
            _url = args[0];
            _file = args[1];
        }

        onload = args[2];
        onerror = args[3];

        _file = PATH_FS.resolve(_file);
        const doCallback = (callback) => {
            if (callback) {
                const stack = this.stackSave();
                if (is.function(callback)) {
                    callback(this.allocate(this.intArrayFromString(_file), TModule.ALLOC_STACK));
                } else {
                    wasmTable.get(callback)(this.allocate(this.intArrayFromString(_file), TModule.ALLOC_STACK));
                }
                this.stackRestore(stack);
            }
        }
        var destinationDirectory = PATH.dirname(_file);
        FS.createPreloadedFile(
            destinationDirectory,
            PATH.basename(_file),
            _url, true, true,
            function () {
                doCallback(onload);
            },
            function () {
                doCallback(onerror);
            },
            false, // dontCreateFile
            false, // canOwn
            function () { // preFinish
                // if a file exists there, we overwrite it
                try {
                    FS.unlink(_file);
                } catch (e) { }
                // if the destination directory does not yet exist, create it
                FS.mkdirTree(destinationDirectory);
            },
            this.Browser,
            this
        );
    }

    public _emscripten_async_wget_data(url: int, arg: int, onload: Function | int, onerror: Function | int) {
        this.Browser.asyncLoad(this.UTF8ToString(url), (byteArray) => {
            var buffer = this._malloc(byteArray.length);
            this.HEAPU8.set(byteArray, buffer);
            if (is.function(onload)) {
                onload(arg, buffer, byteArray.length);
            } else {
                wasmTable.get(onload)(arg, buffer, byteArray.length);
            }
            this._free(buffer);
        }, () => {
            if (onerror) {
                if (is.function(onerror)) {
                    onerror(arg);
                } else {
                    wasmTable.get(onerror)(arg);
                }
            }
        }, true /* no need for run dependency, this is async but will not do any prepare etc. step */);
    }

    public _emscripten_cancel_main_loop(): void {
        this.Browser.mainLoop.Pause();
        this.Browser.mainLoop.func = null as any;
    }

    @Virtual
    public stackSave(): int {
        return 0;
    }
    @Virtual
    public stackRestore(stackPointer: int): void {

    }


    @Virtual
    public stackAlloc(size: int): Pointer {
        return this._malloc(size);
    }


    // We used to include malloc/free by default in the past. Show a helpful error in
    // builds with assertions.

    public static readonly ALLOC_NORMAL: int = 0; // Tries to use _malloc()
    public static readonly ALLOC_STACK: int = 1; // Lives for the duration of the current function call

    // allocate(): This is for internal use. You can use it yourself as well, but the interface
    //             is a little tricky (see docs right below). The reason is that it is optimized
    //             for multiple syntaxes to save space in generated code. So you should
    //             normally not use allocate(), and instead allocate memory using _malloc(),
    //             initialize it with setValue(), and so forth.
    // @slab: An array of data.
    // @allocator: How to allocate memory, see ALLOC_*
    /** @type {function((Uint8Array|Array<number>), number)} */
    public allocate(slab: Uint8Array | Array<number>, allocator: int) {
        var ret;
        this.assert(typeof allocator === 'number', 'allocate no longer takes a type argument')
        this.assert(typeof slab !== 'number', 'allocate no longer takes a number as arg0')

        if (allocator === TModule.ALLOC_STACK) {
            ret = this.stackAlloc(slab.length);
        } else {
            ret = this._malloc(slab.length);
        }

        if ((slab as any).subarray || (slab as any).slice) {
            this.HEAPU8.set(/** @type {!Uint8Array} */(slab), ret);
        } else {
            this.HEAPU8.set(new Uint8Array(slab), ret);
        }
        return ret;
    }
}

