import { createContext } from "react";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";

import React from "react";
import ConfigContextRenderer from "./ConfigContextRenderer";

export const ConfigContextProvider = createContext<any>({});

export const useConfig = (): any => {
    const options = React.useContext(ConfigContextProvider);
    return options;

}

export class ConfigContextClass extends UIView {

    @ViewProperty() vp_Config: any;
    public config(value: any): this {
        this.vp_Config = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ChildFunc: ()=>UIView;

    public childFunc(value: ()=>UIView) {
        this.vp_ChildFunc = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={ConfigContextRenderer}></UIViewRenderer>)
    }
}