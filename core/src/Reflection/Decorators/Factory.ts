import { capitalize as _capitalize } from "../../Text/capitalize";

const GET = 'get',
    SET = 'set';

export const Factory = {
    addGetterSetter: function <T>(constructor: any, attr: string, def?: T,
        validator?: Function, after?: Function) {
        this.addGetter(constructor, attr, def);
        this.addSetter(constructor, attr, validator, after);
        this.addOverloadedGetterSetter(constructor, attr);
    },
    addGetter: function <T>(constructor: any, attr: string, def?: T): void {
        const method = GET + _capitalize(attr);
        constructor.prototype[method] = function (): T {
            const val = this.attrs[attr];
            return val === undefined ? def : val;
        }
    },
    addSetter: function <T>(constructor: any, attr: string, validator?: Function, after?: Function) {
        const method = SET + _capitalize(attr);

        constructor.prototype[method] = function (val: T) {

            if (validator) {
                val = validator.call(this, val);
            }

            this._setAttr(attr, val);

            if (after) {
                after.call(this);
            }

            return this;
        };
    },
    addComponentsGetterSetter: function <T extends { [key: string]: any }>(
        constructor: any,
        attr: string,
        components: string[],
        validator?: Function,
        after?: Function
    ) {
        const len = components.length,
            capitalize = _capitalize,
            getter = GET + capitalize(attr),
            setter = SET + capitalize(attr);


        // getter
        constructor.prototype[getter] = function (): T {
            const ret: any = {};

            for (let n = 0; n < len; n++) {
                const component = components[n];
                ret[component] = this.getAttr(attr + capitalize(component));
            }

            return ret;
        };

        // setter
        constructor.prototype[setter] = function (val: T) {
            const oldVal = this.attrs[attr];

            if (validator) {
                val = validator.call(this, val);
            }

            for (let key in val) {
                if (!val.hasOwnProperty(key)) {
                    continue;
                }
                this._setAttr(attr + capitalize(key), val[key]);
            }

            this._fireChangeEvent(attr, oldVal, val);

            if (after) {
                after.call(this);
            }

            return this;
        };

        this.addOverloadedGetterSetter(constructor, attr);
    },
    addOverloadedGetterSetter: function <T>(constructor: any, attr: string) {
        const capitalizedAttr = _capitalize(attr),
            setter = SET + capitalizedAttr,
            getter = GET + capitalizedAttr;

        constructor.prototype[attr] = function (val: T): T {
            // setting
            if (arguments.length) {
                this[setter](arguments[0]);
                return this;
            }
            // getting
            return this[getter]();
        };
    },
    afterSetFilter: function () {
        this._filterUpToDate = false;
    }

}