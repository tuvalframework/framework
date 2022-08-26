import { is } from './is';

import * as core from './index';
let globalObject: any = undefined;

/// #if WEB
globalObject = window;
/// #endif

/// #if WP
globalObject = self;
/// #endif

/* if (is.workerContext()) {
    globalObject = self;
} else {
    globalObject = window;
} */


/// #if NODE
globalObject = global;
/// #endif


 globalObject['tuval$core'] = core;

if (is.workerContext()) {
    console.log('tuval core yüklendi.');
    console.log(globalObject['tuval$core']);
}