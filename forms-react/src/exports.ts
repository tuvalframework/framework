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

import React from 'react'
import _ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';

globalObject['tuval$react'] = React;
globalObject['tuval$react$dom'] = ReactDOM;
globalObject['tuval$react$_dom'] = _ReactDOM;

globalObject['tuval$forms'] = forms;

if (is.workerContext()) {
    console.log('tuval forms yüklendi.');
    console.log(globalObject['tuval$forms']);
}


