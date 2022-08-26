import { LoadItem } from "../Data/LoadItem";
import { Types } from "../Data/Types";
import { AbstractLoader } from "./AbstractLoader";

export class TextLoader extends AbstractLoader {
    public constructor(loadItem: LoadItem | Object) {
        super(loadItem, true, Types.TEXT);
    };


    // static methods
    /**
     * Determines if the loader can load a specific item. This loader loads items that are of type {{#crossLink "Types/TEXT:property"}}{{/crossLink}},
     * but is also the default loader if a file type can not be determined.
     * @method canLoadItem
     * @param {LoadItem|Object} item The LoadItem that a LoadQueue is trying to load.
     * @returns {Boolean} Whether the loader can load the item.
     * @static
     */
    public static CanLoadItem = function (item) {
        return item.type === Types.TEXT;
    }
}