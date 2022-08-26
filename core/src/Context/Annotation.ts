import {
    isArray,
    isClass
} from './Utils';


export function annotate(...args: any[]) {
    var args = Array.prototype.slice.call(arguments);

    if (args.length === 1 && isArray(args[0])) {
        args = args[0];
    }

    var fn = args.pop();

    fn.$inject = args;

    return fn;
}


// Current limitations:
// - can't put into "function arg" comments
// function /* (no parenthesis like this) */ (){}
// function abc( /* xx (no parenthesis like this) */ a, b) {}
//
// Just put the comment before function or inside:
// /* (((this is fine))) */ function(a, b) {}
// function abc(a) { /* (((this is fine))) */}
//
// - can't reliably auto-annotate constructor; we'll match the
// first constructor(...) pattern found which may be the one
// of a nested class, too.

var CLASS_NAME = /^class\s* ([A-Za-z0-9]+)/m;
var FN_NAME = /^function\s* ([A-Za-z0-9]+)/m;
var CONSTRUCTOR_ARGS = /constructor\s*[^(]*\(\s*([^)]*)\)/m;
var FN_ARGS = /^(?:async )?(?:function\s*)?[^(]*\(\s*([^)]*)\)/m;
var FN_ARG = /\/\*([^*]*)\*\//m;

export function parseAnnotations(fn) {

    if (typeof fn !== 'function') {
        throw new Error('Cannot annotate "' + fn + '". Expected a function!');
    }

    var match = fn.toString().match(isClass(fn) ? CONSTRUCTOR_ARGS : FN_ARGS);

    // may parse class without constructor
    if (!match) {
        return [];
    }

    return match[1] && match[1].split(',').map(function (arg) {
        match = arg.match(FN_ARG);
        return match ? match[1].trim() : arg.trim();
    }) || [];
}

export function parseClassName(fn): string {

    if (typeof fn !== 'function' && typeof fn !== 'string') {
        throw new Error('Cannot annotate "' + fn + '". Expected a function!');
    }

    var match = fn.toString().match(isClass(fn) ? CLASS_NAME : FN_NAME);

    // may parse class without constructor
    if (!match) {
        return null as any;
    }

    return match[1];
}