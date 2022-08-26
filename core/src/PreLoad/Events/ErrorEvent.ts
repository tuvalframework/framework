import { _Event } from '../../Events/Event';
export class ErrorEvent extends _Event {

    /**
         * The short error title, which indicates the type of error that occurred.
         * @property title
         * @type String
         */
    public title: string = null as any;

    /**
     * The verbose error message, containing details about the error.
     * @property message
     * @type String
     */
    public message: string = null as any;

    /**
     * Additional data attached to an error.
     * @property data
     * @type {Object}
     */
    public data: any = null as any;

    /**
     * A general error {{#crossLink "Event"}}{{/crossLink}}, that describes an error that occurred, as well as any details.
     * @class ErrorEvent
     * @param {String} [title] The error title
     * @param {String} [message] The error description
     * @param {Object} [data] Additional error data
     * @constructor
     */
    public constructor(title: string, message?: string, data?: any) {
        super("error");

        /**
         * The short error title, which indicates the type of error that occurred.
         * @property title
         * @type String
         */
        this.title = title;

        /**
         * The verbose error message, containing details about the error.
         * @property message
         * @type String
         */
        this.message = message as any;

        /**
         * Additional data attached to an error.
         * @property data
         * @type {Object}
         */
        this.data = data;
    }

    public Clone(): ErrorEvent {
        return new ErrorEvent(this.title, this.message, this.data);
    }
}