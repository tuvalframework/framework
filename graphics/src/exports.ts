import * as Graphics from './index';
import {is} from '@tuval/core';

let globalObject: any = undefined;
if (is.workerContext()) {
    globalObject = self;
} else {
    globalObject = window;
}
globalObject['tuval$graphics'] = Graphics;
