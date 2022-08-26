import { is } from "../../is";
import { Reflect } from "../../Reflection/Reflect";

const METAKEY_MESSAGE: string = 'MESSAGE';

export function Message(message: number): MethodDecorator {
    return (
        target: any,
        key?: string | symbol,
        descriptor?: TypedPropertyDescriptor<any>,
    ) => {
        //
        if (is.workerContext()) {
            let messageFns: Array<Function> = Reflect.getMetadata("messageCallbacks", target.constructor);
            if (!messageFns) {
                Reflect.defineMetadata("messageCallbacks", messageFns = [], target.constructor);
            }
            messageFns[message] = target.constructor.prototype[key!];
            Reflect.defineMetadata('messageCallbacks', messageFns, target.constructor);
        } else {
            if (target.constructor['__THREAD__'] == null) {
                target.constructor['__THREAD__'] = {};
            }
            target.constructor['__THREAD__'][key!] = function (...args: any[]) {
                return this.SendMessageAsync(message, ...args);
            }
        }

    }
}
