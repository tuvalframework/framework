import { TModule } from "./Module";

export class WasmModule<IAsm> extends TModule {
    private wasmMemory: any = null;

    private wasmTable: any = null;
    private wasmBinary: any = null;
    private wasmBinaryFile: string = null as any;
    public asm: IAsm = null as any;
    public constructor(wasmFile: string) {
        super();
        this.wasmBinaryFile = wasmFile;
        if (!this.isDataURI(this.wasmBinaryFile)) {
            this.wasmBinaryFile = this.locateFile(this.wasmBinaryFile);
        }
        this.createWasm();
    }


    private createWasm(): any {
        // prepare importss

        const _emscripten_memcpy_big = (dest, src, num) => {
            this.HEAPU8.copyWithin(dest, src, src + num);
        }
        const _fd_write = (fd, iov, iovcnt, pnum) => {
            // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
            var num = 0;
            for (var i = 0; i < iovcnt; i++) {
                var ptr = this.HEAP32[(((iov) + (i * 8)) >> 2)];
                var len = this.HEAP32[(((iov) + (i * 8 + 4)) >> 2)];
                for (var j = 0; j < len; j++) {
                    //SYSCALLS.printChar(fd, HEAPU8[ptr+j]);
                }
                num += len;
            }
            this.HEAP32[((pnum) >> 2)] = num
            return 0;
        }
        const _setTempRet0 = ($i) => {
            //setTempRet0(($i) | 0);
        }

        var asmLibraryArg = {
            "emscripten_memcpy_big": _emscripten_memcpy_big,
            "fd_write": _fd_write,
            "setTempRet0": _setTempRet0
        };


        var info = {
            'env': asmLibraryArg,
            'wasi_snapshot_preview1': asmLibraryArg,
        };
        // Load the wasm module and create an instance of using native support in the JS engine.
        // handle a generated wasm instance, receiving its exports and
        // performing other necessary setup
        /** @param {WebAssembly.Module=} module*/
        const receiveInstance = (instance, module?) => {
            var exports = instance.exports;

            this.asm = exports;

            this.wasmMemory = exports.memory;
            this.assert(this.wasmMemory, "memory not found in wasm exports");
            // This assertion doesn't hold when emscripten is run in --post-link
            // mode.
            // TODO(sbc): Read INITIAL_MEMORY out of the wasm file in post-link mode.
            //assert(wasmMemory.buffer.byteLength === 16777216);
            this.updateGlobalBufferAndViews(this.wasmMemory.buffer);

            this.wasmTable = exports['__indirect_function_table'];
            this.assert(this.wasmTable, "table not found in wasm exports");

            this.RemoveRunDependency('wasm-instantiate');
        }
        // we can't run yet (except in a pthread, where we have a custom sync instantiator)
        this.AddRunDependency('wasm-instantiate');

        // Async compilation can be confusing when an error on the page overwrites Module
        // (for example, if the order of elements is wrong, and the one defining Module is
        // later), so we save Module and check it later.
        let trueModule: any = TModule;
        const receiveInstantiatedSource = (output) => {
            // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
            // receiveInstance() will swap in the exports (to Module.asm) so they can be called
            this.assert(TModule === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
            trueModule = null;
            // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
            // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
            receiveInstance(output['instance']);
        }

        const instantiateArrayBuffer = (receiver) => {
            return this.getBinaryPromise().then((binary) => {
                return WebAssembly.instantiate(binary, info);
            }).then(receiver, (reason) => {
                this.err('failed to asynchronously prepare wasm: ' + reason);

                // Warn on some common problems.
                if (this.isFileURI(this.wasmBinaryFile)) {
                    this.err('warning: Loading from a file URI (' + this.wasmBinaryFile + ') is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing');
                }
                this.abort(reason);
            });
        }

        // Prefer streaming instantiation if available.
        const instantiateAsync = () => {
            if (!this.wasmBinary &&
                typeof WebAssembly.instantiateStreaming === 'function' &&
                !this.isDataURI(this.wasmBinaryFile) &&
                typeof fetch === 'function') {
                return fetch(this.wasmBinaryFile, { credentials: 'same-origin' }).then((response) => {
                    var result = WebAssembly.instantiateStreaming(response, info);
                    return result.then(receiveInstantiatedSource, function (reason) {
                        // We expect the most common failure cause to be a bad MIME type for the binary,
                        // in which case falling back to ArrayBuffer instantiation should work.
                        this.err('wasm streaming compile failed: ' + reason);
                        this.err('falling back to ArrayBuffer instantiation');
                        return instantiateArrayBuffer(receiveInstantiatedSource);
                    });
                });
            } else {
                return instantiateArrayBuffer(receiveInstantiatedSource);
            }
        }

        // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
        // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
        // to any other async startup actions they are performing.
        /* if (Module['instantiateWasm']) {
            try {
                var exports = Module['instantiateWasm'](info, receiveInstance);
                return exports;
            } catch (e) {
                err('Module.instantiateWasm callback failed with error: ' + e);
                return false;
            }
        } */

        instantiateAsync();
        return {}; // no exports yet; we'll fill them in later
    }

    private getBinary(file: string) {
        try {
            if (file === this.wasmBinaryFile && this.wasmBinary) {
                return new Uint8Array(this.wasmBinary);
            }
            if (this.readBinary != null) {
                return this.readBinary(file);
            } else {
                throw "both async and sync fetching of the wasm failed";
            }
        }
        catch (err) {
            this.abort(err);
        }
    }

    private getBinaryPromise(): Promise<any> {
        // If we don't have the binary yet, try to to load it asynchronously.
        // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
        // See https://github.com/github/fetch/pull/92#issuecomment-140665932
        // Cordova or Electron apps are typically loaded from a file:// url.
        // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
        if (!this.wasmBinary /* && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) */) {
            if (typeof fetch === 'function'
            ) {
                return fetch(this.wasmBinaryFile, { credentials: 'same-origin' }).then((response) => {
                    if (!response['ok']) {
                        throw "failed to load wasm binary file at '" + this.wasmBinaryFile + "'";
                    }
                    return response['arrayBuffer']();
                }).catch(() => {
                    return this.getBinary(this.wasmBinaryFile);
                });
            }
        }

        // Otherwise, getBinary should be able to get it synchronously
        return Promise.resolve().then(() => { return this.getBinary(this.wasmBinaryFile); });
    }
}