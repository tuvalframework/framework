import { BindingClass } from './../../../../../UIKit/Binding';

function propertyGetter(defaultValue: any, curKey: string): () => void {
    return function (): Object {
        const propertyValue = this.GetProperty(curKey);
        /* if (propertyValue === undefined && defaultValue !== undefined) {
            this.SetProperty(curKey, defaultValue);
            return defaultValue;
        } */

        return propertyValue;
    };
}


export function EventProperty(): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                /*   const oldValue: Function = this.properties[key];
                  if (oldValue !== newValue) { */
                /*  const finalContext: ParentOption = getParentContext(this, key);
                 if (isUndefined(oldValue) === false) {
                     finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                 }
                 finalContext.context.addEventListener(finalContext.prefix, newValue);
                 this.properties[key] = newValue; */
                this.SetProperty(key, newValue);
                //}
            },
            get: propertyGetter(undefined, key),
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);
    };
}
export function Property(defaultValue?: any): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                /*   const oldValue: Function = this.properties[key];
                  if (oldValue !== newValue) { */
                /*  const finalContext: ParentOption = getParentContext(this, key);
                 if (isUndefined(oldValue) === false) {
                     finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                 }
                 finalContext.context.addEventListener(finalContext.prefix, newValue);
                 this.properties[key] = newValue; */
                this.SetProperty(key, newValue);
                //}
            },
            get: propertyGetter(defaultValue, key),
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(target, key, eventDescriptor);

        if (target.constructor['__default_values__'] === undefined) {
            target.constructor['__default_values__'] = {};
        }
        if (defaultValue != undefined)
            target.constructor['__default_values__'][key] = defaultValue;
    };
}

export function State(defaultValue?: Function): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                /*   const oldValue: Function = this.properties[key];
                  if (oldValue !== newValue) { */
                /*  const finalContext: ParentOption = getParentContext(this, key);
                 if (isUndefined(oldValue) === false) {
                     finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                 }
                 finalContext.context.addEventListener(finalContext.prefix, newValue);
                 this.properties[key] = newValue; */
                this.SetProperty(key, newValue);
                //}
            },
            get: propertyGetter(defaultValue, key),
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(target, key, eventDescriptor);

        if (target.constructor['__' + target.constructor.name + '__default_values__'] === undefined) {
            target.constructor['__' + target.constructor.name + '__default_values__'] = {};
        }
        if (defaultValue != undefined)
            target.constructor['__' + target.constructor.name + '__default_values__'][key] = defaultValue;
    };
}


export function Binding<T>(defaultValue?: T): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                let p: BindingClass<any> = this.GetProperty(key);
                if (p == null) {
                    p = new BindingClass<any>(this, defaultValue);
                    p.set(newValue);
                    this.SetProperty(key, p);
                } else {
                    p.set(newValue);
                }

                //}
            },
            get: function (): any {
                const p: BindingClass<any> = this.GetProperty(key);
                if (p != null) {
                    if (defaultValue != null && p.get() == null) {
                        (p as any).value = defaultValue;
                    }
                    return p.get();
                }
                return null;
            },
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);
    };
}

export function Ref(defaultValue?: Function): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                /*   const oldValue: Function = this.properties[key];
                  if (oldValue !== newValue) { */
                /*  const finalContext: ParentOption = getParentContext(this, key);
                 if (isUndefined(oldValue) === false) {
                     finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                 }
                 finalContext.context.addEventListener(finalContext.prefix, newValue);
                 this.properties[key] = newValue; */

                this.BeginUpdate();
                this.SetProperty(key, newValue);
                this.EndUpdate();
                //}
            },
            get: propertyGetter(defaultValue, key),
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(target, key, eventDescriptor);

    };
}



export function _State(target: Object, key: string) {
    const eventDescriptor: Object = {
        set: function (newValue: Function): void {
            this.SetProperty(key, newValue);
        },
        get: propertyGetter(null, key),
        enumerable: true,
        configurable: true
    };

    Object.defineProperty(target, key, eventDescriptor);
}
