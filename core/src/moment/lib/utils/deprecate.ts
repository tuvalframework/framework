import extend from './extend';
import { hooks } from './hooks';
import hasOwnProp from './has-own-prop';

function warn(msg) {
    if (
        (hooks as any).suppressDeprecationWarnings === false &&
        typeof console !== 'undefined' &&
        console.warn
    ) {
        console.warn('Deprecation warning: ' + msg);
    }
}

export function deprecate(msg, fn) {
    var firstTime = true;

    return extend(function () {
        if ((hooks as any).deprecationHandler != null) {
            (hooks as any).deprecationHandler(null, msg);
        }
        if (firstTime) {
            var args: any[] = [],
                arg,
                i,
                key,
                argLen = arguments.length;
            for (i = 0; i < argLen; i++) {
                arg = '';
                if (typeof arguments[i] === 'object') {
                    arg += '\n[' + i + '] ';
                    for (key in arguments[0]) {
                        if (hasOwnProp(arguments[0], key)) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                    }
                    arg = arg.slice(0, -2); // Remove trailing comma and space
                } else {
                    arg = arguments[i];
                }
                args.push(arg);
            }
            warn(
                msg +
                    '\nArguments: ' +
                    Array.prototype.slice.call(args).join('') +
                    '\n' +
                    new Error().stack
            );
            firstTime = false;
        }
        return fn.apply(this, arguments);
    }, fn);
}

var deprecations = {};

export function deprecateSimple(name, msg) {
    if ((hooks as any).deprecationHandler != null) {
        (hooks as any).deprecationHandler(name, msg);
    }
    if (!deprecations[name]) {
        warn(msg);
        deprecations[name] = true;
    }
}

(hooks as any).suppressDeprecationWarnings = false;
(hooks as any).deprecationHandler = null;
