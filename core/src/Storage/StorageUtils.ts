declare var BlobBuilder, MozBlobBuilder, WebKitBlobBuilder, MSBlobBuilder;

export class StorageUtils {
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    // Abstracts constructing a Blob object, so it also works in older
    // browsers that don't support the native Blob constructor. (i.e.
    // old QtWebKit versions, at least).
    public static CreateBlob(parts, properties?): Blob {

        /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
        parts = parts || [];
        properties = properties || {};
        try {
            return new Blob(parts, properties);
        } catch (e: any) {
            if (e.name !== 'TypeError') {
                throw e;
            }
            var Builder =
                typeof BlobBuilder !== 'undefined'
                    ? BlobBuilder
                    : typeof MSBlobBuilder !== 'undefined'
                        ? MSBlobBuilder
                        : typeof MozBlobBuilder !== 'undefined'
                            ? MozBlobBuilder
                            : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i = 0; i < parts.length; i += 1) {
                builder.append(parts[i]);
            }
            return builder.getBlob(properties.type);
        }
    }

    public static ExecuteCallback(promise, callback) {
        if (callback) {
            promise.then(
                function (result) {
                    callback(null, result);
                },
                function (error) {
                    callback(error);
                }
            );
        }
    }

    public static ExecuteTwoCallbacks(promise, callback, errorCallback?) {
        if (typeof callback === 'function') {
            promise.then(callback);
        }

        if (typeof errorCallback === 'function') {
            promise.catch(errorCallback);
        }
    }
    public static GetCallback() {
        if (
            arguments.length &&
            typeof arguments[arguments.length - 1] === 'function'
        ) {
            return arguments[arguments.length - 1];
        }
    }
    public static NormalizeKey(key) {
        // Cast the key to a string, as that's all we can set as a key.
        if (typeof key !== 'string') {
            console.warn(`${key} used as a key, but it is not a string.`);
            key = String(key);
        }

        return key;
    }

    public static Includes(array, searchElement) {
        const sameValue = (x, y) =>
            x === y ||
            (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        const len = array.length;
        let i = 0;
        while (i < len) {
            if (sameValue(array[i], searchElement)) {
                return true;
            }
            i++;
        }

        return false;
    }

}