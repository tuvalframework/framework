import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UIView } from "./components/UIView/UIView";
import { query } from "./data/DataContext/DataContextRenderer";


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
    const params = useParams();
     useEffect(() => {
        controller.OnControllerLoaded();
        controller.BindRouterParams(params);
        return () => controller.OnControllerUnLoaded();
    }, []); 

    const view = controller.LoadView();

   
    if (view != null) {
        return (
            <Fragment>
                {controller.LoadView().render()}
            </Fragment>
        )
    }
    
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

    protected BindRouterParams(routerParams?: any) { }

    protected OnControllerLoaded() {}
    protected OnControllerUnLoaded() {}

    public LoadView(): UIView {
        return null;
    }

    public render(): React.ReactNode {


        return (
            <UIControllerProxy controller={this}>
            </UIControllerProxy>
        )
    }

    public InvalidateQueries() {
        query.invalidateQueries();
    }
    public InvalidateQuerie(queryName: string) {
        query.invalidateQueries({ queryKey: [queryName] });
    }
}