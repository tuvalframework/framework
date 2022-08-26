import {is} from '@tuval/core';
declare var OffscreenCanvas;
export function createCanvasElement(): any {
  if (is.workerContext()) {
      return new OffscreenCanvas(1,1);
  } else {
    const canvas = (<any>window).document.createElement('canvas');
    try {
      (<any>canvas).style = canvas.style || {};
    } catch (e) {
      return canvas;
    }
    return canvas;
  }
}

export function get2DCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d') as any;
}
