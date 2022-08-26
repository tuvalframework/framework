import Module from './Module'

import { parseAnnotations, annotate } from './Annotation'

import { isArray, hasOwnProp } from './Utils'

export class Injector {
  private parent: any
  private currentlyResolving: any[] = undefined as any
  public providers: any = undefined as any
  public instances: any = undefined as any
  private _providers: any[] = undefined as any
  private _instances: any[] = undefined as any

  public constructor(modules, parent?) {
    this.parent = parent || {
      get: (name, strict) => {
        this.currentlyResolving.push(name)

        if (strict === false) {
          return null
        } else {
          throw this.error('No provider for "' + name + '"!')
        }
      }
    }
    this.currentlyResolving = []
    this.providers = this._providers = Object.create(this.parent._providers || null)
    this.instances = this._instances = Object.create(null)

    var self = (this.instances.injector = this)
    this.registerModules(modules)
  }
  public registerModules(modules) {
    const factoryMap = {
      factory: this.invoke.bind(this),
      type: this.instantiate.bind(this),
      value: value => {
        return value
      }
    }

    modules.forEach(module => {
      function arrayUnwrap(type, value) {
        if (type !== 'value' && isArray(value)) {
          value = annotate(value.slice())
        }
        return value
      }

      // TODO(vojta): handle wrong inputs (modules)
      if (module instanceof Module) {
        ;(module as any).forEach(provider => {
          var name = provider[0]
          var type = provider[1]
          var value = provider[2]

          this.providers[name] = [factoryMap[type], arrayUnwrap(type, value), type]
        })
      } else if (typeof module === 'object') {
        if (module.__exports__) {
          var clonedModule = Object.keys(module).reduce((m, key) => {
            if (key.substring(0, 2) !== '__') {
              m[key] = module[key]
            }
            return m
          }, Object.create(null))

          var privateInjector = new Injector(
            (module.__modules__ || []).concat([clonedModule]),
            self
          )
          var getFromPrivateInjector = annotate(key => {
            return privateInjector.get(key)
          })
          module.__exports__.forEach(key => {
            this.providers[key] = [getFromPrivateInjector, key, 'private', privateInjector]
          })
        } else {
          Object.keys(module).forEach(name => {
            if (module[name][2] === 'private') {
              this.providers[name] = module[name]
              return
            }

            var type = module[name][0]
            var value = module[name][1]

            this.providers[name] = [factoryMap[type], arrayUnwrap(type, value), type]
          })
        }
      }
    })
  }
  public registerType(name, value) {
    var factoryMap = {
      factory: this.invoke.bind(this),
      type: this.instantiate.bind(this),
      value: function(value) {
        return value
      }
    }
    function arrayUnwrap(type, value) {
      if (type !== 'value' && Array.isArray(value)) {
        value = annotate(value.slice())
      }

      return value
    }
    this._providers[name] = [factoryMap['type'], arrayUnwrap('type', value), 'type']
  }
  private error(msg) {
    const stack = this.currentlyResolving.join(' -> ')
    this.currentlyResolving.length = 0
    return new Error(stack ? msg + ' (Resolving: ' + stack + ')' : msg)
  }
  public get(name, strict?) {
    if (!this.providers[name] && name.indexOf('.') !== -1) {
      var parts = name.split('.')
      var pivot = this.get(parts.shift())

      while (parts.length) {
        pivot = pivot[parts.shift()]
      }

      return pivot
    }

    if (hasOwnProp(this.instances, name)) {
      return this.instances[name]
    }

    if (hasOwnProp(this.providers, name)) {
      if (this.currentlyResolving.indexOf(name) !== -1) {
        this.currentlyResolving.push(name)
        throw this.error('Cannot resolve circular dependency!')
      }

      this.currentlyResolving.push(name)
      this.instances[name] = this.providers[name][0](this.providers[name][1])
      this.currentlyResolving.pop()

      return this.instances[name]
    }

    return this.parent.get(name, strict)
  }
  public fnDef(fn, locals?) {
    if (typeof locals === 'undefined') {
      locals = {}
    }

    if (typeof fn !== 'function') {
      if (isArray(fn)) {
        fn = annotate(fn.slice())
      } else {
        throw new Error('Cannot invoke "' + fn + '". Expected a function!')
      }
    }

    const inject = fn.$inject || parseAnnotations(fn)
    const dependencies = inject.map(dep => {
      if (hasOwnProp(locals, dep)) {
        return locals[dep]
      } else {
        return this.get(dep)
      }
    })

    return {
      fn: fn,
      dependencies: dependencies
    }
  }
  public instantiate(Type) {
    var def = this.fnDef(Type)

    var fn = def.fn,
      dependencies = def.dependencies

    // instantiate var args constructor
    var Constructor = Function.prototype.bind.apply(fn, ([null] as any).concat(dependencies))

    return new Constructor()
  }

  public invoke(func, context, locals) {
    var def = this.fnDef(func, locals)

    var fn = def.fn,
      dependencies = def.dependencies

    return fn.apply(context, dependencies)
  }
  private createPrivateInjectorFactory(privateChildInjector) {
    return annotate(key => {
      return privateChildInjector.get(key)
    })
  }

  private createChild(modules, forceNewInstances) {
    if (forceNewInstances && forceNewInstances.length) {
      var fromParentModule = Object.create(null)
      var matchedScopes = Object.create(null)

      var privateInjectorsCache: any[] = []
      var privateChildInjectors: any[] = []
      var privateChildFactories: any[] = []

      var provider
      var cacheIdx
      let privateChildInjector
      var privateChildInjectorFactory
      for (var name in this.providers) {
        provider = this.providers[name]

        if (forceNewInstances.indexOf(name) !== -1) {
          if (provider[2] === 'private') {
            cacheIdx = privateInjectorsCache.indexOf(provider[3])
            if (cacheIdx === -1) {
              privateChildInjector = provider[3].createChild([], forceNewInstances)
              privateChildInjectorFactory = this.createPrivateInjectorFactory(privateChildInjector)
              privateInjectorsCache.push(provider[3])
              privateChildInjectors.push(privateChildInjector)
              privateChildFactories.push(privateChildInjectorFactory)
              fromParentModule[name] = [
                privateChildInjectorFactory,
                name,
                'private',
                privateChildInjector
              ]
            } else {
              fromParentModule[name] = [
                privateChildFactories[cacheIdx],
                name,
                'private',
                privateChildInjectors[cacheIdx]
              ]
            }
          } else {
            fromParentModule[name] = [provider[2], provider[1]]
          }
          matchedScopes[name] = true
        }

        if ((provider[2] === 'factory' || provider[2] === 'type') && provider[1].$scope) {
          /* jshint -W083 */
          forceNewInstances.forEach(scope => {
            if (provider[1].$scope.indexOf(scope) !== -1) {
              fromParentModule[name] = [provider[2], provider[1]]
              matchedScopes[scope] = true
            }
          })
        }
      }
      forceNewInstances.forEach(scope => {
        if (!matchedScopes[scope]) {
          throw new Error('No provider for "' + scope + '". Cannot use provider from the parent!')
        }
      })
      modules.unshift(fromParentModule)
    }
    return new Injector(modules, self)
  }
}
