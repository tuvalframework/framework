import { LoadItem } from '../Data/LoadItem';
import { Types } from '../Data/Types';
import { AbstractLoader } from './AbstractLoader';

export class BinaryLoader extends AbstractLoader {
    // constructor
    /**
     * A loader for binary files. This is useful for loading web audio, or content that requires an ArrayBuffer.
     * @class BinaryLoader
     * @param {LoadItem|Object} loadItem
     * @extends AbstractLoader
     * @constructor
     */
    public constructor(loadItem: LoadItem | Object) {
        super(loadItem, true, Types.BINARY);
        this.on("initialize", this._updateXHR, this);
    }

    // static methods
    /**
     * Determines if the loader can load a specific item. This loader can only load items that are of type
     * {{#crossLink "Types/BINARY:property"}}{{/crossLink}}
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    public static CanLoadItem(item: LoadItem | Object) {
        return (item as any).type === Types.BINARY;
    }

    // private methods
    /**
     * Before the item loads, set the response type to "arraybuffer"
     * @property _updateXHR
     * @param {Event} event
     * @private
     */
    private _updateXHR(event: any) {
        event.loader.SetResponseType("arraybuffer");
    }
}