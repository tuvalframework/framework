import { quantize } from "../Math/Quantize";
import { CGImage } from '@tuval/cg';
import { int, byte } from '@tuval/core';

function createPixelArray(imgData, pixelCount, quality) {
    const pixels = imgData;
    const pixelArray: any[] = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

        // If pixel is mostly opaque and not white
        //if (typeof a === 'undefined' || a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        //}
    }
    return pixelArray;
}

function validateOptions(options) {
    let { colorCount, quality } = options;

    if (typeof colorCount === 'undefined' || !Number.isInteger(colorCount)) {
        colorCount = 10;
    } else if (colorCount === 1) {
        throw new Error('colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()');
    } else {
        colorCount = Math.max(colorCount, 2);
        colorCount = Math.min(colorCount, 20);
    }

    if (typeof quality === 'undefined' || !Number.isInteger(quality) || quality < 1) {
        quality = 10;
    }

    return {
        colorCount,
        quality
    }
}

/*
  CanvasImage Class
  Class that wraps the html image element and canvas.
  It also simplifies some of the canvas context manipulation
  with a set of helper functions.
*/

const CanvasImage = function (image) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.width = this.canvas.width = image.naturalWidth;
    this.height = this.canvas.height = image.naturalHeight;
    this.context.drawImage(image, 0, 0, this.width, this.height);
};

CanvasImage.prototype.getImageData = function () {
    return this.context.getImageData(0, 0, this.width, this.height);
};


export class ColorThief {
    /*
     * getColor(sourceImage[, quality])
     * returns {r: num, g: num, b: num}
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar
     * colors and return the base color from the largest cluster.
     *
     * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster a color will be returned but the greater the likelihood that it will not be the visually
     * most dominant color.
     *
     * */
    public GetColor(sourceImage: CGImage, quality = 10) {
        const palette = this.GetPalette(sourceImage, 5, quality);
        const dominantColor = palette[0];
        return dominantColor;
    }


    public GetPalette(sourceImage: CGImage, colorCount?: int, quality?: int): byte[][] {
        const options = validateOptions({
            colorCount,
            quality
        });

        // Create custom CanvasImage object
        //const image      = new CanvasImage(sourceImage);
        sourceImage.loadPixels();
        const imageData = sourceImage.Pixels;
        const pixelCount = sourceImage.Width * sourceImage.Height;

        const pixelArray = createPixelArray(imageData, pixelCount, options.quality);

        // Send array to quantize function which clusters values
        // using median cut algorithm
        const cmap = quantize(pixelArray, options.colorCount);
        const palette = cmap ? cmap.palette() : null;

        return palette;
    }

    public GetColorFromUrl(imageUrl, callback, quality) {
        const sourceImage = document.createElement("img");

        sourceImage.addEventListener('load', () => {
            const palette = this.GetPalette(sourceImage as any, 5, quality);
            const dominantColor = palette[0];
            callback(dominantColor, imageUrl);
        });
        sourceImage.src = imageUrl
    }
    public GetImageData(imageUrl, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (this.status == 200) {
                let uInt8Array = new Uint8Array(this.response);
                const i = uInt8Array.length;
                let binaryString = new Array(i);
                for (let i = 0; i < uInt8Array.length; i++) {
                    binaryString[i] = String.fromCharCode(uInt8Array[i]);
                }
                let data = binaryString.join('');
                let base64 = window.btoa(data);
                callback('data:image/png;base64,' + base64);
            }
        }
        xhr.send();
    };

    public GetColorAsync(imageUrl, callback, quality) {
        const thief = this;
        this.GetImageData(imageUrl, function (imageData) {
            const sourceImage = document.createElement("img");
            sourceImage.addEventListener('load', function () {
                const palette = thief.GetPalette(sourceImage as any, 5, quality);
                const dominantColor = palette[0];
                callback(dominantColor, this);
            });
            sourceImage.src = imageData;
        });
    }
}


/*
 * getPalette(sourceImage[, colorCount, quality])
 * returns array[ {r: num, g: num, b: num}, {r: num, g: num, b: num}, ...]
 *
 * Use the median cut algorithm provided by quantize.js to cluster similar colors.
 *
 * colorCount determines the size of the palette; the number of colors returned. If not set, it
 * defaults to 10.
 *
 * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
 * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
 * faster the palette generation but the greater the likelihood that colors will be missed.
 *
 *
 */
/* ColorThief.prototype.getPalette = function(sourceImage, colorCount, quality) {
    const options = validateOptions({
        colorCount,
        quality
    });

    // Create custom CanvasImage object
    const image      = new CanvasImage(sourceImage);
    const imageData  = image.getImageData();
    const pixelCount = image.width * image.height;

    const pixelArray = createPixelArray(imageData.data, pixelCount, options.quality);

    // Send array to quantize function which clusters values
    // using median cut algorithm
    const cmap    = quantize(pixelArray, options.colorCount);
    const palette = cmap? cmap.palette() : null;

    return palette;
}; */
