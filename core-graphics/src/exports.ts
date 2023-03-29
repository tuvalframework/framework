import * as CoreGraphics from './index';
import {is} from '@tuval/core';

let globalObject: any = undefined;
if (is.workerContext()) {
    globalObject = self;
} else {
    globalObject = window;
}
globalObject['tuval$core$graphics'] = CoreGraphics;


if (is.workerContext()) {
    console.log('tuval core graphics yüklendi.');
    console.log(globalObject['tuval$core']);
    console.log(globalObject['tuval$core$graphics']);
    }