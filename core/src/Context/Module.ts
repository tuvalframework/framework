export default function Module() {
    const providers: any = [];

    this.factory = function (name, factory) {
        providers.push([name, "factory", factory]);
        return this;
    }

    this.value = function (name, value) {
        providers.push([name, "value", value]);
        return this;
    }

    this.type = function (name, type) {
        providers.push([name, "type", type]);
        return this;
    }

    this.forEach = function (iterator) {
        providers.forEach(iterator);
    }

}