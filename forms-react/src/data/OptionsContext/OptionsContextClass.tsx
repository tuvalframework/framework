import { createContext } from "react";
import { UIView } from "../../components/UIView/UIView";
import { UIViewRenderer } from "../../components/UIView/UIViewRenderer";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import OptionsContextRenderer from "./OptionsContextRenderer";
import React from "react";

export const OptionsContextProvider = createContext<any>({});

export const useOptions = (): any => {
    const options = React.useContext(OptionsContextProvider);
    return options;

}

export class OptionsContextClass extends UIView {

    @ViewProperty() vp_Options: any;
    public options(value: any): this {
        this.vp_Options = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_ChildFunc: ()=>UIView;

    public childFunc(value: ()=>UIView) {
        this.vp_ChildFunc = value;
        return this;
    }

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={OptionsContextRenderer}></UIViewRenderer>)
    }
}