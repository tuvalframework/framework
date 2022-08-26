import { AbstractLoader } from './AbstractLoader';
import { LoadItem } from '../Data/LoadItem';
import { Types } from '../Data/Types';
import { DomUtils } from '../Utils/DomUtils';
import { Elements } from '../Utils/Elements';
import { URLUtils } from '../Utils/URLUtils';
import { _Event } from '../../Events/Event';
import { proxy } from '../proxy';
import { ErrorEvent } from '../Events/ErrorEvent';

export class ImageLoader extends AbstractLoader {
    // constructor
    /**
     * A loader for image files.
     * @class ImageLoader
     * @param {LoadItem|Object} loadItem
     * @param {Boolean} preferXHR
     * @extends AbstractLoader
     * @constructor
     */
    public constructor(loadItem: LoadItem | object, preferXHR: boolean) {
        super(loadItem, preferXHR, Types.IMAGE);

        // public properties
        this.resultFormatter = this._formatResult;

        // protected properties
        this._tagSrcAttribute = "src";

        // Check if the preload item is already a tag.
        if (DomUtils.IsImageTag(loadItem)) {
            this._tag = loadItem;
        } else if (DomUtils.IsImageTag((loadItem as any).src)) {
            this._tag = (loadItem as any).src;
        } else if (DomUtils.IsImageTag((loadItem as any).tag)) {
            this._tag = (loadItem as any).tag;
        }

        if (this._tag != null) {
            this._preferXHR = false;
        } else {
            this._tag = Elements.img();
        }

        this.on("initialize", this._updateXHR, this);
    };

    // static methods
    /**
     * Determines if the loader can load a specific item. This loader can only load items that are of type
     * {{#crossLink "Types/IMAGE:property"}}{{/crossLink}}.
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    public static CanLoadItem(item: LoadItem | Object) {
        return (item as any).type === Types.IMAGE;
    }

    // public methods
    public Load(): void {
        if ((this._tag as any).src !== "" && (this._tag as any).complete) {
            (this._request as any)._handleTagComplete();
            this._sendComplete();
            return;
        }

        var crossOrigin = (this._item as any).crossOrigin;
        if (crossOrigin == true) { crossOrigin = "Anonymous"; }
        if (crossOrigin != null && !URLUtils.IsLocal(this._item)) {
            (this._tag as any).crossOrigin = crossOrigin;
        }

        super.Load();
    }

    // protected methods
    /**
     * Before the item loads, set its mimeType and responseType.
     * @property _updateXHR
     * @param {Event} event
     * @private
     */
    private _updateXHR(event: _Event) {
        event.loader.mimeType = 'text/plain; charset=x-user-defined-binary';

        // Only exists for XHR
        if (event.loader.SetResponseType) {
            event.loader.SetResponseType("blob");
        }
    }

    /**
     * The result formatter for Image files.
     * @method _formatResult
     * @param {AbstractLoader} loader
     * @returns {HTMLImageElement}
     * @private
     */
    private _formatResult(loader: AbstractLoader): HTMLImageElement {
        return this._formatImage as any;
    }

    /**
     * The asynchronous image formatter function. This is required because images have
     * a short delay before they are ready.
     * @method _formatImage
     * @param {Function} successCallback The method to call when the result has finished formatting
     * @param {Function} errorCallback The method to call if an error occurs during formatting
     * @private
     */
    private _formatImage(successCallback: Function, errorCallback: Function) {
        const tag: any = this._tag;
        var URL = window.URL || window.webkitURL;

        if (!this._preferXHR) {

            //document.body.removeChild(tag);
        } else if (URL) {
            var objURL = URL.createObjectURL(this.GetResult(true));
            tag.src = objURL;

            tag.addEventListener("load", this._cleanUpURL, false);
            tag.addEventListener("error", this._cleanUpURL, false);
        } else {
            tag.src = (this._item as any).src;
        }

        if (tag.complete) {
            successCallback(tag);
        } else {
            tag.onload = proxy(function () {
                successCallback(this._tag);
                tag.onload = tag.onerror = null;
            }, this);

            tag.onerror = proxy(function (event) {
                errorCallback(new ErrorEvent('IMAGE_FORMAT', null as any, event));
                tag.onload = tag.onerror = null;
            }, this);
        }
    }

    /**
     * Clean up the ObjectURL, the tag is done with it. Note that this function is run
     * as an event listener without a proxy/closure, as it doesn't require it - so do not
     * include any functionality that requires scope without changing it.
     * @method _cleanUpURL
     * @param event
     * @private
     */
    private _cleanUpURL(event: any): void {
        var URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(event.target.src);
    }
}