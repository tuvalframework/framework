export function exportToGlobal(moduleName: string, objectName: string, value: any): void {
    if (window[moduleName] == null) {
        window[moduleName] = {};
    }

    window[moduleName][objectName] = value;
}

export function Export(moduleName: string, objectName?: string): ClassDecorator {
    return (target: Function) => {
       /*  if (objectName == null) {
            exportToGlobal(moduleName, target.prototype.constructor.name, target);
        } else {
            exportToGlobal(moduleName, objectName, target);
        } */
    };
}