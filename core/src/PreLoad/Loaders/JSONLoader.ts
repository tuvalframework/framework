import { LoadItem } from '../Data/LoadItem';
import { Types } from '../Data/Types';
import { DataUtils } from '../Utils/DataUtils';
import { AbstractLoader } from './AbstractLoader';
import { ErrorEvent } from '../Events/ErrorEvent';

export class JSONLoader extends AbstractLoader {
    // constructor
    /**
     * A loader for JSON files. To load JSON cross-domain, use JSONP and the {{#crossLink "JSONPLoader"}}{{/crossLink}}
     * instead. To load JSON-formatted manifests, use {{#crossLink "ManifestLoader"}}{{/crossLink}}, and to
     * load EaselJS SpriteSheets, use {{#crossLink "SpriteSheetLoader"}}{{/crossLink}}.
     * @class JSONLoader
     * @param {LoadItem|Object} loadItem
     * @extends AbstractLoader
     * @constructor
     */
    public constructor(loadItem: LoadItem | Object) {
        super(loadItem, true, Types.JSON);

        // public properties
        this.resultFormatter = this._formatResult;
    }

    // static methods
    /**
     * Determines if the loader can load a specific item. This loader can only load items that are of type
     * {{#crossLink "Types/JSON:property"}}{{/crossLink}}.
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    public static CanLoadItem(item: LoadItem | Object) {
        return (item as any).type === Types.JSON;
    }

    // protected methods
    /**
     * The result formatter for JSON files.
     * @method _formatResult
     * @param {AbstractLoader} loader
     * @returns {HTMLLinkElement|HTMLStyleElement}
     * @private
     */
    private _formatResult(loader: AbstractLoader) {
        let json: any = null;
        try {
            json = DataUtils.parseJSON(loader.GetResult(true));
        } catch (e) {
            const event = new ErrorEvent("JSON_FORMAT", null as any, e);
            this._sendError(event);
            return e;
        }

        return json;
    };
}