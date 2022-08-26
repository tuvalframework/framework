import { is } from '@tuval/core';

declare var OffscreenCanvas;

export function createCanvas(width = 1, height = 1): any {
    let c;
    if (is.workerContext()) {
        return new OffscreenCanvas(width, height);
    } else {
        if ((<any>window).Tuval !== undefined && (<any>window).Tuval.createCanvas !== undefined) {
            c = (<any>window).Tuval.createCanvas();
        }
        if (window.document !== undefined && window.document.createElement !== undefined) {
            c = document.createElement("canvas");
        }
        if (c !== undefined) {
            c.width = width;
            c.height = height;
            return c;
        }
    }

    throw "Canvas not supported in this environment.";
}