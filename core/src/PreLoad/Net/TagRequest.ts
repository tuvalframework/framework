import { AbstractRequest } from './AbstractRequest';
import { LoadItem } from '../Data/LoadItem';
import { proxy } from '../proxy';
import { _Event } from '../../Events/Event';
import { DomUtils } from '../Utils/DomUtils';
export class TagRequest extends AbstractRequest {

    // protected properties
    /**
     * The HTML tag instance that is used to load.
     * @property _tag
     * @type {HTMLElement}
     * @protected
     */
    protected _tag: HTMLElement = null as any;
    /**
 * The tag attribute that specifies the source, such as "src", "href", etc.
 * @property _tagSrcAttribute
 * @type {String}
 * @protected
 */
    protected _tagSrcAttribute: string = null as any;

    /**
     * A method closure used for handling the tag load event.
     * @property _loadedHandler
     * @type {Function}
     * @private
     */
    protected _loadedHandler: Function = null as any;

    /**
     * Determines if the element was added to the DOM automatically by PreloadJS, so it can be cleaned up after.
     * @property _addedToDOM
     * @type {Boolean}
     * @private
     */
    private _addedToDOM: boolean = false;

    protected _loadTimeout: any;
    private _rawResult: HTMLElement = null as any;
    private _result: any;
    private resultFormatter: Function = null as any;
    // constructor
    /**
     * An {{#crossLink "AbstractRequest"}}{{/crossLink}} that loads HTML tags, such as images and scripts.
     * @class TagRequest
     * @param {LoadItem} loadItem
     * @param {HTMLElement} tag
     * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
     */
    public constructor(loadItem: LoadItem, tag?: HTMLElement, srcAttribute?: string) {
        super(loadItem);
        this._tag = tag as any;
        this._tagSrcAttribute = srcAttribute as any;
        this._loadedHandler = proxy(this._handleTagComplete, this);
        this._addedToDOM = false;
    }

    // public methods
    public Load(): void {
        this._tag.onload = proxy(this._handleTagComplete, this);
        (this._tag as any).onreadystatechange = proxy(this._handleReadyStateChange, this);
        this._tag.onerror = proxy(this._handleError, this);

        var evt = new _Event("initialize");
        evt.loader = this._tag;

        this.dispatchEvent(evt);

        this._loadTimeout = setTimeout(proxy(this._handleTimeout, this), this._item.loadTimeout);

        this._tag[this._tagSrcAttribute] = this._item.src;

        // wdg:: Append the tag AFTER setting the src, or SVG loading on iOS will fail.
        if (this._tag.parentNode == null) {
            DomUtils.AppendToBody(this._tag);
            this._addedToDOM = true;
        }
    }

    public Destroy(): void {
        this._clean();
        this._tag = null as any;

        super.Destroy();
    };

    // private methods
    /**
     * Handle the readyStateChange event from a tag. We need this in place of the `onload` callback (mainly SCRIPT
     * and LINK tags), but other cases may exist.
     * @method _handleReadyStateChange
     * @private
     */
    protected _handleReadyStateChange(): void {
        clearTimeout(this._loadTimeout);
        // This is strictly for tags in browsers that do not support onload.
        var tag: any = this._tag;

        // Complete is for old IE support.
        if (tag.readyState === "loaded" || tag.readyState === "complete") {
            this._handleTagComplete();
        }
    }

    /**
     * Handle any error events from the tag.
     * @method _handleError
     * @protected
     */
    private _handleError(): void {
        this._clean();
        this.dispatchEvent("error");
    }

    /**
     * Handle the tag's onload callback.
     * @method _handleTagComplete
     * @private
     */
    protected _handleTagComplete() {
        this._rawResult = this._tag;
        this._result = this.resultFormatter && this.resultFormatter(this) || this._rawResult;

        this._clean();

        this.dispatchEvent("complete");
    }

    /**
     * The tag request has not loaded within the time specified in loadTimeout.
     * @method _handleError
     * @param {Object} event The XHR error event.
     * @private
     */
    private _handleTimeout() {
        this._clean();
        this.dispatchEvent(new _Event("timeout"));
    }

    /**
     * Remove event listeners, but don't destroy the request object
     * @method _clean
     * @private
     */
    protected _clean() {
        this._tag.onload = null;
        (this._tag as any).onreadystatechange = null as any;
        this._tag.onerror = null;
        if (this._addedToDOM && this._tag.parentNode != null) {
            this._tag.parentNode.removeChild(this._tag);
        }
        clearTimeout(this._loadTimeout);
    }

    /**
     * Handle a stalled audio event. The main place this happens is with HTMLAudio in Chrome when playing back audio
     * that is already in a load, but not complete.
     * @method _handleStalled
     * @private
     */
    protected _handleStalled(): void {
        //Ignore, let the timeout take care of it. Sometimes its not really stopped.
    }
}