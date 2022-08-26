import { int } from './../float';

// Drivers are stored here when `defineDriver()` is called.

import { idbDriver } from "./Drivers/Indexeddb";
import { websqlDriver } from "./Drivers/WebSQL";
import { localstorageDriver } from "./Drivers/LocalStorage";
import { is } from "../is";
import { StorageUtils } from "./StorageUtils";
import { Serializer } from "./Serializer";
import { clear } from '../Collections/Array/Utility';
import { NotImplementedException } from './../Exceptions/NotImplementedException';
import { Http } from "../Net/httpDo";

// They are shared across all instances of localForage.
const DefinedDrivers = {};

const DriverSupport = {};

const DefaultDrivers = {
    INDEXEDDB: idbDriver,
    WEBSQL: websqlDriver,
    LOCALSTORAGE: localstorageDriver
};

const DefaultDriverOrder = [
    DefaultDrivers.INDEXEDDB._driver,
    DefaultDrivers.WEBSQL._driver,
    DefaultDrivers.LOCALSTORAGE._driver
];

const OptionalDriverMethods = ['dropInstance'];

const LibraryMethods = [
    'clear',
    'getItem',
    'iterate',
    'key',
    'keys',
    'length',
    'removeItem',
    'setItem'
].concat(OptionalDriverMethods);

const DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'TUVAL', /* localforage */
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        const _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(
                localForageInstance,
                _args
            );
        });
    };
}

function extend(...args: any[]) {
    for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];

        if (arg) {
            for (let key in arg) {
                if (arg.hasOwnProperty(key)) {
                    if (is.array(arg[key])) {
                        arguments[0][key] = arg[key].slice();
                    } else {
                        arguments[0][key] = arg[key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

export class TuvalStorage {
    private _config: any;
    private _defaultConfig: any;
    private _driverSet: any;
    private _initDriver: any;
    private _ready: boolean;
    private _dbInfo: any;
    private _driver: any;
    public constructor(options?) {
        for (let driverTypeKey in DefaultDrivers) {
            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                const driver = DefaultDrivers[driverTypeKey];
                const driverName = driver._driver;
                this[driverTypeKey] = driverName;

                if (!DefinedDrivers[driverName]) {
                    // we don't need to wait for the promise,
                    // since the default drivers can be defined
                    // in a blocking manner
                    this.defineDriver(driver);
                }
            }
        }

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver).catch(() => { });
    }

    public clear(): void { };
    public setItem(key: string, value: any, callbacks?: Function): Promise<any> {
        throw new NotImplementedException('setItem');
    }
    public getItem(key: string, callbacks?: Function): Promise<any> {
        throw new NotImplementedException('getItem');
    }


    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.
    config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if (typeof options === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error(
                    "Can't call config() after localforage " + 'has been used.'
                );
            }

            for (let i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    }

    // Used to define a custom driver, shared across all instances of
    // localForage.
    defineDriver(driverObject, callback?, errorCallback?) {
        const promise = new Promise(function (resolve, reject) {
            try {
                const driverName = driverObject._driver;
                const complianceError = new Error(
                    'Custom driver not compliant; see ' +
                    'https://mozilla.github.io/localForage/#definedriver'
                );

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }

                const driverMethods = LibraryMethods.concat('_initStorage');
                for (let i = 0, len = driverMethods.length; i < len; i++) {
                    const driverMethodName = driverMethods[i];

                    // when the property is there,
                    // it should be a method even when optional
                    const isRequired = !StorageUtils.Includes(
                        OptionalDriverMethods,
                        driverMethodName
                    );
                    if (
                        (isRequired || driverObject[driverMethodName]) &&
                        typeof driverObject[driverMethodName] !== 'function'
                    ) {
                        reject(complianceError);
                        return;
                    }
                }

                const configureMissingMethods = function () {
                    const methodNotImplementedFactory = function (methodName) {
                        return function () {
                            const error = new Error(
                                `Method ${methodName} is not implemented by the current driver`
                            );
                            const promise = Promise.reject(error);
                            StorageUtils.ExecuteCallback(
                                promise,
                                arguments[arguments.length - 1]
                            );
                            return promise;
                        };
                    };

                    for (
                        let i = 0, len = OptionalDriverMethods.length;
                        i < len;
                        i++
                    ) {
                        const optionalDriverMethod = OptionalDriverMethods[i];
                        if (!driverObject[optionalDriverMethod]) {
                            driverObject[
                                optionalDriverMethod
                            ] = methodNotImplementedFactory(
                                optionalDriverMethod
                            );
                        }
                    }
                };

                configureMissingMethods();

                const setDriverSupport = function (support) {
                    if (DefinedDrivers[driverName]) {
                        console.info(
                            `Redefining LocalForage driver: ${driverName}`
                        );
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    // don't use a then, so that we can define
                    // drivers that have simple _support methods
                    // in a blocking manner
                    resolve(null);
                };

                if ('_support' in driverObject) {
                    if (
                        driverObject._support &&
                        typeof driverObject._support === 'function'
                    ) {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        StorageUtils.ExecuteTwoCallbacks(promise, callback, errorCallback);
        return promise;
    }

    driver() {
        return this._driver || null;
    }

    getDriver(driverName, callback?, errorCallback?) {
        const getDriverPromise = DefinedDrivers[driverName]
            ? Promise.resolve(DefinedDrivers[driverName])
            : Promise.reject(new Error('Driver not found.'));

        StorageUtils.ExecuteTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    }

    getSerializer(callback) {
        const serializerPromise = Promise.resolve(Serializer);
        StorageUtils.ExecuteTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    }

    ready(callback) {
        const self = this;

        const promise = self._driverSet.then(() => {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        StorageUtils.ExecuteTwoCallbacks(promise, callback, callback);
        return promise;
    }

    setDriver(drivers, callback?, errorCallback?) {
        const self = this;

        if (!is.array(drivers)) {
            drivers = [drivers];
        }

        const supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = (self as any)._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                let currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        let driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null as any;

                        return self
                            .getDriver(driverName)
                            .then(extendSelfWithDriver)
                            .catch(driverPromiseLoop);
                    }

                    setDriverToConfig();
                    const error = new Error(
                        'No available storage method found.'
                    );
                    self._driverSet = Promise.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        const oldDriverSetDone =
            this._driverSet !== null
                ? this._driverSet.catch(() => Promise.resolve())
                : Promise.resolve();

        this._driverSet = oldDriverSetDone
            .then(() => {
                const driverName = supportedDrivers[0];
                self._dbInfo = null;
                self._ready = null as any;

                return self.getDriver(driverName).then(driver => {
                    self._driver = driver._driver;
                    setDriverToConfig();
                    self._wrapLibraryMethodsWithReady();
                    self._initDriver = initDriver(supportedDrivers);
                });
            })
            .catch(() => {
                setDriverToConfig();
                const error = new Error('No available storage method found.');
                self._driverSet = Promise.reject(error);
                return self._driverSet;
            });

        StorageUtils.ExecuteTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    }

    supports(driverName) {
        return !!DriverSupport[driverName];
    }

    _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    }

    _getSupportedDrivers(drivers) {
        const supportedDrivers: any[] = [];
        for (let i = 0, len = drivers.length; i < len; i++) {
            const driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    }

    _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (let i = 0, len = LibraryMethods.length; i < len; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    }

    createInstance(options) {
        return new TuvalStorage(options);
    }

    public SaveFile(url: string, key: string, callback?: Function): Promise<string> {
        return new Promise((resolve, reject) => {
            Http.Binary(url).then((res) => {
                this.setItem(key, res).then(function (file) {
                    // This will be a valid blob URI for an <img> tag.
                    var blob = new Blob([file]);
                    var imageURI = window.URL.createObjectURL(blob);
                    if (is.function(callback)) {
                        callback(imageURI);
                    }
                    resolve(imageURI);

                    //console.log(imageURI);
                }).catch(function (err) {
                    // This code runs if there were any errors
                    reject(err);
                    //test
                });

            });
        });

    }

    public GetFile(key: string, callback?: Function): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getItem(key).then(file => {
                const blob = new Blob([file]);
                const imageURI = window.URL.createObjectURL(blob);
                callback ?? (imageURI);
                resolve(imageURI);
            });
        });
    }
    public GetFileBytes(key: string, callback?: Function): Promise<Blob> {
        return new Promise((resolve, reject) => {
            this.getItem(key).then(file => {
                /*   const blob = new Blob([file]);
                  const imageURI = window.URL.createObjectURL(blob);
                  callback ?? (imageURI); */
                resolve(file);
            });
        });
    }

    public SaveArrayBuffer(key: string, value: ArrayBuffer, callback?: Function): Promise<ArrayBuffer> {
        return this.setItem(key, value, callback);
    }
    public GetArrayBuffer(key: string, callback?: Function): Promise<ArrayBuffer> {
        return this.getItem(key, callback);
    }

    public SaveString(key: string, value: string, callback?: Function): Promise<string> {
        return this.setItem(key, value, callback);
    }
    public GetString(key: string, callback?: Function): Promise<string> {
        return this.getItem(key, callback);
    }

    public SaveArray<T>(key: string, value: Array<T>, callback?: Function): Promise<Array<T>> {
        return this.setItem(key, value, callback);
    }
    public GetArray<T>(key: string, callback?: Function): Promise<Array<T>> {
        return this.getItem(key, callback);
    }

    public SaveBlob(key: string, value: Blob, callback?: Function): Promise<Blob> {
        return this.setItem(key, value, callback);
    }
    public GetBlob(key: string, callback?: Function): Promise<Blob> {
        return this.getItem(key, callback);
    }

    public SaveFloat32Array(key: string, value: Blob, callback?: Function): Promise<Float32Array> {
        return this.setItem(key, value, callback);
    }
    public GetFloat32Array(key: string, callback?: Function): Promise<Float32Array> {
        return this.getItem(key, callback);
    }

    public SaveFloat64Array(key: string, value: Float64Array, callback?: Function): Promise<Float64Array> {
        return this.setItem(key, value, callback);
    }
    public GetFloat64Array(key: string, callback?: Function): Promise<Float64Array> {
        return this.getItem(key, callback);
    }

    public SaveInt8Array(key: string, value: Int8Array, callback?: Function): Promise<Int8Array> {
        return this.setItem(key, value, callback);
    }
    public GetInt8Array(key: string, callback?: Function): Promise<Int8Array> {
        return this.getItem(key, callback);
    }

    public SaveInt16Array(key: string, value: Int16Array, callback?: Function): Promise<Int16Array> {
        return this.setItem(key, value, callback);
    }
    public GetInt16Array(key: string, callback?: Function): Promise<Int16Array> {
        return this.getItem(key, callback);
    }

    public SaveInt32Array(key: string, value: Int32Array, callback?: Function): Promise<Int32Array> {
        return this.setItem(key, value, callback);
    }
    public GetInt32Array(key: string, callback?: Function): Promise<Int32Array> {
        return this.getItem(key, callback);
    }

    public SaveNumber(key: string, value: number, callback?: Function): Promise<number> {
        return this.setItem(key, value, callback);
    }
    public GetNumber(key: string, callback?: Function): Promise<number> {
        return this.getItem(key, callback);
    }

    public SaveObject(key: string, value: Object, callback?: Function): Promise<Object> {
        return this.setItem(key, value, callback);
    }
    public GetObject(key: string, callback?: Function): Promise<Object> {
        return this.getItem(key, callback);
    }

    public RemoveItem(key: string): Promise<void> {
        return (this as any).removeItem(key);
    }
    public Clear(): Promise<void> {
        return (this as any).clear();
    }
    public Length(): Promise<int> {
        return (this as any).length();
    }
    public Key(index: int): Promise<string> {
        return (this as any).key(index);
    }
    public Keys(): Promise<Array<string>> {
        return (this as any).keys();
    }

    // Uint8Array
    // Uint8ClampedArray
    // Uint16Array
    // Uint32Array
    public SaveUint8Array(key: string, value: Uint8Array, callback?: Function): Promise<Uint8Array> {
        return this.setItem(key, value, callback);
    }
    public GetUint8Array(key: string, callback?: Function): Promise<Uint8Array> {
        return this.getItem(key, callback);
    }

    public SaveUint8ClampedArray(key: string, value: Uint8ClampedArray, callback?: Function): Promise<Uint8ClampedArray> {
        return this.setItem(key, value, callback);
    }
    public GetUint8ClampedArray(key: string, callback?: Function): Promise<Uint8ClampedArray> {
        return this.getItem(key, callback);
    }

    public SaveUint16Array(key: string, value: Uint16Array, callback?: Function): Promise<Uint16Array> {
        return this.setItem(key, value, callback);
    }
    public GetUint16Array(key: string, callback?: Function): Promise<Uint16Array> {
        return this.getItem(key, callback);
    }

    public SaveUint32Array(key: string, value: Uint16Array, callback?: Function): Promise<Uint32Array> {
        return this.setItem(key, value, callback);
    }
    public GetUint32Array(key: string, callback?: Function): Promise<Uint32Array> {
        return this.getItem(key, callback);
    }

}

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.
export const TStorage = new TuvalStorage();
