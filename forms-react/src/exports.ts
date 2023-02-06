import { is } from '@tuval/core';

import * as forms from './index';
let globalObject: any = undefined;

/// #if WEB
if (is.workerContext()) {
    globalObject = self;
} else {
    globalObject = window;
}
/// #endif

/// #if NODE
///globalObject = global;
/// #endif


globalObject['tuval$forms'] = forms;

if (is.workerContext()) {
    console.log('tuval forms yüklendi.');
    console.log(globalObject['tuval$forms']);
}


