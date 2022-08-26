import { Control } from "../windows/Forms/Components/AAA/Control";
import { contextMap } from "./contextMap";
import { UIController } from "./UIController";
import { UIView } from "./UIView";

function isViewable(value: any): boolean {
    return (value instanceof UIView || value instanceof UIController || value instanceof Control);
}

export function getView(controller: UIController, view: any): UIView | UIController | Control {
    if (view == null) {
        return null;
    } else if (isViewable(view)) {
        if (view instanceof UIController) {
            view.ParentController = controller;
            return view;
        } else {
            return view;
        }
    } else {

        let currentController = controller;
        let clone = {};
        while (currentController != null) {
            const context = contextMap.get(currentController.constructor.name);
            // clone = { ...clone, ...context };
            for (let func in context) {
                //console.log(context[func])
                clone[func] = context[func].bind(currentController);
            }
            currentController = currentController.ParentController;
        }

        try {
            const theme = controller?.Theme;
            const root = view({ ...clone, controller, theme });
            if (isViewable(root)) {
                return root;
            } else if (typeof root === 'function') {
                return getView(controller, root);
            } else {
                throw new Error('olmaz.')
            }
        } catch {
            debugger;
        }
    }
}

function wrapFunc(sourceClass: any, targetFunction: any) {
    for (let o = sourceClass.prototype; o && o != Object.prototype; o = Object.getPrototypeOf(o)) {
        for (let name of Object.getOwnPropertyNames(o)) {
            if (targetFunction[name] == null) {
                if (typeof o[name] === 'function') {
                    targetFunction[name] = o[name].bind(targetFunction);
                } else {
                    const propertyDescriptor = Object.getOwnPropertyDescriptor(o, name);
                    if (propertyDescriptor != null && typeof propertyDescriptor['get'] === 'function' && typeof propertyDescriptor['set'] === 'function') {
                        Object.defineProperty(targetFunction, name, propertyDescriptor);
                    }
                }
            }
        }
    }
}

export function viewFunc(sourceClass: any, viewCreator: Function) {
    const func: any = ({ controller }: { controller: UIController }) => {
        //alert(JSON.stringify(func.propertyBag));
        return viewCreator(controller, func.propertyBag);
    }
    func.propertyBag = {};

    wrapFunc(sourceClass, func);

    if (sourceClass.prototype['constructor'] != null) {
        sourceClass.prototype['constructor'].call(func);
    }

    return func as any;
}