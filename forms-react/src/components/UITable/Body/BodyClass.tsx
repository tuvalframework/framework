import React from "react";
import { UIView } from "../../UIView/UIView";
import UIViewRenderer from "../../UIView/UIViewRenderer";
import { ViewProperty } from "../../UIView/ViewProperty";
import BodyRenderer from "./BodyRenderer";


export interface BodyParams {

}

export class BodyClass extends UIView {
  
     /** @internal */
     @ViewProperty() vp_Children: UIView[];
     public children(...value: UIView[]): this {
         this.vp_Children = value;
         return this;
     }
 

    public render() {
        return (<UIViewRenderer wrap={false} control={this} renderer={BodyRenderer}></UIViewRenderer>)
    }
}
