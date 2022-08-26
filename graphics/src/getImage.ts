export function getImage (
    arg: string | HTMLImageElement | ImageData,
    callback: Function
  ) {
    let imageObj: HTMLImageElement;

    //if arg is null or undefined
    if (arg === undefined && arg === null) {
      callback(null);
    } else if (this._isElement(arg)) {
      callback(arg);
    } else if (this._isString(arg)) {
      imageObj = new (<any>window).Image();
      imageObj.onload = function () {
        callback(imageObj);
      };
      imageObj.src = <string>arg;
    } else if (arg instanceof ImageData) {
      //if arg is an object that contains the data property, it's an image object
      const canvas = this.createCanvasElement();
      canvas.width = arg.width;
      canvas.height = arg.height;
      const _context = canvas.getContext('2d');
      _context.putImageData(arg, 0, 0);
      this._getImage(canvas.toDataURL(), callback);
    } else {
      callback(null);
    }
  }