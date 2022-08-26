import { EventDispatcher } from '../../Events/EventDispatcher';
import { LoadItem } from '../Data/LoadItem';
export class AbstractRequest extends EventDispatcher {
    protected _item: any = null;

    /**
         * A base class for actual data requests, such as {{#crossLink "XHRRequest"}}{{/crossLink}}, {{#crossLink "TagRequest"}}{{/crossLink}},
         * and {{#crossLink "MediaRequest"}}{{/crossLink}}. PreloadJS loaders will typically use a data loader under the
         * hood to get data.
         * @class AbstractRequest
         * @param {LoadItem} item
         * @constructor
         */
    public constructor(item: LoadItem) {
        super();
        this._item = item;
    }


    // public methods
    /**
     * Begin a load.
     * @method load
     */
    public  Load(): void {}

    /**
     * Clean up a request.
     * @method destroy
     */
    public  Destroy(): void {}

    /**
     * Cancel an in-progress request.
     * @method cancel
     */
    public  Cancel(): void {}

}