import { Injector } from './Injector';
//import { CoreModule } from './CoreModule';



/**
 * Bootstrap an injector from a list of modules, instantiating a number of default components
 *
 * @ignore
 * @param {Array<Module>} bootstrapModules
 *
 * @return {Injector} a injector to use to access the components
 */
function bootstrap(bootstrapModules, _injector?: Injector) {

    var modules: any[] = [],
        components: any[] = [];

    function hasModule(m) {
        return modules.indexOf(m) >= 0;
    }

    function addModule(m) {
        modules.push(m);
    }

    function visit(m) {
        if (hasModule(m)) {
            return;
        }

        (m.__depends__ || []).forEach(visit);

        if (hasModule(m)) {
            return;
        }

        addModule(m);

        (m.__init__ || []).forEach(function (c) {
            components.push(c);
        });
    }

    bootstrapModules.forEach(visit);

    let injector: Injector;
    if (_injector != null) {
        injector = _injector;
        injector.registerModules(modules);
    } else {
        injector = new Injector(modules);
    }

    components.forEach(function (c) {

        try {

            // eagerly resolve component (fn or string)
            (injector as any)[typeof c === "string" ? "get" : "invoke"](c);
        } catch (e:any) {
            console.error('Failed to instantiate component');
            console.error(e.stack);
            throw e;
        }
    });

    return injector;
}

/**
 * Creates an injector from passed options.
 *
 * @ignore
 * @param  {Object} options
 * @return {Injector}
 */
function createInjector(options) {

    options = options || {};

    var configModule = {
        'config': ['value', options]
    };

    var modules = [configModule].concat(options.modules || []);

    return bootstrap(modules);
}


/**
 * The main diagram-js entry point that bootstraps the diagram with the given
 * configuration.
 *
 * To register extensions with the diagram, pass them as Array<Module> to the constructor.
 *
 * @class djs.Diagram
 * @memberOf djs
 * @constructor
 *
 * @example
 *
 * <caption>Creating a plug-in that logs whenever a shape is added to the canvas.</caption>
 *
 * // plug-in implemenentation
 * function MyLoggingPlugin(eventBus) {
 *   eventBus.on('shape.added', function(event) {
 *     console.log('shape ', event.shape, ' was added to the diagram');
 *   });
 * }
 *
 * // export as module
 * export default {
 *   __init__: [ 'myLoggingPlugin' ],
 *     myLoggingPlugin: [ 'type', MyLoggingPlugin ]
 * };
 *
 *
 * // instantiate the diagram with the new plug-in
 *
 * import MyLoggingModule from 'path-to-my-logging-plugin';
 *
 * var diagram = new Diagram({
 *   modules: [
 *     MyLoggingModule
 *   ]
 * });
 *
 * diagram.invoke([ 'canvas', function(canvas) {
 *   // add shape to drawing canvas
 *   canvas.addShape({ x: 10, y: 10 });
 * });
 *
 * // 'shape ... was added to the diagram' logged to console
 *
 * @param {Object} options
 * @param {Array<Module>} [options.modules] external modules to instantiate with the diagram
 * @param {Injector} [injector] an (optional) injector to bootstrap the diagram with
 */


export class Context {
    private injector: Injector = undefined as any;
    public static Current: Context = new Context();
    public constructor(options = {}, injector?) {
        this.injector = injector || createInjector(options);
    }
    public addType(name, type) {
        this.injector.registerType(name, type);
    }
    public addModules(modules) {
        bootstrap(modules, this.injector);
    }
    /**
 * Resolves a diagram service
 *
 * @method Diagram#get
 *
 * @param {String} name the name of the diagram service to be retrieved
 * @param {Boolean} [strict=true] if false, resolve missing services to null
 */
    public 'get': Function = (name: string) => {
        try {
            return this.injector.get(name);
        }
        catch (e: any) {
            console.log(e.toString());
            return undefined;
        }
    }

    /**
    * Executes a function into which diagram services are injected
    *
    * @method Diagram#invoke
    *
    * @param {Function|Object[]} fn the function to resolve
    * @param {Object} locals a number of locals to use to resolve certain dependencies
    */
    public 'invoke': Function = (func, context, locals) => this.injector.invoke(func, context, locals);
}

/* Diagram.prototype.destroy = function() {
  this.get('eventBus').fire('diagram.destroy');
};

Diagram.prototype.clear = function() {
  this.get('eventBus').fire('diagram.clear');
}; */