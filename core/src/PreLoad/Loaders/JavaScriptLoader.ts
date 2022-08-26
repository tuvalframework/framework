import { LoadItem } from '../Data/LoadItem';
import { Types } from '../Data/Types';
import { Elements } from '../Utils/Elements';
import { AbstractLoader } from './AbstractLoader';

export class JavaScriptLoader extends AbstractLoader {
    // constructor
    /**
     * A loader for JavaScript files.
     * @class JavaScriptLoader
     * @param {LoadItem|Object} loadItem
     * @param {Boolean} preferXHR
     * @extends AbstractLoader
     * @constructor
     */
    public constructor(loadItem: LoadItem | Object, preferXHR: boolean) {
        super(loadItem, preferXHR, Types.JAVASCRIPT);

        // public properties
        this.resultFormatter = this._formatResult;

        // protected properties
        this._tagSrcAttribute = "src";
        this.SetTag(Elements.script());
    }


    // static methods
    /**
     * Determines if the loader can load a specific item. This loader can only load items that are of type
     * {{#crossLink "Types/JAVASCRIPT:property"}}{{/crossLink}}
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    public static CanLoadItem(item) {
        return item.type === Types.JAVASCRIPT;
    };

    // protected methods
    /**
     * The result formatter for JavaScript files.
     * @method _formatResult
     * @param {AbstractLoader} loader
     * @returns {HTMLLinkElement|HTMLStyleElement}
     * @private
     */
    private _formatResult(loader: AbstractLoader) {
        const tag: any = loader.GetTag();
        if (this._preferXHR) {
            tag.text = loader.GetResult(true);
        }
        return tag;
    };
}