import { _Event } from "../../Events/Event";
import { int } from "../../float";
import { ICloneable } from '../../ICloneable';

export class ProgressEvent extends _Event implements ICloneable<ProgressEvent> {
    /**
         * The amount that has been loaded (out of a total amount)
         * @property loaded
         * @type {Number}
         */
    public loaded: int = 0;

    /**
     * The total "size" of the load.
     * @property total
     * @type {Number}
     * @default 1
     */
    public total: int = 0;

    /**
     * The percentage (out of 1) that the load has been completed. This is calculated using `loaded/total`.
     * @property progress
     * @type {Number}
     * @default 0
     */
    public progress: int;

    /**
     * A  {{#crossLink "Event"}}{{/crossLink}} that is dispatched when progress changes.
     * @class ProgressEvent
     * @param {Number} loaded The amount that has been loaded. This can be any number relative to the total.
     * @param {Number} [total=1] The total amount that will load. This will default to 1, so if the `loaded` value is
     * a percentage (between 0 and 1), it can be omitted.
     * @todo Consider having this event be a "fileprogress" event as well
     * @constructor
     */
    public constructor(loaded: int, total: int = 1) {
        super("progress");
        this.loaded = loaded;
        this.total = (total == null) ? 1 : total;
        this.progress = (total == 0) ? 0 : this.loaded / this.total;
    }
    /**
     * Returns a clone of the ProgressEvent instance.
     * @method clone
     * @return {ProgressEvent} a clone of the Event instance.
     **/
    public Clone(): ProgressEvent {
        return new ProgressEvent(this.loaded, this.total);
    }
}