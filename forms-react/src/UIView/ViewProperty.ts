export function ViewProperty(defaultValue?: any): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                if (this.propertyBag == null) {
                    this.propertyBag = {};
                }
                this.propertyBag[key] = newValue;
                this.ForceUpdate()

            },
            get: function (): any {
                if (this.propertyBag == null) {
                    this.propertyBag = {};
                }
                return this.propertyBag[key];
            },
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);
    };
}