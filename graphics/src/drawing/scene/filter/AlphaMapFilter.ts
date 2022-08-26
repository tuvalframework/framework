import { Filter } from "./Filter";
import { createCanvas } from "../utils/Canvas";


/**
 * Applies a greyscale alpha map image (or canvas) to the target, such that the alpha channel of the result will
 * be copied from the red channel of the map, and the RGB channels will be copied from the target.
 *
 * Generally, it is recommended that you use {@link easeljs.AlphaMaskFilter}, because it has much better performance.
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 * @example *
 * let box = new Shape();
 * box.graphics.beginLinearGradientFill(["#ff0000", "#0000ff"], [0, 1], 0, 0, 0, 100)
 * box.graphics.drawRect(0, 0, 100, 100);
 * box.cache(0, 0, 100, 100);
 * let bmp = new Bitmap("path/to/image.jpg");
 * bmp.filters = [ new AlphaMapFilter(box.cacheCanvas) ];
 * bmp.cache(0, 0, 100, 100);
 *
 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} alphaMap The greyscale image (or canvas) to use as the alpha value for the
 * result. This should be exactly the same dimensions as the target.
 */
export class AlphaMapFilter extends Filter {

    /**
		 * The greyscale image (or canvas) to use as the alpha value for the result. This should be exactly the same
		 * dimensions as the target.
		 * @type {HTMLImageElement|HTMLCanvasElement|WebGLTexture}
		 */
    private alphaMap: any;

    /**
     * @protected
     * @type {HTMLImageElement|HTMLCanvasElement}
     * @default null
     */
    private _map: HTMLImageElement | HTMLCanvasElement = null as any;

    /**
		 * @protected
		 * @type {CanvasRenderingContext2D}
		 * @default null
		 */
    private _mapCtx: CanvasRenderingContext2D = null as any;

    /**
     * @protected
     * @type {WebGLTexture}
     * @default null
     */
    private _mapTexture: WebGLTexture = null as any;

    protected FRAG_SHADER_BODY: string = `
			uniform sampler2D uAlphaSampler;

			void main (void) {
				vec4 color = texture2D(uSampler, vTextureCoord);
				vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);

				// some image formats can have transparent white rgba(1,1,1, 0) when put on the GPU, this means we need a slight tweak
				// using ceil ensure that the colour will be used so long as it exists but pure transparency will be treated black
				float newAlpha = alphaMap.r * ceil(alphaMap.a);
				gl_FragColor = vec4(clamp(color.rgb/color.a, 0.0, 1.0) * newAlpha, newAlpha);
			}
		`;

    constructor(alphaMap) {
        super();

        if (!Filter.isValidImageSource(alphaMap)) {
            throw "Must provide valid image source for alpha map, see Filter.isValidImageSource";
        }


        this.alphaMap = alphaMap;

        if (alphaMap instanceof WebGLTexture) {
            this._mapTexture = alphaMap;
        }
    }

    /**
     * @todo docs
     * @param {*} gl
     * @param {*} stage
     * @param {*} shaderProgram
     */
    public shaderParamSetup(gl, stage, shaderProgram) {
        if (this._mapTexture === null) { this._mapTexture = gl.createTexture(); }

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
        stage.setTextureParams(gl);

        if (this.alphaMap !== this._mapTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
        }

        gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
            1
        );
    }

    /**
     * @return {easeljs.AlphaMapFilter}
     */
    public clone(): Filter {
        return new AlphaMapFilter(this.alphaMap);
    }

    protected _applyFilter(imageData: ImageData) {
        if (!this._prepAlphaMap()) { return false; }

        const { data: outArray, width, height } = imageData;
        let rowOffset, pixelStart;

        const {
            data: sampleData,
            width: sampleWidth,
            height: sampleHeight
        } = this._mapCtx.getImageData(0, 0, this._map.width, this._map.height);
        let sampleRowOffset, samplePixelStart;

        const widthRatio = sampleWidth / width;
        const heightRatio = sampleHeight / height;

        // performance optimizing lookup

        // the x and y need to stretch separately, nesting the for loops simplifies this logic even if the array is flat
        for (let i = 0; i < height; i++) {
            rowOffset = i * width;
            sampleRowOffset = ((i * heightRatio) | 0) * sampleWidth;

            // the arrays are int arrays, so a single pixel is [r,g,b,a, ...],so calculate the start of the pixel
            for (let j = 0; j < width; j++) {
                pixelStart = (rowOffset + j) * 4;
                samplePixelStart = (sampleRowOffset + ((j * widthRatio) | 0)) * 4;

                // modify the pixels
                outArray[pixelStart] = outArray[pixelStart];
                outArray[pixelStart + 1] = outArray[pixelStart + 1];
                outArray[pixelStart + 2] = outArray[pixelStart + 2];
                outArray[pixelStart + 3] = outArray[pixelStart + 3];
            }
        }

        return true;
    }

    /**
     * @protected
     */
    _prepAlphaMap() {
        if (!this.alphaMap) { return false; }
        if (this.alphaMap === this._map && this._mapCtx) { return true; }
        const map = this._map = this.alphaMap;
        let ctx;
        if (map instanceof HTMLCanvasElement) {
            ctx = map.getContext("2d");
        } else {
            ctx = createCanvas(map.width, map.height).getContext("2d");
            ctx.drawImage(map, 0, 0);
        }
        this._mapCtx = ctx;
        return true;
    }

}
