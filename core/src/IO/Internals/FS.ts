import { ByteArray } from './../../float';
import { int } from '../../float';
import { is } from '../../is';
import { TObject } from './../../Extensions/TObject';
import {
       ENVIRONMENT_IS_NODE,
    ENVIRONMENT_IS_WEB, ENVIRONMENT_IS_WORKER,  ERRNO_CODES, ERRNO_MESSAGES,
     Module, nodeFS,  read_,   Math_abs, Math_min, Math_floor, Math_ceil
} from './IO';
import { TString } from '../../Extensions';
import { byte } from '../../byte';
import { Browser } from '../../Modulation/Browser';
import { TModule } from '../../Modulation/Module';
import { HEAP32, HEAP8, HEAPU8 } from './Memory';

export let tempDouble;
export let tempI64;

export let out = Module['print'] || console.log.bind(console);
export let err = Module['printErr'] || console.warn.bind(console);

export function ___setErrNo(value) {
    if (Module['___errno_location']) HEAP32[((Module['___errno_location']()) >> 2)] = value;
    else err('failed to set errno from JS');
    return value;
}

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher: any = null;
var dependenciesFulfilled: any = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking: any = {};

export function getUniqueRunDependency(id) {
    var orig = id;
    while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
    }
    return id;
}

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS = 0;

declare var readline, _malloc;


/** @type {function(*, string=)} */
export function assert(condition, text?) {
    if (!condition) {
        abort('Assertion failed: ' + text);
    }
}

export function abort(what?) {
    if (Module['onAbort']) {
        Module['onAbort'](what);
    }

    what += '';
    out(what);
    err(what);

    ABORT = true;
    EXITSTATUS = 1;

    var output = 'abort(' + what + ') at ' + stackTrace();
    what = output;

    // Throw a wasm runtime error, because a JS error might be seen as a foreign
    // exception, which means we'd run destructors on it. We need the error to
    // simply make the program stop.
    throw new (WebAssembly as any).RuntimeError(what);
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

export function stringToUTF8(str, outPtr, maxBytesToWrite) {
    assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}


// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
export function UTF8ToString(ptr, maxBytesToRead?) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}


export function warnOnce(text) {
    if (!(warnOnce as any).shown) (warnOnce as any).shown = {};
    if (!(warnOnce as any).shown[text]) {
        (warnOnce as any).shown[text] = 1;
        err(text);
    }
}

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
export function UTF8ArrayToString(u8Array, idx, maxBytesToRead?) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
    // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
    // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
    while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
    } else {
        var str = '';
        // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
        while (idx < endPtr) {
            // For UTF8 byte structure, see:
            // http://en.wikipedia.org/wiki/UTF-8#Description
            // https://www.ietf.org/rfc/rfc2279.txt
            // https://tools.ietf.org/html/rfc3629
            var u0 = u8Array[idx++];
            if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
            var u1 = u8Array[idx++] & 63;
            if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
            var u2 = u8Array[idx++] & 63;
            if ((u0 & 0xF0) == 0xE0) {
                u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
            } else {
                if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte 0x' + u0.toString(16) + ' encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!');
                u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
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


// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

export function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
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
            outU8Array[outIdx++] = u;
        } else if (u <= 0x7FF) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 0xC0 | (u >> 6);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 0xE0 | (u >> 12);
            outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        } else {
            if (outIdx + 3 >= endIdx) break;
            if (u >= 0x200000) warnOnce('Invalid Unicode code point 0x' + u.toString(16) + ' encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).');
            outU8Array[outIdx++] = 0xF0 | (u >> 18);
            outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
            outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
            outU8Array[outIdx++] = 0x80 | (u & 63);
        }
    }
    // Null-terminate the pointer to the buffer.
    outU8Array[outIdx] = 0;
    return outIdx - startIdx;
}

function jsStackTrace() {
    var err = new Error();
    if (!err.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
            throw new Error();
        } catch (e: any) {
            err = e;
        }
        if (!err.stack) {
            return '(no stack trace available)';
        }
    }
    return err.stack.toString();
}

function stackTrace() {
    var js = jsStackTrace();
    if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
    return demangleAll(js);
}


// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
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

function demangle(func) {
    this.warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
    return func;
}
function demangleAll(text) {
    var regex =
        /\b_Z[\w\d_]+/g;
    return text.replace(regex,
        function (x) {
            var y = demangle(x);
            return x === y ? x : (y + ' [' + x + ']');
        });
}

function intArrayFromString(stringy: string, dontAddNull?: any, length?: int) {
    var len = length! > 0 ? length : this.lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = this.stringToUTF8Array(stringy, u8array as any, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
}

class PathInfo extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    public path: string = '';
    public node: FSNode = null as any;
    public constructor(path: string, node: any) {
        super();
        this.path = path;
        this.node = node;
    }
}
export class Mount {
    public mountpoint: string;
    public mounts: Mount[];
    public opts: any;
    public root: FSNode = null as any;
    public type: any;
    public constructor(type: any, opts: any, mountpoint: string, mounts: Mount[]) {
        this.type = type;
        this.opts = opts;
        this.mountpoint = mountpoint;
        this.mounts = [];
    }
}
export class FSNode extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    private static readMode = 292 | 73;
    private static writeMode = 146;
    public parent: FSNode;
    public mount: Mount;
    public mounted: Mount = null as any;
    public id: int;
    public name: string;
    public mode: int;
    public node_ops: IFSNodeOps;
    public stream_ops: any;
    public rdev: any;
    public name_next: FSNode = null as any;;
    public timestamp: int = 0;
    public contents: byte[] = null as any;
    public url: string = '';
    public constructor(parent: FSNode, name: string, mode: int, rdev: any) {
        super();
        if (!parent) {
            parent = this;  // root node sets parent to itself
        }
        this.parent = parent;
        this.mount = parent.mount;
        this.mounted = null as any;
        this.id = FS.nextInode++;
        this.name = name;
        this.mode = mode;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = rdev;
    }
    public get read(): boolean {
        return (this.mode & FSNode.readMode) === FSNode.readMode;
    }
    public set read(value: boolean) {
        value ? this.mode |= FSNode.readMode : this.mode &= ~FSNode.readMode;
    }

    public get write(): boolean {
        return (this.mode & FSNode.writeMode) === FSNode.writeMode;
    }
    public set write(value: boolean) {
        value ? this.mode |= FSNode.writeMode : this.mode &= ~FSNode.writeMode;
    }

    public get isFolder(): boolean {
        return FS.isDir(this.mode);
    }
    public get isDevice(): boolean {
        return FS.isChrdev(this.mode);
    }

}

export class FSStream {
    public path: string = ''; //TString.Empty;
    public ungotten: any[] = null as any;
    public position: int = 0;
    public seekable: boolean = false;
    public getdents: any;
    public fd: int = 0;
    public node: FSNode = null as any;
    public flags: int = 0;
    public stream_ops: IStreamOps = null as any;
    public get object(): FSNode {
        return this.node;
    }
    public set object(value: FSNode) {
        this.node = value;
    }

    public get isRead(): boolean {
        return (this.flags & 2097155) !== 1;
    }
    public get isWrite(): boolean {
        return (this.flags & 2097155) !== 0;
    }
    public get isAppend(): boolean {
        return (this.flags & 1024) !== 0;
    }


}

export interface IDevice {
    stream_ops: IStreamOps;
}
export interface IStreamOps {
    open?: (stream: FSStream) => void;
    llseek?: (stream: FSStream, offset: int, whence: int) => int;
    read?: (stream: FSStream, buffer: any, offset: int, length: int, position: int) => int;
    write?: (stream: FSStream, buffer: ByteArray, offset: int, length: int, position: int, canOwn: boolean) => int;
    close?: (stream: FSStream) => void;
    allocate?: (stream: FSStream, offset: int, length: int) => void;
    mmap?: (stream: FSStream, buffer: int, offset: int, length: int, position: int, prot: int, flags: int) => void;
    msync?: (stream: FSStream, buffer: ByteArray, offset: int, length: int, mmapFlags: int) => int;
    ioctl?: (stream: FSStream, cmd: string, arg: any) => int;
}

export class ChrdevStreamOps implements IStreamOps {
    public open(stream: FSStream): void {
        const device = FS.getDevice(stream.node.rdev);
        // override node's stream ops with the device's
        stream.stream_ops = (device as any).stream_ops;
        // forward the open call
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
        }
    }
    public llseek(stream: FSStream, offset: int, whence: int): int {
        throw new FS.ErrnoError(70);
    }
}
export interface IFSType {
    createNode?: (parent: string | FSNode, name: string, mode: int, dev: int) => FSNode;
    expandFileStorage?: (node: FSNode, newCapacity: int) => void;
    getFileDataAsRegularArray?: (node: FSNode) => any[];
    getFileDataAsTypedArray?: (node: FSNode) => ByteArray;
    mount?: (mount: Mount) => FSNode;
    node_ops?: IFSNodeOps;
    ops_table?: any;
    resizeFileStorage?: (node: FSNode, newSize: int) => void;
    stream_ops?: IStreamOps;
}

export interface IFSNodeOps {
    getattr?: (node: FSNode) => any;
    lookup?: (parent: FSNode, name: string) => FSNode;
    mknod?: (parent: FSNode, name: string, mode: int, dev: int) => FSNode;
    readdir?: (node: FSNode) => string[];
    readlink?: (node: FSNode) => FSNode;
    rename?: (old_node: FSNode, new_dir: FSNode, new_name: string) => void;
    rmdir?: (parent: FSNode, name: string) => void;
    setattr?: (node: FSNode, attr: any) => void;
    symlink?: (parent: FSNode, newname: string, oldpath: string | FSNode) => FSNode;
    unlink?: (parent: FSNode, name: string) => void;
}

export class FS extends TObject {
    protected dispose(disposing: boolean): void {
        throw new Error('Method not implemented.');
    }

    private static MAX_OPEN_FDS = 4096;
    private static flagModes: any = {
        "r": 0, "rs": 1052672, "r+": 2, "w": 577, "wx": 705, "xw": 705, "w+": 578, "wx+": 706, "xw+": 706, "a": 1089,
        "ax": 1217, "xa": 1217, "a+": 1090, "ax+": 1218, "xa+": 1218
    };
    public static root: any = null;
    public static mounts: any[] = [];
    public static devices: any = {};
    public static streams: FSStream[] = [];
    public static nextInode: int = 1;
    public static nameTable: FSNode[] = null as any;
    public static currentPath: string = "/";
    public static initialized: boolean = false;
    public static ignorePermissions: boolean = true;
    public static trackingDelegate: any = {};
    public static tracking: any = {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    }
    public static ErrnoError: any = null;
    public static genericErrors: any = {};
    public static filesystems: any = null;
    public static syncFSRequests: any = 0;
    public static handleFSError(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
    }

    public static lookupPath(path: string | FSNode, opts?: any): PathInfo {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};

        if (!path) {
            return new PathInfo('', null);
        }

        const defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (let key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key];
            }
        }

        if (opts.recurse_count > 8) {  // max recursive lookup of 8
            throw new FS.ErrnoError(32);
        }

        // split the path
        const parts = PATH.normalizeArray(path.split('/').filter(function (p) {
            return !!p;
        }), false);

        // start at the root
        let current: any = FS.root;
        let current_path = '/';

        for (let i = 0; i < parts.length; i++) {
            const islast = (i === parts.length - 1);
            if (islast && opts.parent) {
                // stop resolving
                break;
            }

            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);

            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current)) {
                if (!islast || (islast && opts.follow_mount)) {
                    current = current.mounted.root;
                }
            }

            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (!islast || opts.follow) {
                let count = 0;
                while (FS.isLink(current.mode)) {
                    const link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(PATH.dirname(current_path), link);

                    const lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                    current = lookup.node;

                    if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                        throw new FS.ErrnoError(32);
                    }
                }
            }
        }
        return new PathInfo(current_path, current);
    }
    public static getPath(node: FSNode): string {
        let path;
        while (true) {
            if (FS.isRoot(node)) {
                const mount = node.mount.mountpoint;
                if (!path) {
                    return mount;
                }
                return mount[mount.length - 1] !== '/' ? mount + '/' + path : mount + path;
            }
            path = path ? node.name + '/' + path : node.name;
            node = node.parent;
        }
    }
    public static hashName(parentid: int, name: string): int {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
    }
    public static hashAddNode(node: FSNode): void {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
    }

    public static hashRemoveNode(node: FSNode): void {
        const hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
        } else {
            let current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break;
                }
                current = current.name_next;
            }
        }
    }

    public static lookupNode(parent: FSNode, name: string): FSNode {
        const errCode = FS.mayLookup(parent);
        if (errCode) {
            throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node;
            }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
    }

    public static createNode(parent: string | FSNode, name: string, mode: int, rdev: int): FSNode {
        const node = new FSNode(parent as any, name, mode, rdev);
        FS.hashAddNode(node);
        return node;
    }
    public static destroyNode(node: FSNode) {
        FS.hashRemoveNode(node);
    }
    public static isRoot(node: FSNode): boolean {
        return node === node.parent;
    }

    public static isMountpoint(node: FSNode): boolean {
        return !!node.mounted;
    }

    public static isFile(mode: int): boolean {
        return (mode & 61440) === 32768;
    }

    public static isDir(mode: int): boolean {
        return (mode & 61440) === 16384;
    }

    public static isLink(mode: int): boolean {
        return (mode & 61440) === 40960;
    }
    public static isChrdev(mode: int): boolean {
        return (mode & 61440) === 8192;
    }
    public static isBlkdev(mode: int): boolean {
        return (mode & 61440) === 24576;
    }

    public static isFIFO(mode: int): boolean {
        return (mode & 61440) === 4096;
    }
    public static isSocket(mode: int): boolean {
        return (mode & 49152) === 49152;
    }

    public static modeStringToFlags(str: string): int {
        const flags: int = FS.flagModes[str];
        if (typeof flags === 'undefined') {
            throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
    }
    public static flagsToPermissionString(flag: int): string {
        let perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
            perms += 'w';
        }
        return perms;
    }

    public static nodePermissions(node: FSNode, perms: any): int {
        if (FS.ignorePermissions) {
            return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
            return 2;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
            return 2;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
            return 2;
        }
        return 0;
    }

    public static mayLookup(dir: FSNode): int {
        let errCode = FS.nodePermissions(dir, 'x');
        if (errCode) {
            return errCode;
        }
        if (!dir.node_ops.lookup) {
            return 2;
        }
        return 0;
    }

    public static mayCreate(dir: FSNode, name: string) {
        try {
            const node = FS.lookupNode(dir, name);
            return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
    }

    public static mayDelete(dir: FSNode, name: string, isdir: boolean): int {
        let node: FSNode;
        try {
            node = FS.lookupNode(dir, name);
        } catch (e: any) {
            return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
            return errCode;
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10;
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31;
            }
        }
        return 0;
    }
    public static mayOpen(node: FSNode, flags: int): int {
        if (!node) {
            return 44;
        }
        if (FS.isLink(node.mode)) {
            return 32;
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
                (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
                return 31;
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
    }

    public static nextfd(fd_start: int, fd_end: int): int {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (let fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd;
            }
        }
        throw new FS.ErrnoError(33);
    }
    public static getStream(fd: int): any {
        return FS.streams[fd];
    }
    public static createStream(stream: any, fd_start: int, fd_end: int): FSStream {
        // clone it, so we can return an instance of FSStream
        const newStream = new FSStream();
        for (let p in stream) {
            newStream[p] = stream[p];
        }
        stream = newStream;
        const fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
    }
    public static closeStream(fd: int): void {
        FS.streams[fd] = null as any;
    }

    private static _chrdev_stream_ops: IStreamOps;
    public static get chrdev_stream_ops(): IStreamOps {
        if (FS._chrdev_stream_ops == null) {
            FS._chrdev_stream_ops = new ChrdevStreamOps();
        }
        return FS._chrdev_stream_ops;
    }

    public static major(dev: any): int {
        return ((dev) >> 8);
    }
    public static minor(dev: any): int {
        return ((dev) & 0xff);
    }
    public static makedev(ma: int, mi: int): int {
        return ((ma) << 8 | (mi));
    }
    public static registerDevice(dev: any, ops: IStreamOps): void {
        FS.devices[dev] = { stream_ops: ops };
    }

    public static getDevice(dev: int): IStreamOps {
        return FS.devices[dev];
    }

    public static getMounts(mount: Mount): Mount[] {
        const mounts: any[] = [];
        const check = [mount];

        while (check.length) {
            const m: Mount = check.pop()!;
            mounts.push(m);
            check.push.apply(check, m.mounts);
        }
        return mounts;
    }
    public static syncfs(populate?: Function | boolean, callback?: Function) {
        if (typeof (populate) === 'function') {
            callback = populate;
            populate = false;
        }

        FS.syncFSRequests++;

        if (FS.syncFSRequests > 1) {
            err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }

        const mounts: Mount[] = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(errCode) {
            assert(FS.syncFSRequests > 0);
            FS.syncFSRequests--;
            if (is.function(callback)) {
                return callback(errCode);
            }
        }

        function done(errCode) {
            if (errCode) {
                if (!(done as any).errored) {
                    (done as any).errored = true;
                    return doCallback(errCode);
                }
                return;
            }
            if (++completed >= mounts.length) {
                doCallback(null);
            }
        };

        // sync all mounts
        mounts.forEach(function (mount) {
            if (!mount.type.syncfs) {
                return done(null);
            }
            mount.type.syncfs(mount, populate, done);
        });
    }
    public static mount(type: string | IFSType, opts: any, mountpoint: string): FSNode {
        if (typeof type === 'string') {
            // The filesystem was not included, and instead we have an error
            // message stored in the variable.
            throw type;
        }
        let root = mountpoint === '/';
        let pseudo = !mountpoint;
        let node;

        if (root && FS.root) {
            throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
            const lookup = FS.lookupPath(mountpoint, { follow_mount: false });

            mountpoint = lookup.path;  // use the absolute path
            node = lookup.node;

            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10);
            }

            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54);
            }
        }

        const mount = new Mount(type, opts, mountpoint, []);

        // create a root node for the fs
        const mountRoot: FSNode = type.mount!(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;

        if (root) {
            FS.root = mountRoot;
        } else if (node) {
            // set as a mountpoint
            node.mounted = mount;

            // add the new mount to the current mount's children
            if (node.mount) {
                node.mount.mounts.push(mount);
            }
        }

        return mountRoot;
    }
    public static unmount(mountpoint: string): void {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });

        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28);
        }

        // destroy the nodes for this mount, and all its child mounts
        let node = lookup.node;
        let mount = node.mounted;
        let mounts = FS.getMounts(mount);

        Object.keys(FS.nameTable).forEach(function (hash) {
            var current = FS.nameTable[hash];

            while (current) {
                var next = current.name_next;

                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current);
                }

                current = next;
            }
        });

        // no longer a mountpoint
        node.mounted = null as any;

        // remove this mount from the child mounts
        const idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
    }
    public static lookup(parent: FSNode, name: string): FSNode {
        return parent.node_ops.lookup!(parent, name);
    }
    public static mknod(path: string | FSNode, mode: int, dev: int): FSNode {
        const lookup = FS.lookupPath(path, { parent: true });
        const parent = lookup.node;
        const name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
            throw new FS.ErrnoError(28);
        }
        const errCode = FS.mayCreate(parent, name);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
    }
    public static create(path: string | FSNode, mode: int): FSNode {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
    }
    public static mkdir(path: string, mode?: int): FSNode {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
    }
    public static mkdirTree(path: string, mode?: int): void {
        const dirs = path.split('/');
        let d = '';
        for (let i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += '/' + dirs[i];
            try {
                FS.mkdir(d, mode);
            } catch (e: any) {
                if (e.errno != 20) throw e;
            }
        }
    }
    public static mkdev(path: string, mode: int, dev?: int): FSNode {
        if (typeof (dev) === 'undefined') {
            dev = mode;
            mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
    }

    public static symlink(oldpath: string | FSNode, newpath: string): FSNode {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44);
        }
        const lookup = FS.lookupPath(newpath, { parent: true });
        const parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44);
        }
        const newname = PATH.basename(newpath);
        const errCode = FS.mayCreate(parent, newname);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
    }

    public static rename(old_path: string, new_path: string): void {
        const old_dirname = PATH.dirname(old_path);
        const new_dirname = PATH.dirname(new_path);
        const old_name = PATH.basename(old_path);
        const new_name = PATH.basename(new_path);
        // parents must exist
        let lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, { parent: true });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, { parent: true });
            new_dir = lookup.node;
        } catch (e) {
            throw new FS.ErrnoError(10);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
            throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        let new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
            // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
            return;
        }
        // we'll need to delete the old entry
        const isdir = FS.isDir(old_node.mode);
        let errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
            FS.mayDelete(new_dir, new_name, isdir) :
            FS.mayCreate(new_dir, new_name);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
            throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
            errCode = FS.nodePermissions(old_dir, 'w');
            if (errCode) {
                throw new FS.ErrnoError(errCode);
            }
        }
        try {
            if (FS.trackingDelegate['willMovePath']) {
                FS.trackingDelegate['willMovePath'](old_path, new_path);
            }
        } catch (e: any) {
            err("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
            throw e;
        } finally {
            // add the node back to the hash (in case node_ops.rename
            // changed its name)
            FS.hashAddNode(old_node);
        }
        try {
            if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch (e: any) {
            err("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
        }
    }
    public static rmdir(path: string): void {
        const lookup = FS.lookupPath(path, { parent: true });
        const parent = lookup.node;
        const name = PATH.basename(path);
        const node = FS.lookupNode(parent, name);
        const errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
        }
        try {
            if (FS.trackingDelegate['willDeletePath']) {
                FS.trackingDelegate['willDeletePath'](path);
            }
        } catch (e: any) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch (e: any) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
        }
    }
    public static readdir(path: string): string[] {
        const lookup = FS.lookupPath(path, { follow: true });
        const node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir!(node);
    }
    public static unlink(path: string): void {
        const lookup = FS.lookupPath(path, { parent: true });
        const parent = lookup.node;
        const name = PATH.basename(path);
        const node = FS.lookupNode(parent, name);
        const errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
            // According to POSIX, we should map EISDIR to EPERM, but
            // we instead do what Linux does (and we must, as we use
            // the musl linux libc).
            throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
        }
        try {
            if (FS.trackingDelegate['willDeletePath']) {
                FS.trackingDelegate['willDeletePath'](path);
            }
        } catch (e: any) {
            err("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch (e: any) {
            err("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
        }
    }
    public static readlink(path: string): string {
        const lookup = FS.lookupPath(path);
        const link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
    }
    public static stat(path: string, dontFollow?: boolean): any {
        const lookup = FS.lookupPath(path, { follow: !dontFollow });
        const node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
    }
    public lstat(path: string) {
        return FS.stat(path, true);
    }

    public static chmod(path: string | FSNode, mode: int, dontFollow?: boolean): void {
        let node;
        if (typeof path === 'string') {
            const lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
            mode: (mode & 4095) | (node.mode & ~4095),
            timestamp: Date.now()
        });
    }
    public static lchmod(path: string, mode: int): void {
        FS.chmod(path, mode, true);
    }
    public static fchmod(fd: int, mode: int): void {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
    }

    public static chown(path: string, uid: string, gid: string, dontFollow?: boolean): void {
        let node;
        if (typeof path === 'string') {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
            // we ignore the uid / gid for now
        });
    }
    public static lchown(path: string, uid: string, gid: string): void {
        FS.chown(path, uid, gid, true);
    }

    public static fchown(fd: int, uid: string, gid: string): void {
        const stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
    }

    public static truncate(path: FSNode, len: int) {
        if (len < 0) {
            throw new FS.ErrnoError(28);
        }
        let node;
        if (typeof path === 'string') {
            const lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
        } else {
            node = path;
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        });
    }

    public static ftruncate(fd: int, len: int): void {
        const stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
    }

    public static utime(path: string, atime: int, mtime: int): void {
        const lookup = FS.lookupPath(path, { follow: true });
        const node = lookup.node;
        node.node_ops.setattr!(node, {
            timestamp: Math.max(atime, mtime)
        });
    }

    public static open(path: string | FSNode, _flags: string, mode?: int, fd_start?: int, fd_end?: int): FSStream {
        if (path === "") {
            throw new FS.ErrnoError(44);
        }
        let iflags: int = typeof _flags === 'string' ? FS.modeStringToFlags(_flags) : _flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((iflags & 64)) {
            mode = (mode & 4095) | 32768;
        } else {
            mode = 0;
        }
        let node;
        if (typeof path === 'object') {
            node = path;
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(iflags & 131072)
                });
                node = lookup.node;
            } catch (e) {
                // ignore
            }
        }
        // perhaps we need to create the node
        let created = false;
        if ((iflags & 64)) {
            if (node) {
                // if O_CREAT and O_EXCL are set, error out if the node already exists
                if ((iflags & 128)) {
                    throw new FS.ErrnoError(20);
                }
            } else {
                // node doesn't exist, try to create it
                node = FS.mknod(path, mode, 0);
                created = true;
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
            iflags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((iflags & 65536) && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
            const errCode = FS.mayOpen(node, iflags);
            if (errCode) {
                throw new FS.ErrnoError(errCode);
            }
        }
        // do truncation if necessary
        if ((iflags & 512)) {
            FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        iflags &= ~(128 | 512);

        // register the stream with the filesystem
        const stream = FS.createStream({
            node: node,
            path: FS.getPath(node),  // we want the absolute path to the node
            flags: iflags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            // used by the file family libc calls (fopen, fwrite, ferror, etc.)
            ungotten: [],
            error: false
        }, fd_start as any, fd_end as any);
        // call the new stream's open function
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
        }
        /*  if (Module['logReadFiles'] && !(flags & 1)) {
             if (!FS.readFiles) FS.readFiles = {};
             if (!(path in FS.readFiles)) {
                 FS.readFiles[path] = 1;
                 err("FS.trackingDelegate error on read file: " + path);
             }
         } */
        try {
            if (FS.trackingDelegate['onOpenFile']) {
                let trackingFlags = 0;
                if ((iflags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ;
                }
                if ((iflags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE;
                }
                FS.trackingDelegate['onOpenFile'](path, trackingFlags);
            }
        } catch (e:any) {
            err("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
        }
        return stream;
    }

    public static close(stream: FSStream): void {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream);
            }
        } catch (e) {
            throw e;
        } finally {
            FS.closeStream(stream.fd);
        }
        stream.fd = null as any;
    }

    public static isClosed(stream: FSStream): boolean {
        return stream.fd === null;
    }

    public static llseek(stream: FSStream, offset: int, whence: int): int {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
    }

    public static read(stream: FSStream, buffer: any, offset: int, length: int, position: int = 0): int {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28);
        }
        const seeking = typeof position !== 'undefined';
        if (!seeking) {
            position = stream.position;
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
        }
        const bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) {
            stream.position += bytesRead;
        }
        return bytesRead;
    }

    public static write(stream: FSStream, buffer: ByteArray, offset: int, length: int, position: int = null as any, canOwn: boolean = false): int {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28);
        }
        if (stream.flags & 1024) {
            // seek to the end before writing in append mode
            FS.llseek(stream, 0, 2);
        }
        const seeking = typeof position !== 'undefined';
        if (!seeking) {
            position = stream.position;
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70);
        }
        const bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch (e:any) {
            err("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message);
        }
        return bytesWritten;
    }
    public static allocate(stream: FSStream, offset: int, length: int): void {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
    }

    public static mmap(stream: FSStream, buffer: int, offset: int, length: int, position: int, prot: int, flags: int): void {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
    }

    public static msync(stream: FSStream, buffer: ByteArray, offset: int, length: int, mmapFlags: int): int {
        if (!stream || !stream.stream_ops.msync) {
            return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
    }

    public static munmap(stream: FSStream): int {
        return 0;
    }
    public static ioctl(stream: FSStream, cmd: string, arg: any): int {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
    }

    public static readFile(path: string, opts?: any): Uint8Array {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        let ret;
        const stream = FS.open(path, opts.flags);
        const stat = FS.stat(path);
        const length = stat.size;
        const buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
            ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
            ret = buf;
        }
        FS.close(stream);
        return ret;
    }
    public static writeFile(path: string, data: Uint8Array, opts: any): void {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === 'string') {
            const buf: Uint8Array = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
            throw new Error('Unsupported data type');
        }
        FS.close(stream);
    }

    public static cwd(): string {
        return FS.currentPath;
    }
    public static chdir(path: string): void {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
            throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54);
        }
        const errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
            throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
    }

    public static createDefaultDirectories(): void {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
    }

    public static createDefaultDevices(): void {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
            read: function () { return 0; },
            write: function (stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
            // for modern web browsers
            var randomBuffer = new Uint8Array(1);
            random_device = function () { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
            if (ENVIRONMENT_IS_NODE) {
                // for nodejs with or without crypto support included
                try {
                    var crypto_module: any = null; //require('crypto');
                    // nodejs has crypto support
                    random_device = function () { return crypto_module['randomBytes'](1)[0]; };
                } catch (e) {
                    // nodejs doesn't have crypto support
                }
            } else { }
        if (!random_device) {
            // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
            random_device = function () { abort("no cryptographic support found for random_device. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };"); };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
    }
    public static createSpecialDirectories(): void {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
            mount: function () {
                const node: FSNode = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
                node.node_ops = {
                    lookup: function (parent: FSNode, name: string): FSNode {
                        const fd = +name;
                        const stream = FS.getStream(fd);
                        if (!stream) {
                            throw new FS.ErrnoError(8);
                        }
                        const ret = new FSNode(null as any, TString.Empty, 0, 0);
                        ret.parent = null as any;
                        ret.mount = new Mount(null as any, null, 'fake', null as any);
                        ret.node_ops = { readlink: function () { return stream.path } }
                        ret.parent = ret as any; // make it look like a simple root node
                        return ret;
                    }
                };
                return node;
            }
        }, {}, '/proc/self/fd');
    }
    public static createStandardStreams() {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops

        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
            FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
            FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
            FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
            FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
            FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
            FS.symlink('/dev/tty1', '/dev/stderr');
        }

        // open default streams for the stdin, stdout and stderr devices
        const stdin = FS.open('/dev/stdin', 'r');
        const stdout = FS.open('/dev/stdout', 'w');
        const stderr = FS.open('/dev/stderr', 'w');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
    }
    public static ensureErrnoError(): void {
        if (FS.ErrnoError) {
            return;
        }
        FS.ErrnoError = function ErrnoError(errno: int, node: FSNode) {
            this.node = node;
            this.setErrno = function (errno) {
                this.errno = errno;
                for (let key in ERRNO_CODES) {
                    if (ERRNO_CODES[key] === errno) {
                        this.code = key;
                        break;
                    }
                }
            };
            this.setErrno(errno);
            this.message = ERRNO_MESSAGES[errno];

            // Try to get a maximally helpful stack trace. On Node.js, getting Error.stack
            // now ensures it shows what we want.
            if (this.stack) {
                // Define the stack property for Node.js 4, which otherwise errors on the next line.
                Object.defineProperty(this, "stack", { value: (new Error).stack, writable: true });
                this.stack = demangleAll(this.stack);
            }
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach(function (code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = '<generic error, no stack>';
        });
    }
    public static staticInit(): void {
        FS.ensureErrnoError();

        FS.nameTable = new Array(4096);

        FS.mount(MEMFS, {}, '/');

        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();

        FS.filesystems = {
            'MEMFS': MEMFS,
        };

        if (!Module["noFSInit"] && !(FS.init as any).initialized) {
            FS.init();
        }
        TTY.init();
        SOCKFS.root = (FS as any).mount(SOCKFS, {}, null);
        PIPEFS.root = (FS as any).mount(PIPEFS, {}, null);
    }
    public static init(input?: any, output?: any, error?: any): void {
        assert(!(FS.init as any).initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        (FS.init as any).initialized = true;

        FS.ensureErrnoError();

        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];

        FS.createStandardStreams();
    }
    public static quit() {
        (FS.init as any).initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        const fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (let i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue;
            }
            FS.close(stream);
        }
    }

    public static getMode(canRead: boolean, canWrite: boolean): int {
        let mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
    }

    public static joinPath(parts: any, forceRelative: any) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] === '/') path = path.substr(1);
        return path;
    }

    public static absolutePath(relative: any, base: any): string {
        return PATH_FS.resolve(base, relative);
    }
    public static standardizePath(path: string): string {
        return PATH.normalize(path);
    }
    public static findObject(path: string, dontResolveLastLink: boolean): any {
        const ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object;
        } else {
            ___setErrNo(ret.error);
            return null;
        }
    }

    public static analyzePath(path: string, dontResolveLastLink?: boolean): any {
        // operate from within the context of the symlink's target
        try {
            const lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
        } catch (e) {
        }
        const ret: any = {
            isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
            parentExists: false, parentPath: null, parentObject: null
        };
        try {
            let lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === '/';
        } catch (e: any) {
            ret.error = e.errno;
        };
        return ret;
    }

    public static createFolder(parent: FSNode, name: string, canRead: boolean, canWrite: boolean): FSNode {
        const path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        const mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
    }
    public createPath(parent: string | FSNode, path: string, canRead: boolean, canWrite: boolean): FSNode {
        let current: any;
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
            const part = parts.pop();
            if (!part) continue;
            current = PATH.join2(parent, part);
            try {
                FS.mkdir(current);
            } catch (e) {
                // ignore EEXIST
            }
            parent = current;
        }
        return current as any;
    }
    public static createFile(parent, name, properties?, canRead = true, canWrite = true) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
    }

    public static createDataFile(parent: string | FSNode, name: string, data: any, canRead: boolean, canWrite: boolean, canOwn: boolean): FSNode {
        const path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        const mode = FS.getMode(canRead, canWrite);
        const node: FSNode = FS.create(path, mode);
        if (data) {
            if (typeof data === 'string') {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr;
            }
            // make sure we can write to the file
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, 'w');
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
        }
        return node;
    }
    public static createDevice(parent: string | FSNode, name: string, input: any, output?: any): FSNode {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!(FS.createDevice as any).major) {
            (FS.createDevice as any).major = 64;
        }
        var dev = FS.makedev((FS.createDevice as any).major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
            open: function (stream) {
                stream.seekable = false;
            },
            close: function (stream) {
                // flush any pending line data
                if (output && output.buffer && output.buffer.length) {
                    output(10);
                }
            },
            read: function (stream, buffer, offset, length, pos /* ignored */) {
                let bytesRead = 0;
                for (let i = 0; i < length; i++) {
                    let result;
                    try {
                        result = input();
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6);
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result;
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now();
                }
                return bytesRead;
            },
            write: function (stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i]);
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now();
                }
                return i;
            }
        });
        return FS.mkdev(path, mode, dev);
    }
    public static createLink(parent: string | FSNode, name: string, target: FSNode, canRead: boolean, canWrite: boolean): FSNode {
        const path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
    }
    public static forceLoadFile(obj: any): boolean {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
            // Command-line.
            try {
                // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
                //          read() will try to parse UTF8.
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length;
            } catch (e) {
                success = false;
            }
        } else {
            throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(29);
        return success;
    }
    public static createLazyFile(parent: string | FSNode, name: string, url: string, canRead: boolean, canWrite: boolean): FSNode {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize) | 0;
            return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            let datalength = Number(xhr.getResponseHeader("Content-length"));
            let header;
            const hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            const usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";

            let chunkSize = 1024 * 1024; // Chunk size in bytes

            if (!hasByteServing) chunkSize = datalength;

            // Function to get a range from the remote URL.
            let doXHR = (function (from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");

                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);

                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }

                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || []);
                } else {
                    return intArrayFromString(xhr.responseText || '', true);
                }
            });
            const lazyArray = this;
            lazyArray.setDataGetter(function (chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength - 1); // if datalength-1 is selected, this is the last block
                if (typeof (lazyArray.chunks[chunkNum]) === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof (lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
            });

            if (usesGzip || !datalength) {
                // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
                chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
                datalength = this.getter(0).length;
                chunkSize = datalength;
                out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }

            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
        };
        let properties;
        if (typeof XMLHttpRequest !== 'undefined') {
            if (!ENVIRONMENT_IS_WORKER) {
                throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
            }
            const lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, {
                length: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._length;
                    }
                },
                chunkSize: {
                    get: function () {
                        if (!this.lengthKnown) {
                            this.cacheLength();
                        }
                        return this._chunkSize;
                    }
                }
            });

            properties = { isDevice: false, contents: lazyArray };
        } else {
            properties = { isDevice: false, url: url };
        }

        const node: FSNode = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
            node.contents = properties.contents;
        } else if ((properties as any).url) {
            node.contents = null as any;
            node.url = (properties as any).url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
            usedBytes: {
                get: function () { return this.contents.length; }
            }
        });
        // override each stream op with one that tries to force load the lazy file first
        const stream_ops: IStreamOps = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function (key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(29);
                }
                return fn.apply(null, arguments);
            };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(29);
            }
            const contents = stream.node.contents;
            if (position >= contents.length)
                return 0;
            const size = Math.min(contents.length - position, length);
            assert(size >= 0);
            if ((contents as any).slice) { // normal array
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                }
            } else {
                for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
                    buffer[offset + i] = contents[position + i];
                }
            }
            return size;
        };
        node.stream_ops = stream_ops;
        return node;
    }

    public static createPreloadedFile(parent: string | FSNode, name: string, url: string, canRead: boolean, canWrite: boolean, onload: Function, onerror: Function,
        dontCreateFile: boolean, canOwn?: boolean, preFinish?: Function, browser?: Browser, module?: TModule): void {
        if (!is.undefined(browser)) {
            browser!.init(); // XXX perhaps this method should move onto Browser?
        }

        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish) {
                    preFinish();
                }
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn!);
                }
                if (onload) onload();
                if (!is.undefined(module)) {
                    module!.RemoveRunDependency(dep);
                }
            }
            let handled = false;

            if (!is.undefined(module)) {
                module!.preloadPlugins.forEach((plugin) => {
                    if (handled) return;
                    if (plugin['canHandle'](fullname)) {
                        plugin['handle'](byteArray, fullname, finish, () => {
                            if (onerror) onerror();
                            module!.RemoveRunDependency(dep);
                        });
                        handled = true;
                    }
                });
            }

            if (!handled) finish(byteArray);
        }
        if (!is.undefined(module)) {
            module!.AddRunDependency(dep);
        }
        if (typeof url == 'string' && !is.undefined(browser)) {
            browser!.asyncLoad(url, function (byteArray) {
                processData(byteArray);
            }, onerror);
        } else {
            processData(url);
        }
    }

    public static indexedDB(): IDBFactory {
        return window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
    }

    public static DB_NAME(): string {
        return 'EM_FS_' + window.location.pathname;
    }

    public static DB_VERSION: int = 20;
    public static DB_STORE_NAME: string = "FILE_DATA";

    public static saveFilesToDB(paths: string[] | FSNode[], onload?: Function, onerror?: Function) {
        onload = onload || function () { };
        onerror = onerror || function () { };
        const indexedDB = FS.indexedDB();
        let openRequest: any;
        try {
            openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
            return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            out('creating db');
            const db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
        };

        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            const transaction: any = db.transaction([FS.DB_STORE_NAME], 'readwrite');
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
                if (fail == 0) {
                    onload!();
                }
                else {
                    onerror!();
                }
            }
            paths.forEach(function (path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
                putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
    }

    public static loadFilesFromDB(paths: string[] | FSNode, onload: Function, onerror: Function): void {
        onload = onload || function () { };
        onerror = onerror || function () { };
        var indexedDB = FS.indexedDB();
        let openRequest: any;
        try {
            openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
            return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
            const db = openRequest.result;
            let transaction: any;
            try {
                transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
            } catch (e) {
                onerror(e);
                return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = (paths as any).length;
            function finish() {
                if (fail == 0) onload(); else onerror();
            }
            (paths as any).forEach(function (path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path);
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total) finish();
                };
                getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
            });
            transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
    }
}


export const MEMFS: IFSType = {
    ops_table: null,
    mount: function (mount: Mount): FSNode {
        return MEMFS.createNode!(null as any, '/', 16384 | 511 /* 0777 */, 0);
    },
    createNode: function (parent: string | FSNode, name: string, mode: int, dev: int): FSNode {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            // no supported
            throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops!.getattr,
                        setattr: MEMFS.node_ops!.setattr,
                        lookup: MEMFS.node_ops!.lookup,
                        mknod: MEMFS.node_ops!.mknod,
                        rename: MEMFS.node_ops!.rename,
                        unlink: MEMFS.node_ops!.unlink,
                        rmdir: MEMFS.node_ops!.rmdir,
                        readdir: MEMFS.node_ops!.readdir,
                        symlink: MEMFS.node_ops!.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops!.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops?.getattr,
                        setattr: MEMFS.node_ops?.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops!.llseek,
                        read: MEMFS.stream_ops!.read,
                        write: MEMFS.stream_ops!.write,
                        allocate: MEMFS.stream_ops!.allocate,
                        mmap: MEMFS.stream_ops!.mmap,
                        msync: MEMFS.stream_ops!.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops?.getattr,
                        setattr: MEMFS.node_ops?.setattr,
                        readlink: MEMFS.node_ops?.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops?.getattr,
                        setattr: MEMFS.node_ops?.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            };
        }
        const node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            (node as any).contents = {};
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            (node as any).usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
            // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
            // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
            // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
            (node as any).contents = null;
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
            (parent as any).contents[name] = node;
        }
        return node;
    },
    getFileDataAsRegularArray: function (node: FSNode): byte[] {
        if (node.contents && (node.contents as any).subarray) {
            const arr: any[] = [];
            for (let i = 0; i < (node as any).usedBytes; ++i) {
                arr.push(node.contents[i]);
            }
            return arr; // Returns a copy of the original data.
        }
        return node.contents as any; // No-op, the file contents are already in a JS array. Return as-is.
    },
    getFileDataAsTypedArray: function (node: FSNode): ByteArray {
        if (!node.contents) {
            return new Uint8Array;
        }
        if ((node.contents as any).subarray) {
            return (node.contents as any).subarray(0, (node as any).usedBytes); // Make sure to not return excess unused bytes.
        }
        return new Uint8Array(node.contents);
    },
    expandFileStorage: function (node: FSNode, newCapacity: int): void {
        const prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) {
            return; // No need to expand, the storage was already large enough.
        }
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        const CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
        if (prevCapacity !== 0) {
            newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        }
        const oldContents = node.contents;
        (node as any).contents = new Uint8Array(newCapacity); // Allocate new storage.
        if ((node as any).usedBytes > 0) {
            (node.contents as any).set((oldContents as any).subarray(0, (node as any).usedBytes), 0); // Copy old data over to the new storage.
        }
        return;
    },
    resizeFileStorage: function (node: FSNode, newSize: int): void {
        if ((node as any).usedBytes === newSize) {
            return;
        }
        if (newSize === 0) {
            (node as any).contents = null; // Fully decommit when requesting a resize to zero.
            (node as any).usedBytes = 0;
            return;
        }
        if (!node.contents || (node.contents as any).subarray) { // Resize a typed array if that is being used as the backing store.
            const oldContents = node.contents;
            (node as any).contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
            if (oldContents) {
                (node.contents as any).set((oldContents as any).subarray(0, Math.min(newSize, (node as any).usedBytes))); // Copy old data over to the new storage.
            }
            (node as any).usedBytes = newSize;
            return;
        }
        // Backing with a JS array.
        if (!node.contents) {
            node.contents = [];
        }
        if (node.contents.length > newSize) {
            node.contents.length = newSize;
        }
        else {
            while (node.contents.length < newSize) {
                node.contents.push(0);
            }
        }
        (node as any).usedBytes = newSize;
    },
    node_ops: {
        getattr: function (node) {
            const attr: any = {};
            // device numbers reuse inode numbers.
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096;
            } else if (FS.isFile(node.mode)) {
                attr.size = (node as any).usedBytes;
            } else if (FS.isLink(node.mode)) {
                attr.size = (node as any).link.length;
            } else {
                attr.size = 0;
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
            //       but this is not required by the standard.
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr;
        }, setattr: function (node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp;
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage!(node, attr.size);
            }
        }, lookup: function (parent, name) {
            throw FS.genericErrors[44];
        }, mknod: function (parent, name, mode, dev) {
            return MEMFS.createNode!(parent, name, mode, dev);
        }, rename: function (old_node: string | FSNode, new_dir: FSNode, new_name: string) {
            // if we're overwriting a directory at new_name, make sure it's empty.
            if (FS.isDir((old_node as any).mode)) {
                let new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {
                }
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                }
            }
            // do the internal rewiring
            delete (old_node as any).parent.contents[(old_node as any).name];
            (old_node as any).name = new_name;
            new_dir.contents[new_name] = old_node;
            (old_node as any).parent = new_dir;
        }, unlink: function (parent, name) {
            delete parent.contents[name];
        }, rmdir: function (parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55);
            }
            delete parent.contents[name];
        }, readdir: function (node: FSNode): string[] {
            var entries = ['.', '..'];
            for (let key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue;
                }
                entries.push(key);
            }
            return entries;
        }, symlink: function (parent, newname, oldpath) {
            const node = MEMFS.createNode!(parent, newname, 511 /* 0777 */ | 40960, 0);
            (node as any).link = oldpath;
            return node;
        }, readlink: function (node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28);
            }
            return (node as any).link;
        }
    },
    stream_ops: {
        read: function (stream: FSStream, buffer: any, offset: int, length: int, position: int): int {
            const contents = stream.node.contents;
            if (position >= (stream.node as any).usedBytes) {
                return 0;
            }
            const size = Math.min((stream.node as any).usedBytes - position, length);
            assert(size >= 0);
            if (size > 8 && (contents as any).subarray) { // non-trivial, and typed array
                buffer.set((contents as any).subarray(position, position + size), offset);
            } else {
                for (let i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i];
                }
            }
            return size;
        },
        write: function (stream: FSStream, buffer: ByteArray, offset: int, length: int, position: int, canOwn: boolean): int {
            if (position == null) {
                position = 0;
            }
            // The data buffer should be a typed array view
            assert(!(buffer instanceof ArrayBuffer));
            // If the buffer is located in main memory (HEAP), and if
            // memory can grow, we can't hold on to references of the
            // memory buffer, as they may get invalidated. That means we
            // need to do copy its contents.
            if (buffer.buffer === HEAP8.buffer) {
                // FIXME: this is inefficient as the file packager may have
                //        copied the data into memory already - we may want to
                //        integrate more there and let the file packager loading
                //        code be able to query if memory growth is on or off.
                if (canOwn) {
                    warnOnce('file packager has copied file data into memory, but in memory growth we are forced to copy it again (see --no-heap-copy)');
                }
                canOwn = false;
            }

            if (!length) {
                return 0;
            }
            const node = stream.node;
            node.timestamp = Date.now();

            if (buffer.subarray && (!node.contents || (node.contents as any).subarray)) { // This write is from a typed array to a typed array?
                if (canOwn) {
                    assert(position === 0, 'canOwn must imply no weird position inside the file');
                    (node as any).contents = buffer.subarray(offset, offset + length);
                    (node as any).usedBytes = length;
                    return length;
                } else if ((node as any).usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
                    (node as any).contents = new Uint8Array(buffer.subarray(offset, offset + length));
                    (node as any).usedBytes = length;
                    return length;
                } else if (position + length <= (node as any).usedBytes) { // Writing to an already allocated and used subrange of the file?
                    (node.contents as any).set(buffer.subarray(offset, offset + length), position);
                    return length;
                }
            }

            // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
            MEMFS.expandFileStorage!(node, position + length);
            if ((node.contents as any).subarray && buffer.subarray) {
                (node.contents as any).set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
            }
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
                }
            }
            (node as any).usedBytes = Math.max((node as any).usedBytes, position + length);
            return length;
        },
        llseek: function (stream, offset, whence) {
            let position = offset;
            if (whence === 1) {
                position += stream.position;
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += (stream.node as any).usedBytes;
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28);
            }
            return position;
        },
        allocate: function (stream, offset, length) {
            MEMFS.expandFileStorage!(stream.node, offset + length);
            (stream.node as any).usedBytes = Math.max((stream.node as any).usedBytes, offset + length);
        },
        mmap: function (stream: FSStream, buffer: any, offset, length, position, prot, flags) {
            // The data buffer should be a typed array view
            assert(!(buffer instanceof ArrayBuffer));
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            // Only make a new copy when MAP_PRIVATE is specified.
            if (!(flags & 2) &&
                (contents as any).buffer === buffer.buffer) {
                // We can't emulate MAP_SHARED when the file is not backed by the buffer
                // we're mapping to (e.g. the HEAP buffer).
                allocated = false;
                ptr = (contents as any).byteOffset;
            } else {
                // Try to avoid unnecessary slices.
                if (position > 0 || position + length < (stream.node as any).usedBytes) {
                    if ((contents as any).subarray) {
                        contents = (contents as any).subarray(position, position + length);
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length);
                    }
                }
                allocated = true;
                // malloc() can lead to growing the heap. If targeting the heap, we need to
                // re-acquire the heap buffer object in case growth had occurred.
                var fromHeap = (buffer.buffer === HEAP8.buffer);
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48);
                }
                (fromHeap ? HEAP8 : buffer).set(contents, ptr);
            }
            return { ptr: ptr, allocated: allocated };
        },
        msync: function (stream: FSStream, buffer: ByteArray, offset: int, length: int, mmapFlags: int) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43);
            }
            if (mmapFlags & 2) {
                // MAP_PRIVATE calls need not to be synced back to underlying fs
                return 0;
            }

            const bytesWritten = MEMFS.stream_ops!.write!(stream, buffer, 0, length, offset, false);
            // should we check if bytesWritten and length are the same?
            return 0;
        }
    }
}

export const TTY: any /* IFSType | { ttys: any[], init: () => void, shutdown:() => void, register:(dev, ops)=> void } */ = {
    ttys: [],
    init: function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, (FS as any).init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until (FS as any).init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
    },
    shutdown: function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
    },
    register: function (dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops!);
    }, stream_ops: {
        open: function (stream: FSStream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43);
            }
            (stream as any).tty = tty;
            stream.seekable = false;
        }, close: function (stream) {
            // flush any pending line data
            stream.tty.ops.flush(stream.tty);
        }, flush: function (stream) {
            stream.tty.ops.flush(stream.tty);
        }, read: function (stream, buffer, offset, length, pos /* ignored */) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new (FS as any).ErrnoError(60);
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty);
                } catch (e) {
                    throw new (FS as any).ErrnoError(29);
                }
                if (result === undefined && bytesRead === 0) {
                    throw new (FS as any).ErrnoError(6);
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result;
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now();
            }
            return bytesRead;
        }, write: function (stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new (FS as any).ErrnoError(60);
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
                }
            } catch (e) {
                throw new (FS as any).ErrnoError(29);
            }
            if (length) {
                stream.node.timestamp = Date.now();
            }
            return i;
        }
    }, default_tty_ops: {
        get_char: function (tty) {
            if (!tty.input.length) {
                let result: any = null;
                if (ENVIRONMENT_IS_NODE) {
                    // we will read data by chunks of BUFSIZE
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                    var bytesRead = 0;

                    try {
                        bytesRead = nodeFS.readSync((process as any).stdin.fd, buf, 0, BUFSIZE, null);
                    } catch (e: any) {
                        // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                        // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                        if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                        else throw e;
                    }

                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString('utf-8');
                    } else {
                        result = null;
                    }
                } else
                    if (typeof window != 'undefined' &&
                        typeof window.prompt == 'function') {
                        // Browser.
                        result = window.prompt('Input: ');  // returns null on cancel
                        if (result !== null) {
                            result += '\n';
                        }
                    } else if (typeof readline == 'function') {
                        // Command line.
                        result = readline();
                        if (result !== null) {
                            result += '\n';
                        }
                    }
                if (!result) {
                    return null;
                }
                tty.input = intArrayFromString(result, true);
            }
            return tty.input.shift();
        }, put_char: function (tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            } else {
                if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
            }
        }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            }
        }
    }, default_tty1_ops: {
        put_char: function (tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            } else {
                if (val != 0) tty.output.push(val);
            }
        }, flush: function (tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = [];
            }
        }
    }
}

export const IDBFS = {
    dbs: {},
    indexedDB: function () {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        let ret: any = null;
        if (typeof window === 'object')
            ret = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
    },
    DB_VERSION: 21,
    DB_STORE_NAME: 'FILE_DATA',
    mount: function (mount: Mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount!.apply(null, arguments as any);
    },
    syncfs: function (mount: Mount, populate: boolean, callback: Function) {
        IDBFS.getLocalSet(mount, function (err, local) {
            if (err) {
                return callback(err);
            }

            IDBFS.getRemoteSet(mount, function (err, remote) {
                if (err) return callback(err);

                const src = populate ? remote : local;
                const dst = populate ? local : remote;

                IDBFS.reconcile(src, dst, callback);
            });
        });
    },
    getDB: function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db);
        }

        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
            return callback(e);
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function (e) {
            var db = e.target.result;
            var transaction = e.target.transaction;

            var fileStore;

            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
            }

            if (!fileStore.indexNames.contains('timestamp')) {
                fileStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        req.onsuccess = function () {
            db = req.result;

            // add to the cache
            IDBFS.dbs[name] = db;
            callback(null, db);
        };
        req.onerror = function (e) {
            callback(this.error);
            e.preventDefault();
        };
    },
    getLocalSet: function (mount, callback) {
        var entries = {};

        function isRealDir(p) {
            return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
            return function (p) {
                return PATH.join2(root, p);
            }
        };

        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));

        while (check.length) {
            const path = check.pop();
            var stat;

            try {
                stat = FS.stat(path!);
            } catch (e) {
                return callback(e);
            }

            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path!).filter(isRealDir).map(toAbsolute(path)));
            }

            entries[path!] = { 'timestamp': stat.mtime };
        }

        return callback(null, { type: 'local', entries: entries });
    },
    getRemoteSet: function (mount, callback) {
        var entries = {};

        IDBFS.getDB(mount.mountpoint, function (err, db) {
            if (err) return callback(err);

            try {
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
                transaction.onerror = function (e) {
                    callback(this.error);
                    e.preventDefault();
                };

                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                var index = store.index('timestamp');

                index.openKeyCursor().onsuccess = function (event) {
                    var cursor = event.target.result;

                    if (!cursor) {
                        return callback(null, { type: 'remote', db: db, entries: entries });
                    }

                    entries[cursor.primaryKey] = { 'timestamp': cursor.key };

                    cursor.continue();
                };
            } catch (e) {
                return callback(e);
            }
        });
    },
    loadLocalEntry: function (path, callback) {
        var stat, node;

        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
        } catch (e) {
            return callback(e);
        }

        if (FS.isDir(stat.mode)) {
            return callback(null, { 'timestamp': stat.mtime, 'mode': stat.mode });
        } else if (FS.isFile(stat.mode)) {
            // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
            // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
            node.contents = MEMFS.getFileDataAsTypedArray!(node);
            return callback(null, { 'timestamp': stat.mtime, 'mode': stat.mode, 'contents': node.contents });
        } else {
            return callback(new Error('node type not supported'));
        }
    },
    storeLocalEntry: function (path, entry, callback) {
        try {
            if (FS.isDir(entry['mode'])) {
                FS.mkdir(path, entry['mode']);
            } else if (FS.isFile(entry['mode'])) {
                FS.writeFile(path, entry['contents'], { canOwn: true });
            } else {
                return callback(new Error('node type not supported'));
            }

            FS.chmod(path, entry['mode']);
            FS.utime(path, entry['timestamp'], entry['timestamp']);
        } catch (e) {
            return callback(e);
        }

        callback(null);
    },
    removeLocalEntry: function (path, callback) {
        try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);

            if (FS.isDir(stat.mode)) {
                FS.rmdir(path);
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path);
            }
        } catch (e) {
            return callback(e);
        }

        callback(null);
    },
    loadRemoteEntry: function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function (event) { callback(null, event.target.result); };
        req.onerror = function (e) {
            callback(this.error);
            e.preventDefault();
        };
    },
    storeRemoteEntry: function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function () { callback(null); };
        req.onerror = function (e) {
            callback(this.error);
            e.preventDefault();
        };
    },
    removeRemoteEntry: function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function () { callback(null); };
        req.onerror = function (e) {
            callback(this.error);
            e.preventDefault();
        };
    },
    reconcile: function (src, dst, callback) {
        var total = 0;

        var create: any[] = [];
        Object.keys(src.entries).forEach(function (key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e['timestamp'] > e2['timestamp']) {
                create.push(key);
                total++;
            }
        });

        var remove: any[] = [];
        Object.keys(dst.entries).forEach(function (key) {
            var e = dst.entries[key];
            var e2 = src.entries[key];
            if (!e2) {
                remove.push(key);
                total++;
            }
        });

        if (!total) {
            return callback(null);
        }

        var errored = false;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

        function done(err) {
            if (err && !errored) {
                errored = true;
                return callback(err);
            }
        };

        transaction.onerror = function (e) {
            done(this.error);
            e.preventDefault();
        };

        transaction.oncomplete = function (e) {
            if (!errored) {
                callback(null);
            }
        };

        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
            if (dst.type === 'local') {
                IDBFS.loadRemoteEntry(store, path, function (err, entry) {
                    if (err) return done(err);
                    IDBFS.storeLocalEntry(path, entry, done);
                });
            } else {
                IDBFS.loadLocalEntry(path, function (err, entry) {
                    if (err) return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done);
                });
            }
        });

        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function (path) {
            if (dst.type === 'local') {
                IDBFS.removeLocalEntry(path, done);
            } else {
                IDBFS.removeRemoteEntry(store, path, done);
            }
        });
    }/* ,
    node_ops : {
        readdir: function (node: FSNode): string[] {

        }
    }*/
}

export const SOCKFS: any = {
    mount: function (mount) {
        // If Module['websocket'] has already been defined (e.g. for configuring
        // the subprotocol/url) use that, if not initialise it to a new object.
        Module['websocket'] = (Module['websocket'] &&
            ('object' === typeof Module['websocket'])) ? Module['websocket'] : {};

        // Add the Event registration mechanism to the exported websocket configuration
        // object so we can register network callbacks from native JavaScript too.
        // For more documentation see system/include/emscripten/emscripten.h
        Module['websocket']._callbacks = {};
        Module['websocket']['on'] = function (event, callback) {
            if ('function' === typeof callback) {
                this._callbacks[event] = callback;
            }
            return this;
        };

        Module['websocket'].emit = function (event, param) {
            if ('function' === typeof this._callbacks[event]) {
                this._callbacks[event].call(this, param);
            }
        };

        // If debug is enabled register simple default logging callbacks for each Event.

        return (FS as any).createNode(null, '/', 16384 | 511 /* 0777 */, 0);
    }, createSocket: function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
            assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }

        // create our internal socket structure
        const sock: any = {
            family: family,
            type: type,
            protocol: protocol,
            server: null,
            error: null, // Used in getsockopt for SOL_SOCKET/SO_ERROR test
            peers: {},
            pending: [],
            recv_queue: [],
            sock_ops: SOCKFS.websocket_sock_ops
        };

        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = (FS as any).createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;

        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = (FS as any).createStream({
            path: name,
            node: node,
            flags: (FS as any).modeStringToFlags('r+'),
            seekable: false,
            stream_ops: SOCKFS.stream_ops
        });

        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;

        return sock;
    }, getSocket: function (fd) {
        var stream = (FS as any).getStream(fd);
        if (!stream || !(FS as any).isSocket(stream.node.mode)) {
            return null;
        }
        return stream.node.sock;
    }, stream_ops: {
        poll: function (stream) {
            var sock = stream.node.sock;
            return sock.sock_ops.poll(sock);
        }, ioctl: function (stream, request, varargs) {
            var sock = stream.node.sock;
            return sock.sock_ops.ioctl(sock, request, varargs);
        }, read: function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            var msg = sock.sock_ops.recvmsg(sock, length);
            if (!msg) {
                // socket is closed
                return 0;
            }
            buffer.set(msg.buffer, offset);
            return msg.buffer.length;
        }, write: function (stream, buffer, offset, length, position /* ignored */) {
            var sock = stream.node.sock;
            return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        }, close: function (stream) {
            var sock = stream.node.sock;
            sock.sock_ops.close(sock);
        }
    }, nextname: function () {
        if (!(SOCKFS.nextname as any).current) {
            (SOCKFS.nextname as any).current = 0;
        }
        return 'socket[' + ((SOCKFS.nextname as any).current++) + ']';
    }, websocket_sock_ops: {
        createPeer: function (sock, addr, port?) {
            var ws;

            if (typeof addr === 'object') {
                ws = addr;
                addr = null;
                port = null;
            }

            if (ws) {
                // for sockets that've already connected (e.g. we're the server)
                // we can inspect the _socket property for the address
                if (ws._socket) {
                    addr = ws._socket.remoteAddress;
                    port = ws._socket.remotePort;
                }
                // if we're just now initializing a connection to the remote,
                // inspect the url property
                else {
                    var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
                    if (!result) {
                        throw new Error('WebSocket URL must be in the format ws(s)://address:port');
                    }
                    addr = result[1];
                    port = parseInt(result[2], 10);
                }
            } else {
                // create the actual websocket object and connect
                try {
                    // runtimeConfig gets set to true if WebSocket runtime configuration is available.
                    var runtimeConfig = (Module['websocket'] && ('object' === typeof Module['websocket']));

                    // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
                    // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
                    var url = 'ws:#'.replace('#', '//');

                    if (runtimeConfig) {
                        if ('string' === typeof Module['websocket']['url']) {
                            url = Module['websocket']['url']; // Fetch runtime WebSocket URL config.
                        }
                    }

                    if (url === 'ws://' || url === 'wss://') { // Is the supplied URL config just a prefix, if so complete it.
                        var parts = addr.split('/');
                        url = url + parts[0] + ":" + port + "/" + parts.slice(1).join('/');
                    }

                    // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
                    var subProtocols: any = 'binary'; // The default value is 'binary'

                    if (runtimeConfig) {
                        if ('string' === typeof Module['websocket']['subprotocol']) {
                            subProtocols = Module['websocket']['subprotocol']; // Fetch runtime WebSocket subprotocol config.
                        }
                    }

                    // The default WebSocket options
                    var opts = undefined;

                    if (subProtocols !== 'null') {
                        // The regex trims the string (removes spaces at the beginning and end, then splits the string by
                        // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
                        subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);

                        // The node ws library API for specifying optional subprotocol is slightly different than the browser's.
                        opts = ENVIRONMENT_IS_NODE ? { 'protocol': subProtocols.toString() } : subProtocols;
                    }

                    // some webservers (azure) does not support subprotocol header
                    if (runtimeConfig && null === Module['websocket']['subprotocol']) {
                        subProtocols = 'null';
                        opts = undefined;
                    }

                    // If node we use the ws library.
                    var WebSocketConstructor;
                    if (ENVIRONMENT_IS_NODE) {
                        WebSocketConstructor = null as any; // require('ws');
                    } else
                        if (ENVIRONMENT_IS_WEB) {
                            WebSocketConstructor = window['WebSocket'];
                        } else {
                            WebSocketConstructor = WebSocket;
                        }
                    ws = new WebSocketConstructor(url, opts);
                    ws.binaryType = 'arraybuffer';
                } catch (e) {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.EHOSTUNREACH);
                }
            }


            var peer: any = {
                addr: addr,
                port: port,
                socket: ws,
                dgram_send_queue: []
            };

            SOCKFS.websocket_sock_ops.addPeer(sock, peer);
            SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);

            // if this is a bound dgram socket, send the port number first to allow
            // us to override the ephemeral port reported to us by remotePort on the
            // remote end.
            if (sock.type === 2 && typeof sock.sport !== 'undefined') {
                peer.dgram_send_queue.push(new Uint8Array([
                    255, 255, 255, 255,
                    'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                    ((sock.sport & 0xff00) >> 8), (sock.sport & 0xff)
                ]));
            }

            return peer;
        }, getPeer: function (sock, addr, port) {
            return sock.peers[addr + ':' + port];
        }, addPeer: function (sock, peer) {
            sock.peers[peer.addr + ':' + peer.port] = peer;
        }, removePeer: function (sock, peer) {
            delete sock.peers[peer.addr + ':' + peer.port];
        }, handlePeerEvents: function (sock, peer) {
            var first = true;

            var handleOpen = function () {

                Module['websocket'].emit('open', sock.stream.fd);

                try {
                    var queued = peer.dgram_send_queue.shift();
                    while (queued) {
                        peer.socket.send(queued);
                        queued = peer.dgram_send_queue.shift();
                    }
                } catch (e) {
                    // not much we can do here in the way of proper error handling as we've already
                    // lied and said this data was sent. shut it down.
                    peer.socket.close();
                }
            };

            function handleMessage(data) {
                if (typeof data === 'string') {
                    var encoder = new TextEncoder(); // should be utf-8
                    data = encoder.encode(data); // make a typed array from the string
                } else {
                    assert(data.byteLength !== undefined); // must receive an ArrayBuffer
                    if (data.byteLength == 0) {
                        // An empty ArrayBuffer will emit a pseudo disconnect event
                        // as recv/recvmsg will return zero which indicates that a socket
                        // has performed a shutdown although the connection has not been disconnected yet.
                        return;
                    } else {
                        data = new Uint8Array(data); // make a typed array view on the array buffer
                    }
                }


                // if this is the port message, override the peer's port with it
                var wasfirst = first;
                first = false;
                if (wasfirst &&
                    data.length === 10 &&
                    data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                    data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
                    // update the peer's port and it's key in the peer map
                    var newport = ((data[8] << 8) | data[9]);
                    SOCKFS.websocket_sock_ops.removePeer(sock, peer);
                    peer.port = newport;
                    SOCKFS.websocket_sock_ops.addPeer(sock, peer);
                    return;
                }

                sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
                Module['websocket'].emit('message', sock.stream.fd);
            };

            if (ENVIRONMENT_IS_NODE) {
                peer.socket.on('open', handleOpen);
                peer.socket.on('message', function (data, flags) {
                    if (!flags.binary) {
                        return;
                    }
                    handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
                });
                peer.socket.on('close', function () {
                    Module['websocket'].emit('close', sock.stream.fd);
                });
                peer.socket.on('error', function (error) {
                    // Although the ws library may pass errors that may be more descriptive than
                    // ECONNREFUSED they are not necessarily the expected error code e.g.
                    // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
                    // is still probably the most useful thing to do.
                    sock.error = ERRNO_CODES.ECONNREFUSED; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
                    Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
                    // don't throw
                });
            } else {
                peer.socket.onopen = handleOpen;
                peer.socket.onclose = function () {
                    Module['websocket'].emit('close', sock.stream.fd);
                };
                peer.socket.onmessage = function peer_socket_onmessage(event) {
                    handleMessage(event.data);
                };
                peer.socket.onerror = function (error) {
                    // The WebSocket spec only allows a 'simple event' to be thrown on error,
                    // so we only really know as much as ECONNREFUSED.
                    sock.error = ERRNO_CODES.ECONNREFUSED; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
                    Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'ECONNREFUSED: Connection refused']);
                };
            }
        }, poll: function (sock) {
            if (sock.type === 1 && sock.server) {
                // listen sockets should only say they're available for reading
                // if there are pending clients.
                return sock.pending.length ? (64 | 1) : 0;
            }

            var mask = 0;
            var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
                SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
                null;

            if (sock.recv_queue.length ||
                !dest ||  // connection-less sockets are always ready to read
                (dest && dest.socket.readyState === dest.socket.CLOSING) ||
                (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
                mask |= (64 | 1);
            }

            if (!dest ||  // connection-less sockets are always ready to write
                (dest && dest.socket.readyState === dest.socket.OPEN)) {
                mask |= 4;
            }

            if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
                (dest && dest.socket.readyState === dest.socket.CLOSED)) {
                mask |= 16;
            }

            return mask;
        }, ioctl: function (sock, request, arg) {
            switch (request) {
                case 21531:
                    var bytes = 0;
                    if (sock.recv_queue.length) {
                        bytes = sock.recv_queue[0].data.length;
                    }
                    HEAP32[((arg) >> 2)] = bytes;
                    return 0;
                default:
                    return ERRNO_CODES.EINVAL;
            }
        }, close: function (sock) {
            // if we've spawned a listen server, close it
            if (sock.server) {
                try {
                    sock.server.close();
                } catch (e) {
                }
                sock.server = null;
            }
            // close any peer connections
            var peers = Object.keys(sock.peers);
            for (var i = 0; i < peers.length; i++) {
                var peer = sock.peers[peers[i]];
                try {
                    peer.socket.close();
                } catch (e) {
                }
                SOCKFS.websocket_sock_ops.removePeer(sock, peer);
            }
            return 0;
        }, bind: function (sock, addr, port) {
            if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EINVAL);  // already bound
            }
            sock.saddr = addr;
            sock.sport = port;
            // in order to emulate dgram sockets, we need to launch a listen server when
            // binding on a connection-less socket
            // note: this is only required on the server side
            if (sock.type === 2) {
                // close the existing server if it exists
                if (sock.server) {
                    sock.server.close();
                    sock.server = null;
                }
                // swallow error operation not supported error that occurs when binding in the
                // browser where this isn't supported
                try {
                    sock.sock_ops.listen(sock, 0);
                } catch (e: any) {
                    if (!(e instanceof (FS as any).ErrnoError)) throw e;
                    if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
                }
            }
        }, connect: function (sock, addr, port) {
            if (sock.server) {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EOPNOTSUPP);
            }

            // TODO autobind
            // if (!sock.addr && sock.type == 2) {
            // }

            // early out if we're already connected / in the middle of connecting
            if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
                var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
                if (dest) {
                    if (dest.socket.readyState === dest.socket.CONNECTING) {
                        throw new (FS as any).ErrnoError(ERRNO_CODES.EALREADY);
                    } else {
                        throw new (FS as any).ErrnoError(ERRNO_CODES.EISCONN);
                    }
                }
            }

            // add the socket to our peer list and set our
            // destination address / port to match
            var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
            sock.daddr = peer.addr;
            sock.dport = peer.port;

            // always "fail" in non-blocking mode
            throw new (FS as any).ErrnoError(ERRNO_CODES.EINPROGRESS);
        }, listen: function (sock, backlog) {
            if (!ENVIRONMENT_IS_NODE) {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EOPNOTSUPP);
            }
            if (sock.server) {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EINVAL);  // already listening
            }
            var WebSocketServer: any = null; // require('ws').Server;
            var host = sock.saddr;
            sock.server = new WebSocketServer({
                host: host,
                port: sock.sport
                // TODO support backlog
            });
            Module['websocket'].emit('listen', sock.stream.fd); // Send Event with listen fd.

            sock.server.on('connection', function (ws) {
                if (sock.type === 1) {
                    var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);

                    // create a peer on the new socket
                    var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
                    newsock.daddr = peer.addr;
                    newsock.dport = peer.port;

                    // push to queue for accept to pick up
                    sock.pending.push(newsock);
                    Module['websocket'].emit('connection', newsock.stream.fd);
                } else {
                    // create a peer on the listen socket so calling sendto
                    // with the listen socket and an address will resolve
                    // to the correct client
                    SOCKFS.websocket_sock_ops.createPeer(sock, ws);
                    Module['websocket'].emit('connection', sock.stream.fd);
                }
            });
            sock.server.on('closed', function () {
                Module['websocket'].emit('close', sock.stream.fd);
                sock.server = null;
            });
            sock.server.on('error', function (error) {
                // Although the ws library may pass errors that may be more descriptive than
                // ECONNREFUSED they are not necessarily the expected error code e.g.
                // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
                // is still probably the most useful thing to do. This error shouldn't
                // occur in a well written app as errors should get trapped in the compiled
                // app's own getaddrinfo call.
                sock.error = ERRNO_CODES.EHOSTUNREACH; // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
                Module['websocket'].emit('error', [sock.stream.fd, sock.error, 'EHOSTUNREACH: Host is unreachable']);
                // don't throw
            });
        }, accept: function (listensock) {
            if (!listensock.server) {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EINVAL);
            }
            var newsock = listensock.pending.shift();
            newsock.stream.flags = listensock.stream.flags;
            return newsock;
        }, getname: function (sock, peer) {
            var addr, port;
            if (peer) {
                if (sock.daddr === undefined || sock.dport === undefined) {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.ENOTCONN);
                }
                addr = sock.daddr;
                port = sock.dport;
            } else {
                // TODO saddr and sport will be set for bind()'d UDP sockets, but what
                // should we be returning for TCP sockets that've been connect()'d?
                addr = sock.saddr || 0;
                port = sock.sport || 0;
            }
            return { addr: addr, port: port };
        }, sendmsg: function (sock, buffer, offset, length, addr, port) {
            if (sock.type === 2) {
                // connection-less sockets will honor the message address,
                // and otherwise fall back to the bound destination address
                if (addr === undefined || port === undefined) {
                    addr = sock.daddr;
                    port = sock.dport;
                }
                // if there was no address to fall back to, error out
                if (addr === undefined || port === undefined) {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.EDESTADDRREQ);
                }
            } else {
                // connection-based sockets will only use the bound
                addr = sock.daddr;
                port = sock.dport;
            }

            // find the peer for the destination address
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);

            // early out if not connected with a connection-based socket
            if (sock.type === 1) {
                if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.ENOTCONN);
                } else if (dest.socket.readyState === dest.socket.CONNECTING) {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.EAGAIN);
                }
            }

            // create a copy of the incoming data to send, as the WebSocket API
            // doesn't work entirely with an ArrayBufferView, it'll just send
            // the entire underlying buffer
            if (ArrayBuffer.isView(buffer)) {
                offset += buffer.byteOffset;
                buffer = buffer.buffer;
            }

            var data;
            data = buffer.slice(offset, offset + length);

            // if we're emulating a connection-less dgram socket and don't have
            // a cached connection, queue the buffer to send upon connect and
            // lie, saying the data was sent now.
            if (sock.type === 2) {
                if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
                    // if we're not connected, open a new connection
                    if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
                    }
                    dest.dgram_send_queue.push(data);
                    return length;
                }
            }

            try {
                // send the actual data
                dest.socket.send(data);
                return length;
            } catch (e) {
                throw new (FS as any).ErrnoError(ERRNO_CODES.EINVAL);
            }
        }, recvmsg: function (sock, length) {
            // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
            if (sock.type === 1 && sock.server) {
                // tcp servers should not be recv()'ing on the listen socket
                throw new (FS as any).ErrnoError(ERRNO_CODES.ENOTCONN);
            }

            var queued = sock.recv_queue.shift();
            if (!queued) {
                if (sock.type === 1) {
                    var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);

                    if (!dest) {
                        // if we have a destination address but are not connected, error out
                        throw new (FS as any).ErrnoError(ERRNO_CODES.ENOTCONN);
                    }
                    else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                        // return null if the socket has closed
                        return null;
                    }
                    else {
                        // else, our socket is in a valid state but truly has nothing available
                        throw new (FS as any).ErrnoError(ERRNO_CODES.EAGAIN);
                    }
                } else {
                    throw new (FS as any).ErrnoError(ERRNO_CODES.EAGAIN);
                }
            }

            // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
            // requeued TCP data it'll be an ArrayBufferView
            var queuedLength = queued.data.byteLength || queued.data.length;
            var queuedOffset = queued.data.byteOffset || 0;
            var queuedBuffer = queued.data.buffer || queued.data;
            var bytesRead = Math.min(length, queuedLength);
            var res = {
                buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
                addr: queued.addr,
                port: queued.port
            };


            // push back any unread data for TCP connections
            if (sock.type === 1 && bytesRead < queuedLength) {
                var bytesRemaining = queuedLength - bytesRead;
                queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
                sock.recv_queue.unshift(queued);
            }

            return res;
        }
    }
}

var PIPEFS: any = {
    BUCKET_BUFFER_SIZE: 8192, mount: function (mount) {
        // Do not pollute the real root directory or its child nodes with pipes
        // Looks like it is OK to create another pseudo-root node not linked to the (FS as any).root hierarchy this way
        return (FS as any).createNode(null, '/', 16384 | 511 /* 0777 */, 0);
    }, createPipe: function () {
        var pipe: any = {
            buckets: []
        };

        pipe.buckets.push({
            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
            offset: 0,
            roffset: 0
        });

        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = (FS as any).createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = (FS as any).createNode(PIPEFS.root, wName, 4096, 0);

        rNode.pipe = pipe;
        wNode.pipe = pipe;

        var readableStream = (FS as any).createStream({
            path: rName,
            node: rNode,
            flags: (FS as any).modeStringToFlags('r'),
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;

        var writableStream = (FS as any).createStream({
            path: wName,
            node: wNode,
            flags: (FS as any).modeStringToFlags('w'),
            seekable: false,
            stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;

        return {
            readable_fd: readableStream.fd,
            writable_fd: writableStream.fd
        };
    }, stream_ops: {
        poll: function (stream) {
            var pipe = stream.node.pipe;

            if ((stream.flags & 2097155) === 1) {
                return (256 | 4);
            } else {
                if (pipe.buckets.length > 0) {
                    for (var i = 0; i < pipe.buckets.length; i++) {
                        var bucket = pipe.buckets[i];
                        if (bucket.offset - bucket.roffset > 0) {
                            return (64 | 1);
                        }
                    }
                }
            }

            return 0;
        }, ioctl: function (stream, request, varargs) {
            return ERRNO_CODES.EINVAL;
        }, fsync: function (stream) {
            return ERRNO_CODES.EINVAL;
        }, read: function (stream, buffer, offset, length, position /* ignored */) {
            var pipe = stream.node.pipe;
            var currentLength = 0;

            for (var i = 0; i < pipe.buckets.length; i++) {
                var bucket = pipe.buckets[i];
                currentLength += bucket.offset - bucket.roffset;
            }

            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);

            if (length <= 0) {
                return 0;
            }
            if (currentLength == 0) {
                // Behave as if the read end is always non-blocking
                throw new (FS as any).ErrnoError(ERRNO_CODES.EAGAIN);
            }
            var toRead = Math.min(currentLength, length);

            var totalRead = toRead;
            var toRemove = 0;

            for (var i = 0; i < pipe.buckets.length; i++) {
                var currBucket = pipe.buckets[i];
                var bucketSize = currBucket.offset - currBucket.roffset;

                if (toRead <= bucketSize) {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    if (toRead < bucketSize) {
                        tmpSlice = tmpSlice.subarray(0, toRead);
                        currBucket.roffset += toRead;
                    } else {
                        toRemove++;
                    }
                    data.set(tmpSlice);
                    break;
                } else {
                    var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
                    data.set(tmpSlice);
                    data = data.subarray(tmpSlice.byteLength);
                    toRead -= tmpSlice.byteLength;
                    toRemove++;
                }
            }

            if (toRemove && toRemove == pipe.buckets.length) {
                // Do not generate excessive garbage in use cases such as
                // write several bytes, read everything, write several bytes, read everything...
                toRemove--;
                pipe.buckets[toRemove].offset = 0;
                pipe.buckets[toRemove].roffset = 0;
            }

            pipe.buckets.splice(0, toRemove);

            return totalRead;
        }, write: function (stream, buffer, offset, length, position /* ignored */) {
            var pipe = stream.node.pipe;

            assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
            var data = buffer.subarray(offset, offset + length);

            var dataLen = data.byteLength;
            if (dataLen <= 0) {
                return 0;
            }

            var currBucket: any = null;

            if (pipe.buckets.length == 0) {
                currBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: 0,
                    roffset: 0
                };
                pipe.buckets.push(currBucket);
            } else {
                currBucket = pipe.buckets[pipe.buckets.length - 1];
            }

            assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);

            var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
            if (freeBytesInCurrBuffer >= dataLen) {
                currBucket.buffer.set(data, currBucket.offset);
                currBucket.offset += dataLen;
                return dataLen;
            } else if (freeBytesInCurrBuffer > 0) {
                currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
                currBucket.offset += freeBytesInCurrBuffer;
                data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
            }

            var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
            var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;

            for (var i = 0; i < numBuckets; i++) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: PIPEFS.BUCKET_BUFFER_SIZE,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
                data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
            }

            if (remElements > 0) {
                var newBucket = {
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: data.byteLength,
                    roffset: 0
                };
                pipe.buckets.push(newBucket);
                newBucket.buffer.set(data);
            }

            return dataLen;
        }, close: function (stream) {
            var pipe = stream.node.pipe;
            pipe.buckets = null;
        }
    }, nextname: function () {
        if (!(PIPEFS.nextname as any).current) {
            (PIPEFS.nextname as any).current = 0;
        }
        return 'pipe[' + ((PIPEFS.nextname as any).current++) + ']';
    }
}

const SYSCALLS: any = {
    DEFAULT_POLLMASK: 5, mappings: {}, umask: 511, calculateAt: function (dirfd, path) {
        if (path[0] !== '/') {
            // relative path
            var dir;
            if (dirfd === -100) {
                dir = (FS as any).cwd();
            } else {
                var dirstream = (FS as any).getStream(dirfd);
                if (!dirstream) throw new (FS as any).ErrnoError(8);
                dir = dirstream.path;
            }
            path = PATH.join2(dir, path);
        }
        return path;
    }, doStat: function (func, path, buf) {
        try {
            var stat = func(path);
        } catch (e:any) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize((FS as any).getPath(e.node))) {
                // an error occurred while trying to look up the path; we should just report ENOTDIR
                return -54;
            }
            throw e;
        }
        HEAP32[((buf) >> 2)] = stat.dev;
        HEAP32[(((buf) + (4)) >> 2)] = 0;
        HEAP32[(((buf) + (8)) >> 2)] = stat.ino;
        HEAP32[(((buf) + (12)) >> 2)] = stat.mode;
        HEAP32[(((buf) + (16)) >> 2)] = stat.nlink;
        HEAP32[(((buf) + (20)) >> 2)] = stat.uid;
        HEAP32[(((buf) + (24)) >> 2)] = stat.gid;
        HEAP32[(((buf) + (28)) >> 2)] = stat.rdev;
        HEAP32[(((buf) + (32)) >> 2)] = 0;
        (tempI64 = [stat.size >>> 0, (tempDouble = stat.size, (+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[(((buf) + (40)) >> 2)] = tempI64[0], HEAP32[(((buf) + (44)) >> 2)] = tempI64[1]);
        HEAP32[(((buf) + (48)) >> 2)] = 4096;
        HEAP32[(((buf) + (52)) >> 2)] = stat.blocks;
        HEAP32[(((buf) + (56)) >> 2)] = (stat.atime.getTime() / 1000) | 0;
        HEAP32[(((buf) + (60)) >> 2)] = 0;
        HEAP32[(((buf) + (64)) >> 2)] = (stat.mtime.getTime() / 1000) | 0;
        HEAP32[(((buf) + (68)) >> 2)] = 0;
        HEAP32[(((buf) + (72)) >> 2)] = (stat.ctime.getTime() / 1000) | 0;
        HEAP32[(((buf) + (76)) >> 2)] = 0;
        (tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, (+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble) / 4294967296.0))), 4294967295.0)) | 0) >>> 0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble))) >>> 0)) / 4294967296.0))))) >>> 0) : 0)], HEAP32[(((buf) + (80)) >> 2)] = tempI64[0], HEAP32[(((buf) + (84)) >> 2)] = tempI64[1]);
        return 0;
    }, doMsync: function (addr, stream, len, flags, offset) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        (FS as any).msync(stream, buffer, offset, len, flags);
    }, doMkdir: function (path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length - 1] === '/') path = path.substr(0, path.length - 1);
        (FS as any).mkdir(path, mode, 0);
        return 0;
    }, doMknod: function (path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default: return -28;
        }
        (FS as any).mknod(path, mode, dev);
        return 0;
    }, doReadlink: function (path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = (FS as any).readlink(path);

        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf + len] = endChar;

        return len;
    }, doAccess: function (path, amode) {
        if (amode & ~7) {
            // need a valid mode
            return -28;
        }
        var node;
        var lookup = (FS as any).lookupPath(path, { follow: true });
        node = lookup.node;
        if (!node) {
            return -44;
        }
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && (FS as any).nodePermissions(node, perms)) {
            return -2;
        }
        return 0;
    }, doDup: function (path, flags, suggestFD) {
        var suggest = (FS as any).getStream(suggestFD);
        if (suggest) (FS as any).close(suggest);
        return (FS as any).open(path, flags, 0, suggestFD, suggestFD).fd;
    }, doReadv: function (stream, iov, iovcnt, offset?) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov) + (i * 8)) >> 2)];
            var len = HEAP32[(((iov) + (i * 8 + 4)) >> 2)];
            var curr = (FS as any).read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break; // nothing more to read
        }
        return ret;
    }, doWritev: function (stream, iov, iovcnt, offset?) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[(((iov) + (i * 8)) >> 2)];
            var len = HEAP32[(((iov) + (i * 8 + 4)) >> 2)];
            var curr = (FS as any).write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
        }
        return ret;
    }, varargs: 0, get: function (varargs?) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs) - (4)) >> 2)];
        return ret;
    }, getStr: function () {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
    }, getStreamFromFD: function (fd?) {
        // TODO: when all syscalls use wasi, can remove the next line
        if (fd === undefined) fd = SYSCALLS.get();
        var stream = (FS as any).getStream(fd);
        if (!stream) throw new (FS as any).ErrnoError(8);
        return stream;
    }, get64: function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
    }, getZero: function () {
        assert(SYSCALLS.get() === 0);
    }
}

export const PATH_FS = {
    resolve: function (...args: any[]) {
        var resolvedPath = '',
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = (i >= 0) ? arguments[i] : (FS as any).cwd();
            // Skip empty and invalid entries
            if (typeof path !== 'string') {
                throw new TypeError('Arguments to path.resolve must be strings');
            } else if (!path) {
                return ''; // an invalid portion invalidates the whole thing
            }
            resolvedPath = path + '/' + resolvedPath;
            resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function (p) {
            return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    },
    relative: function (from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== '') break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== '') break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break;
            }
        }
        var outputParts: any[] = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
    }
}

export const PATH = {
    splitPath: function (filename: string): string[] | undefined {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename)?.slice(1);
    },
    normalizeArray: function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === '.') {
                parts.splice(i, 1);
            } else if (last === '..') {
                parts.splice(i, 1);
                up++;
            } else if (up) {
                parts.splice(i, 1);
                up--;
            }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift('..');
            }
        }
        return parts;
    },
    normalize: function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function (p) {
            return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
            path = '.';
        }
        if (path && trailingSlash) {
            path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
    },
    dirname: function (path: string): string {
        let result: any = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            // No dirname whatsoever
            return '.';
        }
        if (dir) {
            // It has a dirname, strip trailing slash
            dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
    },
    basename: function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1);
    },
    extname: function (path) {
        return (PATH.splitPath(path) as any)[3];
    },
    join: function (...args: any[]) {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
    },
    join2: function (l, r) {
        return PATH.normalize(l + '/' + r);
    }
}

FS.staticInit();