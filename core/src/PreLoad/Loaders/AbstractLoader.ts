import { _Event } from '../../Events/Event';
import { EventDispatcher } from '../../Events/EventDispatcher';
import { int } from '../../float';
import { LoadItem } from '../Data/LoadItem';
import { TagRequest } from '../Net/TagRequest';
import { XHRRequest } from '../Net/XHRRequest';
import { ProgressEvent } from '../Events/ProgressEvent';
import { ErrorEvent } from '../Events/ErrorEvent';
import { proxy } from '../proxy';

export class AbstractLoader extends EventDispatcher {

    // public properties
    /**
     * If the loader has completed loading. This provides a quick check, but also ensures that the different approaches
     * used for loading do not pile up resulting in more than one `complete` {{#crossLink "Event"}}{{/crossLink}}.
     * @property loaded
     * @type {Boolean}
     * @default false
     */
    public loaded: boolean = false;

    /**
     * Determine if the loader was canceled. Canceled loads will not fire complete events. Note that this property
     * is readonly, so {{#crossLink "LoadQueue"}}{{/crossLink}} queues should be closed using {{#crossLink "LoadQueue/close"}}{{/crossLink}}
     * instead.
     * @property canceled
     * @type {Boolean}
     * @default false
     * @readonly
     */
    public canceled: boolean = false;

    /**
     * The current load progress (percentage) for this item. This will be a number between 0 and 1.
     *
     * <h4>Example</h4>
     *
     *     var queue = new LoadQueue();
     *     queue.loadFile("largeImage.png");
     *     queue.on("progress", function() {
     *         console.log("Progress:", queue.progress, event.progress);
     *     });
     *
     * @property progress
     * @type {Number}
     * @default 0
     */
    public progress: int = 0;

    /**
     * The type of item this loader will load. See {{#crossLink "AbstractLoader"}}{{/crossLink}} for a full list of
     * supported types.
     * @property type
     * @type {String}
     */
    public type: string = '';

    /**
   * A formatter function that converts the loaded raw result into the final result. For example, the JSONLoader
   * converts a string of text into a JavaScript object. Not all loaders have a resultFormatter, and this property
   * can be overridden to provide custom formatting.
   *
   * Optionally, a resultFormatter can return a callback function in cases where the formatting needs to be
   * asynchronous, such as creating a new image. The callback function is passed 2 parameters, which are callbacks
   * to handle success and error conditions in the resultFormatter. Note that the resultFormatter method is
   * called in the current scope, as well as the success and error callbacks.
   *
   * <h4>Example asynchronous resultFormatter</h4>
   *
   * 	function _formatResult(loader) {
   * 		return function(success, error) {
   * 			if (errorCondition) { error(errorDetailEvent); }
   * 			success(result);
   * 		}
   * 	}
   * @property resultFormatter
   * @type {Function}
   * @default null
   */
    public resultFormatter: Function = null as any;

    // protected properties
    /**
     * The {{#crossLink "LoadItem"}}{{/crossLink}} this loader represents. Note that this is null in a {{#crossLink "LoadQueue"}}{{/crossLink}},
     * but will be available on loaders such as {{#crossLink "XMLLoader"}}{{/crossLink}} and {{#crossLink "ImageLoader"}}{{/crossLink}}.
     * @property _item
     * @type {LoadItem|Object}
     * @private
     */
    protected _item: LoadItem | Object = null as any;


    /**
      * Whether the loader will try and load content using XHR (true) or HTML tags (false).
      * @property _preferXHR
      * @type {Boolean}
      * @private
      */
    protected _preferXHR: boolean = false;

    /**
      * The loaded result after it is formatted by an optional {{#crossLink "resultFormatter"}}{{/crossLink}}. For
      * items that are not formatted, this will be the same as the {{#crossLink "_rawResult:property"}}{{/crossLink}}.
      * The result is accessed using the {{#crossLink "getResult"}}{{/crossLink}} method.
      * @property _result
      * @type {Object|String}
      * @private
      */
    private _result: Object | string = null as any;

    /**
     * The loaded result before it is formatted. The rawResult is accessed using the {{#crossLink "getResult"}}{{/crossLink}}
     * method, and passing `true`.
     */
    private _rawResult: Object | string = null as any;

    /**
     * A list of items that loaders load behind the scenes. This does not include the main item the loader is
     * responsible for loading. Examples of loaders that have sub-items include the {{#crossLink "SpriteSheetLoader"}}{{/crossLink}} and
     * {{#crossLink "ManifestLoader"}}{{/crossLink}}.
     * @property _loadItems
     * @type {null}
     * @protected
     */
    private _loadedItems: Array<any> = null as any;

    /**
     * The attribute the items loaded using tags use for the source.
     * @type {string}
     * @default null
     * @private
     */
    protected _tagSrcAttribute: string = null as any;

    /**
     * An HTML tag (or similar) that a loader may use to load HTML content, such as images, scripts, etc.
     * @property _tag
     * @type {Object}
     * @private
     */
    protected _tag: Object = null as any;

    protected _request: TagRequest | XHRRequest = null as any;
    private _loadItems: any = null;
    /**
    * The base loader, which defines all the generic methods, properties, and events. All loaders extend this class,
    * including the {{#crossLink "LoadQueue"}}{{/crossLink}}.
    * @class AbstractLoader
    * @param {LoadItem|object|string} loadItem The item to be loaded.
    * @param {Boolean} [preferXHR] Determines if the LoadItem should <em>try</em> and load using XHR, or take a
    * tag-based approach, which can be better in cross-domain situations. Not all loaders can load using one or the
    * other, so this is a suggested directive.
    * @param {String} [type] The type of loader. Loader types are defined as constants on the AbstractLoader class,
    * such as {{#crossLink "IMAGE:property"}}{{/crossLink}}, {{#crossLink "CSS:property"}}{{/crossLink}}, etc.
    * @extends EventDispatcher
    */
    public constructor(loadItem?: LoadItem | object | string, preferXHR?: boolean, type?: string) {
        super();

        this.loaded = false;
        this.canceled = false;
        this.progress = 0;
        this.type = type as any;
        this.resultFormatter = null as any;
        if (loadItem) {
            this._item = LoadItem.Create(loadItem);
        } else {
            this._item = null as any;
        }

        this._preferXHR = preferXHR as any;
        this._result = null as any;
        this._rawResult = null as any;
        this._loadedItems = null as any;
        this._tagSrcAttribute = null as any;
        this._tag = null as any;
    }

    /**
     * The {{#crossLink "ProgressEvent"}}{{/crossLink}} that is fired when the overall progress changes. Prior to
     * version 0.6.0, this was just a regular {{#crossLink "Event"}}{{/crossLink}}.
     * @event progress
     * @since 0.3.0
     */

    /**
     * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a load starts.
     * @event loadstart
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type.
     * @since 0.3.1
     */

    /**
     * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the entire queue has been loaded.
     * @event complete
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type.
     * @since 0.3.0
     */

    /**
     * The {{#crossLink "ErrorEvent"}}{{/crossLink}} that is fired when the loader encounters an error. If the error was
     * encountered by a file, the event will contain the item that caused the error. Prior to version 0.6.0, this was
     * just a regular {{#crossLink "Event"}}{{/crossLink}}.
     * @event error
     * @since 0.3.0
     */

    /**
     * The {{#crossLink "Event"}}{{/crossLink}} that is fired when the loader encounters an internal file load error.
     * This enables loaders to maintain internal queues, and surface file load errors.
     * @event fileerror
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type ("fileerror")
     * @param {LoadItem|object} The item that encountered the error
     * @since 0.6.0
     */

    /**
     * The {{#crossLink "Event"}}{{/crossLink}} that is fired when a loader internally loads a file. This enables
     * loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}} to maintain internal {{#crossLink "LoadQueue"}}{{/crossLink}}s
     * and notify when they have loaded a file. The {{#crossLink "LoadQueue"}}{{/crossLink}} class dispatches a
     * slightly different {{#crossLink "LoadQueue/fileload:event"}}{{/crossLink}} event.
     * @event fileload
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type ("fileload")
     * @param {Object} item The file item which was specified in the {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}}
     * or {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}} call. If only a string path or tag was specified, the
     * object will contain that value as a `src` property.
     * @param {Object} result The HTML tag or parsed result of the loaded item.
     * @param {Object} rawResult The unprocessed result, usually the raw text or binary data before it is converted
     * to a usable object.
     * @since 0.6.0
     */

    /**
     * The {{#crossLink "Event"}}{{/crossLink}} that is fired after the internal request is created, but before a load.
     * This allows updates to the loader for specific loading needs, such as binary or XHR image loading.
     * @event initialize
     * @param {Object} target The object that dispatched the event.
     * @param {String} type The event type ("initialize")
     * @param {AbstractLoader} loader The loader that has been initialized.
     */


    /**
     * Get a reference to the manifest item that is loaded by this loader. In some cases this will be the value that was
     * passed into {{#crossLink "LoadQueue"}}{{/crossLink}} using {{#crossLink "LoadQueue/loadFile"}}{{/crossLink}} or
     * {{#crossLink "LoadQueue/loadManifest"}}{{/crossLink}}. However if only a String path was passed in, then it will
     * be a {{#crossLink "LoadItem"}}{{/crossLink}}.
     * @method GetItem
     * @return {Object} The manifest item that this loader is responsible for loading.
     * @since 0.6.0
     */

    public GetItem(): LoadItem | Object {
        return this._item;
    }

    /**
     * Get a reference to the content that was loaded by the loader (only available after the {{#crossLink "complete:event"}}{{/crossLink}}
     * event is dispatched.
     * @method getResult
     * @param {Boolean} [raw=false] Determines if the returned result will be the formatted content, or the raw loaded
     * data (if it exists).
     * @return {Object}
     * @since 0.6.0
     */
    public GetResult(raw: boolean = false): any {
        return raw ? this._rawResult : this._result;
    }

    /**
     * Return the `tag` this object creates or uses for loading.
     * @method getTag
     * @return {Object} The tag instance
     * @since 0.6.0
     */
    public GetTag(): Object {
        return this._tag;
    }

    /**
     * Set the `tag` this item uses for loading.
     * @method setTag
     * @param {Object} tag The tag instance
     * @since 0.6.0
     */
    public SetTag(tag: Object) {
        this._tag = tag;
    }

    /**
     * Begin loading the item. This method is required when using a loader by itself.
     *
     * <h4>Example</h4>
     *
     *      var queue = new LoadQueue();
     *      queue.on("complete", handleComplete);
     *      queue.loadManifest(fileArray, false); // Note the 2nd argument that tells the queue not to start loading yet
     *      queue.load();
     *
     * @method load
     */
    public Load() {
        this._createRequest();

        this._request.on("complete", this, this);
        this._request.on("progress", this, this);
        this._request.on("loadStart", this, this);
        this._request.on("abort", this, this);
        this._request.on("timeout", this, this);
        this._request.on("error", this, this);

        var evt = new _Event("initialize");
        evt.loader = this._request;
        this.dispatchEvent(evt);

        this._request.Load();
    }

    /**
     * Close the the item. This will stop any open requests (although downloads using HTML tags may still continue in
     * the background), but events will not longer be dispatched.
     * @method cancel
     */
    public Cancel(): void {
        this.canceled = true;
        this.Destroy();
    }

    /**
     * Clean up the loader.
     * @method destroy
     */
    public Destroy() {
        if (this._request) {
            this._request.removeAllEventListeners();
            this._request.Destroy();
        }

        this._request = null as any;

        this._item = null as any;
        this._rawResult = null as any;
        this._result = null as any;

        this._loadItems = null as any;

        this.removeAllEventListeners();
    }

    /**
     * Get any items loaded internally by the loader. The enables loaders such as {{#crossLink "ManifestLoader"}}{{/crossLink}}
     * to expose items it loads internally.
     * @method getLoadedItems
     * @return {Array} A list of the items loaded by the loader.
     * @since 0.6.0
     */
    public GetLoadedItems(): Array<any> {
        return this._loadedItems;
    }


    // Private methods
    /**
     * Create an internal request used for loading. By default, an {{#crossLink "XHRRequest"}}{{/crossLink}} or
     * {{#crossLink "TagRequest"}}{{/crossLink}} is created, depending on the value of {{#crossLink "preferXHR:property"}}{{/crossLink}}.
     * Other loaders may override this to use different request types, such as {{#crossLink "ManifestLoader"}}{{/crossLink}},
     * which uses {{#crossLink "JSONLoader"}}{{/crossLink}} or {{#crossLink "JSONPLoader"}}{{/crossLink}} under the hood.
     * @method _createRequest
     * @protected
     */
    protected _createRequest(): void {
        if (!this._preferXHR) {
            this._request = new TagRequest(this._item as any, (this._tag || this._createTag()) as any, this._tagSrcAttribute);
        } else {
            this._request = new XHRRequest(this._item);
        }
    }

    /**
     * Create the HTML tag used for loading. This method does nothing by default, and needs to be implemented
     * by loaders that require tag loading.
     * @method _createTag
     * @param {String} src The tag source
     * @return {HTMLElement} The tag that was created
     * @protected
     */
    protected _createTag(src?: string): HTMLElement {
        return null as any;
    }

    /**
     * Dispatch a loadstart {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/loadstart:event"}}{{/crossLink}}
     * event for details on the event payload.
     * @method _sendLoadStart
     * @protected
     */
    protected _sendLoadStart() {
        if (this._isCanceled()) { return; }
        this.dispatchEvent("loadstart");
    }

    /**
     * Dispatch a {{#crossLink "ProgressEvent"}}{{/crossLink}}.
     * @method _sendProgress
     * @param {Number | Object} value The progress of the loaded item, or an object containing <code>loaded</code>
     * and <code>total</code> properties.
     * @protected
     */
    protected _sendProgress(value: int | Object) {
        if (this._isCanceled()) { return; }
        let event: any = null;
        if (typeof (value) == "number") {
            this.progress = value;
            event = new ProgressEvent(this.progress);
        } else {
            event = value;
            this.progress = (value as any).loaded / (value as any).total;
            event.progress = this.progress;
            if (isNaN(this.progress) || this.progress == Infinity) { this.progress = 0; }
        }
        this.hasEventListener("progress") && this.dispatchEvent(event);
    }

    /**
     * Dispatch a complete {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/complete:event"}}{{/crossLink}} event
     * @method _sendComplete
     * @protected
     */
    protected _sendComplete(): void {
        if (this._isCanceled()) { return; }

        this.loaded = true;

        var event = new _Event("complete");
        event.rawResult = this._rawResult;

        if (this._result != null) {
            event.result = this._result;
        }

        this.dispatchEvent(event);
    }

    /**
     * Dispatch an error {{#crossLink "Event"}}{{/crossLink}}. Please see the {{#crossLink "AbstractLoader/error:event"}}{{/crossLink}}
     * event for details on the event payload.
     * @method _sendError
     * @param {ErrorEvent} event The event object containing specific error properties.
     * @protected
     */
    protected _sendError(event: ErrorEvent) {
        if (this._isCanceled() || !this.hasEventListener("error")) { return; }
        if (event == null) {
            event = new ErrorEvent("PRELOAD_ERROR_EMPTY"); // TODO: Populate error
        }
        this.dispatchEvent(event);
    }

    /**
     * Determine if the load has been canceled. This is important to ensure that method calls or asynchronous events
     * do not cause issues after the queue has been cleaned up.
     * @method _isCanceled
     * @return {Boolean} If the loader has been canceled.
     * @protected
     */
    protected _isCanceled = function () {
        return this.canceled;
    }

    /**
     * Handle events from internal requests. By default, loaders will handle, and redispatch the necessary events, but
     * this method can be overridden for custom behaviours.
     * @method handleEvent
     * @param {Event} event The event that the internal request dispatches.
     * @protected
     * @since 0.6.0
     */
    protected handleEvent(event: _Event): void {
        switch (event.type) {
            case "complete":
                this._rawResult = event.target._response;
                var result = this.resultFormatter && this.resultFormatter(this);
                // The resultFormatter is asynchronous
                if (result instanceof Function) {
                    result.call(this,
                        proxy(this._resultFormatSuccess, this),
                        proxy(this._resultFormatFailed, this)
                    );
                    // The result formatter is synchronous
                } else {
                    this._result = result || this._rawResult;
                    this._sendComplete();
                }
                break;
            case "progress":
                this._sendProgress(event);
                break;
            case "error":
                this._sendError(event as any);
                break;
            case "loadstart":
                this._sendLoadStart();
                break;
            case "abort":
            case "timeout":
                if (!this._isCanceled()) {
                    this.dispatchEvent(new ErrorEvent("PRELOAD_" + event.type.toUpperCase() + "_ERROR"));
                }
                break;
        }
    }

    /**
     * The "success" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
     * functions.
     * @method _resultFormatSuccess
     * @param {Object} result The formatted result
     * @private
     */
    private _resultFormatSuccess(result: any) {
        this._result = result;
        this._sendComplete();
    }

    /**
     * The "error" callback passed to {{#crossLink "AbstractLoader/resultFormatter"}}{{/crossLink}} asynchronous
     * functions.
     * @method _resultFormatSuccess
     * @param {Object} error The error event
     * @private
     */
    private _resultFormatFailed(event: any) {
        this._sendError(event);
    }

    /**
     * @method toString
     * @return {String} a string representation of the instance.
     */
    public toString() {
        return "[PreloadJS AbstractLoader]";
    }

}