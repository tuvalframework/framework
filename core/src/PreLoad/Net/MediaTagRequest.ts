import { AbstractRequest } from './AbstractRequest';
import { LoadItem } from '../Data/LoadItem';
import { proxy } from '../proxy';
import { TagRequest } from './TagRequest';
export class MediaTagRequest extends TagRequest {

    protected _tag: HTMLAudioElement | HTMLVideoElement;
    protected _tagSrcAttribute: string = null as any;
    private _stalledCallback: any;
    private _progressCallback: any;
    /**
     * An {{#crossLink "TagRequest"}}{{/crossLink}} that loads HTML tags for video and audio.
     * @class MediaTagRequest
     * @param {LoadItem} loadItem
     * @param {HTMLAudioElement|HTMLVideoElement} tag
     * @param {String} srcAttribute The tag attribute that specifies the source, such as "src", "href", etc.
     * @constructor
     */
    public constructor(loadItem: LoadItem, tag: HTMLAudioElement | HTMLVideoElement, srcAttribute: string) {
        super(loadItem);

        // protected properties
        this._tag = tag;
        this._tagSrcAttribute = srcAttribute;
        this._loadedHandler = proxy(this._handleTagComplete, this);
    }


    // public methods
    public Load(): void {
        var sc = proxy(this._handleStalled, this);
        this._stalledCallback = sc;

        var pc = proxy(this._handleProgress, this);
        this._handleProgress = pc;

        this._tag.addEventListener("stalled", sc);
        this._tag.addEventListener("progress", pc);

        // This will tell us when audio is buffered enough to play through, but not when its loaded.
        // The tag doesn't keep loading in Chrome once enough has buffered, and we have decided that behaviour is sufficient.
        this._tag.addEventListener && this._tag.addEventListener("canplaythrough", this._loadedHandler as any, false); // canplaythrough callback doesn't work in Chrome, so we use an event.

        super.Load();
    }

    // private methods
    protected _handleReadyStateChange(): void {
        clearTimeout(this._loadTimeout);
        // This is strictly for tags in browsers that do not support onload.
        var tag = this._tag;

        // Complete is for old IE support.
        if ((tag as any).readyState === "loaded" || (tag as any).readyState === "complete") {
            this._handleTagComplete();
        }
    }

    protected _handleStalled(): void {
        //Ignore, let the timeout take care of it. Sometimes its not really stopped.
    }

    /**
     * An XHR request has reported progress.
     * @method _handleProgress
     * @param {Object} event The XHR progress event.
     * @private
     */
    private _handleProgress(event: any): void {
        if (!event || event.loaded > 0 && event.total === 0) {
            return; // Sometimes we get no "total", so just ignore the progress event.
        }

        var newEvent = new ProgressEvent(event.loaded, event.total);
        this.dispatchEvent(newEvent);
    }

    // protected methods
    protected _clean(): void {
        this._tag.removeEventListener && this._tag.removeEventListener("canplaythrough", this._loadedHandler as any);
        this._tag.removeEventListener("stalled", this._stalledCallback);
        this._tag.removeEventListener("progress", this._progressCallback);

        super._clean();
    }
}