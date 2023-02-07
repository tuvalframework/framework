import React, { Fragment } from "react";
import { UIViewClass } from "./components/UIView/UIViewClass";


export function State(defaultValue?: any): any/* PropertyDecorator */ {
    return (target: Object, key: string) => {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                this.SetProperty(key, newValue)
            },
            get: function (): any {
                if (this.state[key] == null) {
                    return defaultValue;
                }
                return this.state[key];
            },
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);

    };
}

function UIControllerProxy({ children, controller }) {
    return (
        <Fragment>
            {controller.LoadView().render()}
        </Fragment>
    )
}

export class UIController extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
    }
    protected SetProperty(name: string, value: any): void {

        const stateObject = {};
        stateObject[name] = value;
        this.setState(stateObject);


    }

    public LoadView(): UIViewClass {
        return null;
    }

    public render(): React.ReactNode {

        return (
            <UIControllerProxy controller={this}>
            </UIControllerProxy>
        )
    }
}