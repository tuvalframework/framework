
import { Filter } from "./Filter";

/**
 * Applies the alpha from the mask image (or canvas) to the target, such that the alpha channel of the result will
 * be derived from the mask, and the RGB channels will be copied from the target. This can be used, for example, to
 * apply an alpha mask to a display object. This can also be used to combine a JPG compressed RGB image with a PNG32
 * alpha mask, which can result in a much smaller file size than a single PNG32 containing ARGB.
 *
 * <b>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters correctly.</b>
 *
 * @memberof easeljs
 * @extends easeljs.Filter
 * @example
 * var box = new Shape();
 * box.graphics.beginLinearGradientFill(["#000000", "rgba(0, 0, 0, 0)"], [0, 1], 0, 0, 100, 100)
 * box.graphics.drawRect(0, 0, 100, 100);
 * box.cache(0, 0, 100, 100);
 * var bmp = new Bitmap("path/to/image.jpg");
 * bmp.filters = [ new AlphaMaskFilter(box.cacheCanvas) ];
 * bmp.cache(0, 0, 100, 100);
 *
 * @param {HTMLImageElement|HTMLCanvasElement|WebGLTexture} mask
 */
export class AlphaMaskFilter extends Filter {

    /**
		 * The image (or canvas) to use as the mask.
		 * @type {HTMLImageElement | HTMLCanvasElement}
		 */
    private mask: HTMLImageElement | HTMLCanvasElement = null as any;


    protected FRAG_SHADER_BODY: string = `
			uniform sampler2D uAlphaSampler;

			void main (void) {
				vec4 color = texture2D(uSampler, vTextureCoord);
				vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);

				gl_FragColor = vec4(color.rgb * alphaMap.a, color.a * alphaMap.a);
			}
        `;

    private _mapTexture: any;
    constructor(mask) {
        super();

        if (!Filter.isValidImageSource(mask)) {
            throw "Must provide valid image source for alpha mask, see Filter.isValidImageSource";
        }

    }

	/**
	 * Applies the filter to the specified context.
	 *
	 * <strong>IMPORTANT NOTE: This filter currently does not support the targetCtx, or targetX/Y parameters correctly.</strong>
	 * @param {CanvasRenderingContext2D} ctx The 2D context to use as the source.
	 * @param {Number} x The x position to use for the source rect.
	 * @param {Number} y The y position to use for the source rect.
	 * @param {Number} width The width to use for the source rect.
	 * @param {Number} height The height to use for the source rect.
	 * @param {CanvasRenderingContext2D} [targetCtx] The 2D context to draw the result to. Defaults to the context passed to ctx.
	 * @return {Boolean} If the filter was applied successfully.
	 */
    public applyFilter(ctx, x, y, width, height, targetCtx): boolean {
        if (!this.mask) {
            return true;
        }

        if (targetCtx === undefined) { targetCtx = ctx; }
        if (targetCtx !== ctx) {
            targetCtx.drawImage(ctx.canvas,
                0, 0, ctx.canvas.width, ctx.canvas.height,
                0, 0, targetCtx.canvas.width, targetCtx.canvas.height
            );
        }

        targetCtx.globalCompositeOperation = "destination-in";
        targetCtx.drawImage(this.mask, 0, 0, this.mask.width, this.mask.height, x, y, width, height);
        targetCtx.restore();
        return true;
    }

	/**
	 * @return {easeljs.AlphaMaskFilter}
	 */
    public clone(): Filter {
        return new AlphaMaskFilter(this.mask);
    }

	/**
	 * @todo docs
	 * @param {*} gl
	 * @param {*} stage
	 * @param {*} shaderProgram
	 */
    public shaderParamSetup(gl, stage, shaderProgram) {
        if (!this._mapTexture) { this._mapTexture = gl.createTexture(); }

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
        stage.setTextureParams(gl);
        if (this.mask !== this._mapTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
        }

        gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
            1
        );
    }

}
