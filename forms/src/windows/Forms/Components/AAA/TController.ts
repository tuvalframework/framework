import { IView } from "./TView";

const SubMethods = Symbol('SubMethods');

export function IpcMessage(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target[SubMethods] = target[SubMethods] || new Map();
    // Here we just add some information that class decorator will use
    target[SubMethods].set(propertyKey.toUpperCase(), target[propertyKey]);

}
export function View<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            const subMethods = Base.prototype[SubMethods];

            Base.prototype['ProcessMessage'] = function (message: string, ...args: any[]) {
                message = message.toUpperCase();
                debugger;
                if (message === 'VM_SET_CONTROLLER') {
                    this.__controller__ = args[0];
                    return;
                }
                const func: Function = subMethods.get(message);
                if (func) {
                    func.call(this, ...args);
                }
            }
          /*   if (subMethods) {
                subMethods.forEach((requestName: string, method: string) => {
                    console.log(requestName);
                });
            } */
        }
    };
}


export function Controller<T extends { new(...args: any[]): {} }>(Base: T) {
    return class extends Base {
        constructor(...args: any[]) {
            super(...args);
            const subMethods = Base.prototype[SubMethods];

            Base.prototype['ProcessMessage'] = function (message, ...args: any[]) {
                message = message.toUpperCase();
                const func: Function = subMethods.get(message);
                if (func) {
                    func.call(this, ...args);
                }
            }
            if (subMethods) {
                subMethods.forEach((requestName: string, method: string) => {
                    console.log(requestName);
                });
            }
        }
    };
}

export abstract class TController {
    private _view: any;
    public constructor() {

    }

    protected SendMessageToView(message: string, ...args: any[]) {
        this._view.ProcessMessage(message, ...args);
    }
    public SetView(view: any) {
        this._view = view;
        this.SendMessageToView('VM_SET_CONTROLLER', this);
    }
}