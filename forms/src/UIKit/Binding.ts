import { UIController } from "./UIController";

export class BindingClass<T> {
    private value: T;
    private controller: UIController;
    public constructor(controller: UIController, defaultValue: T) {
        this.controller = controller;
        this.value = defaultValue;
    }
    public get(): T {
        return this.value;
    }
    public set(value: T) {
        if (this.value !== value) {
            this.value = value;
            this.controller.ForceUpdate();
        }
    }
}