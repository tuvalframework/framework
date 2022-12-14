import { is } from "../is";
import { TObject } from "../Extensions/TObject";
import { TFunction } from "./TFunction";
import { Export, exportToGlobal } from '../exportToGlobal';

declare var tuval$core;
let umay: any; // Umayı geç yüklüyoruz. En altta.

const FN_REF = '__fn';

var DEFAULT_PRIORITY = 1000;

var slice = Array.prototype.slice;

/**
 * A general purpose event bus.
 *
 * This component is used to communicate across a diagram instance.
 * Other parts of a diagram can use it to listen to and broadcast events.
 *
 *
 * ## Registering for Events
 *
 * The event bus provides the {@link EventBus#on} and {@link EventBus#once}
 * methods to register for events. {@link EventBus#off} can be used to
 * remove event registrations. Listeners receive an instance of {@link Event}
 * as the first argument. It allows them to hook into the event execution.
 *
 * ```javascript
 *
 * // listen for event
 * eventBus.on('foo', function(event) {
 *
 *   // access event type
 *   event.type; // 'foo'
 *
 *   // stop propagation to other listeners
 *   event.stopPropagation();
 *
 *   // prevent event default
 *   event.preventDefault();
 * });
 *
 * // listen for event with custom payload
 * eventBus.on('bar', function(event, payload) {
 *   console.log(payload);
 * });
 *
 * // listen for event returning value
 * eventBus.on('foobar', function(event) {
 *
 *   // stop event propagation + prevent default
 *   return false;
 *
 *   // stop event propagation + return custom result
 *   return {
 *     complex: 'listening result'
 *   };
 * });
 *
 *
 * // listen with custom priority (default=1000, higher is better)
 * eventBus.on('priorityfoo', 1500, function(event) {
 *   console.log('invoked first!');
 * });
 *
 *
 * // listen for event and pass the context (`this`)
 * eventBus.on('foobar', function(event) {
 *   this.foo();
 * }, this);
 * ```
 *
 *
 * ## Emitting Events
 *
 * Events can be emitted via the event bus using {@link EventBus#fire}.
 *
 * ```javascript
 *
 * // false indicates that the default action
 * // was prevented by listeners
 * if (eventBus.fire('foo') === false) {
 *   console.log('default has been prevented!');
 * };
 *
 *
 * // custom args + return value listener
 * eventBus.on('sum', function(event, a, b) {
 *   return a + b;
 * });
 *
 * // you can pass custom arguments + retrieve result values.
 * var sum = eventBus.fire('sum', 1, 2);
 * console.log(sum); // 3
 * ```
 */
@Export('tuval$core')
export class EventBus {
    public static Default: EventBus = new EventBus();
    private _listeners: any = {};

    public constructor() {
        // cleanup on destroy on lowest priority to allow
        // message passing until the bitter end
        // this.on('diagram.destroy', 1, this._destroy, this);
    }

    /**
     * Register an event listener for events with the given name.
     *
     * The callback will be invoked with `event, ...additionalArguments`
     * that have been passed to {@link EventBus#fire}.
     *
     * Returning false from a listener will prevent the events default action
     * (if any is specified). To stop an event from being processed further in
     * other listeners execute {@link Event#stopPropagation}.
     *
     * Returning anything but `undefined` from a listener will stop the listener propagation.
     *
     * @param {String|Array<String>} events
     * @param {Number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    public on(events: string | Array<string>, priority: number | Function, callback?: Function, that?: any) {

        events = is.array(events) ? events : [events];

        if (is.function(priority)) {
            that = callback;
            callback = priority;
            priority = DEFAULT_PRIORITY;
        }

        if (!is.number(priority)) {
            throw new Error('priority must be a number');
        }

        let actualCallback: Function = callback as any;

        if (that) {
            actualCallback = TFunction.Bind(callback as any, that);

            // make sure we remember and are able to remove
            // bound callbacks via {@link #off} using the original
            // callback
            actualCallback[FN_REF] = (callback as any)[FN_REF] || callback;
        }

        const self = this;

        events.forEach(function (e) {
            self._addListener(e, {
                priority: priority,
                callback: actualCallback,
                next: null
            });
        });
    }

    /**
     * Register an event listener that is executed only once.
     *
     * @param {String} event the event name to register for
     * @param {Number} [priority=1000] the priority in which this listener is called, larger is higher
     * @param {Function} callback the callback to execute
     * @param {Object} [that] Pass context (`this`) to the callback
     */
    public once(event: string, priority: number, callback: Function, that: object) {
        var self = this;

        if (is.function(priority)) {
            that = callback;
            callback = priority;
            priority = DEFAULT_PRIORITY;
        }

        if (!is.number(priority)) {
            throw new Error('priority must be a number');
        }

        function wrappedCallback() {
            var result = callback.apply(that, arguments);
            self.off(event, wrappedCallback);
            return result;
        }

        // make sure we remember and are able to remove
        // bound callbacks via {@link #off} using the original
        // callback
        wrappedCallback[FN_REF] = callback;
        this.on(event, priority, wrappedCallback);
    }


    /**
     * Removes event listeners by event and callback.
     *
     * If no callback is given, all listeners for a given event name are being removed.
     *
     * @param {String|Array<String>} events
     * @param {Function} [callback]
     */
    public off(events: string | Array<string>, callback: Function): void {
        events = is.array(events) ? events : [events];
        const self = this;
        events.forEach(function (event) {
            self._removeListener(event, callback);
        });
    }

    /**
     * Create an EventBus event.
     *
     * @param {Object} data
     *
     * @return {Object} event, recognized by the eventBus
     */
    public createEvent(data: Object): Object {
        const event = new InternalEvent();
        event.init(data);
        return event;
    }



    /**
     * Fires a named event.
     *
     * @example
     *
     * // fire event by name
     * events.fire('foo');
     *
     * // fire event object with nested type
     * var event = { type: 'foo' };
     * events.fire(event);
     *
     * // fire event with explicit type
     * var event = { x: 10, y: 20 };
     * events.fire('element.moved', event);
     *
     * // pass additional arguments to the event
     * events.on('foo', function(event, bar) {
     *   alert(bar);
     * });
     *
     * events.fire({ type: 'foo' }, 'I am bar!');
     *
     * @param {String} [name] the optional event name
     * @param {Object} [event] the event object
     * @param {...Object} additional arguments to be passed to the callback functions
     *
     * @return {Boolean} the events return value, if specified or false if the
     *                   default action was prevented by listeners
     */
    public fire(type: string | Object, data: any): boolean {
        var event,
            firstListener,
            returnValue,
            args;

        args = slice.call(arguments);

        if (typeof type === 'object') {
            data = type;
            type = data.type;
        }

        if (!type) {
            throw new Error('no event type specified');
        }

        firstListener = this._listeners[type as any];

        if (!firstListener) {
            return false;
        }

        // we make sure we fire instances of our home made
        // events here. We wrap them only once, though
        if (data instanceof InternalEvent) {

            // we are fine, we alread have an event
            event = data;
        } else {
            event = this.createEvent(data);
        }

        // ensure we pass the event as the first parameter
        args[0] = event;

        // original event type (in case we delegate)
        var originalType = event.type;

        // update event type before delegation
        if (type !== originalType) {
            event.type = type;
        }

        try {
            returnValue = this._invokeListeners(event, args, firstListener);
        } finally {

            // reset event type after delegation
            if (type !== originalType) {
                event.type = originalType;
            }
        }

        // set the return value to false if the event default
        // got prevented and no other return value exists
        if (returnValue === undefined && event.defaultPrevented) {
            returnValue = false;
        }
        return returnValue;
    }

    public fireAsync(type: string | Object, data: any): void {
        var event,
            firstListener,
            returnValue,
            args;

        args = slice.call(arguments);

        if (typeof type === 'object') {
            data = type;
            type = data.type;
        }

        if (!type) {
            throw new Error('no event type specified');
        }

        firstListener = this._listeners[type as any];

        if (!firstListener) {
            return;
        }

        // we make sure we fire instances of our home made
        // events here. We wrap them only once, though
        if (data instanceof InternalEvent) {

            // we are fine, we alread have an event
            event = data;
        } else {
            event = this.createEvent(data);
        }

        // ensure we pass the event as the first parameter
        args[0] = event;

        // original event type (in case we delegate)
        var originalType = event.type;

        // update event type before delegation
        if (type !== originalType) {
            event.type = type;
        }

        try {
            returnValue = this._invokeListeners(event, args, firstListener);
        } finally {

            // reset event type after delegation
            if (type !== originalType) {
                event.type = originalType;
            }
        }

        // set the return value to false if the event default
        // got prevented and no other return value exists
        if (returnValue === undefined && event.defaultPrevented) {
            returnValue = false;
        }
        return returnValue;
    }

    public handleError(error: any) {
        return this.fire('error', { error: error }) === false;
    }

    private _destroy() {
        this._listeners = {};
    };

    private _invokeListeners(event, args, listener) {
        var returnValue;
        while (listener) {
            // handle stopped propagation
            if (event.cancelBubble) {
                break;
            }
            returnValue = this._invokeListener(event, args, listener);
            listener = listener.next;
        }
        return returnValue;
    }
    private _invokeListenersAsync(event, args, listener): void {
        var returnValue;
        umay.Task(() => {
            const __invokeListener = () => {
                // handle stopped propagation
                if (event.cancelBubble) {
                    return;
                }
                this._invokeListener(event, args, listener);
                listener = listener.next;

                if (listener != null) {
                    umay.Task(__invokeListener.bind(this));
                }
            };
            __invokeListener();
        });
    }

    private _invokeListener(event, args, listener) {
        var returnValue;
        try {
            // returning false prevents the default action
            returnValue = invokeFunction(listener.callback, args);
            // stop propagation on return value
            if (returnValue !== undefined) {
                event.returnValue = returnValue;
                event.stopPropagation();
            }
            // prevent default on return false
            if (returnValue === false) {
                event.preventDefault();
            }
        } catch (e) {
            if (!this.handleError(e)) {
                console.error('unhandled error in event listener');
                console.error((e as any).stack);
                throw e;
            }
        }
        return returnValue;
    }
    /*
     * Add new listener with a certain priority to the list
     * of listeners (for the given event).
     *
     * The semantics of listener registration / listener execution are
     * first register, first serve: New listeners will always be inserted
     * after existing listeners with the same priority.
     *
     * Example: Inserting two listeners with priority 1000 and 1300
     *
     *    * before: [ 1500, 1500, 1000, 1000 ]
     *    * after: [ 1500, 1500, (new=1300), 1000, 1000, (new=1000) ]
     *
     * @param {String} event
     * @param {Object} listener { priority, callback }
     */
    private _addListener(event, newListener) {

        var listener = this._getListeners(event),
            previousListener;

        // no prior listeners
        if (!listener) {
            this._setListeners(event, newListener);

            return;
        }

        // ensure we order listeners by priority from
        // 0 (high) to n > 0 (low)
        while (listener) {

            if (listener.priority < newListener.priority) {

                newListener.next = listener;

                if (previousListener) {
                    previousListener.next = newListener;
                } else {
                    this._setListeners(event, newListener);
                }

                return;
            }

            previousListener = listener;
            listener = listener.next;
        }

        // add new listener to back
        previousListener.next = newListener;
    }


    private _getListeners(name) {
        return this._listeners[name];
    };

    private _setListeners(name, listener) {
        this._listeners[name] = listener;
    };

    private _removeListener(event, callback) {

        var listener = this._getListeners(event),
            nextListener,
            previousListener,
            listenerCallback;

        if (!callback) {

            // clear listeners
            this._setListeners(event, null);

            return;
        }

        while (listener) {

            nextListener = listener.next;

            listenerCallback = listener.callback;

            if (listenerCallback === callback || listenerCallback[FN_REF] === callback) {
                if (previousListener) {
                    previousListener.next = nextListener;
                } else {

                    // new first listener
                    this._setListeners(event, nextListener);
                }
            }

            previousListener = listener;
            listener = nextListener;
        }
    }
}





/**
 * A event that is emitted via the event bus.
 */
class InternalEvent {
    private cancelBubble: boolean = false;
    private defaultPrevented: boolean = false;
    public stopPropagation() {
        this.cancelBubble = true;
    }

    public preventDefault() {
        this.defaultPrevented = true;
    }

    public init(data) {
        TObject.Assign(this, data || {});
    }

}
/**
   * Invoke function. Be fast...
   *
   * @param {Function} fn
   * @param {Array<Object>} args
   *
   * @return {Any}
   */
function invokeFunction(fn, args) {
    return fn.apply(null, args);
}

//exportToGlobal('tuval$core','EventBus', EventBus);

EventBus.Default.on('module.loaded.core', (e) => {
    //umay = new tuval$core.Umay();
    //umay.Run();
});