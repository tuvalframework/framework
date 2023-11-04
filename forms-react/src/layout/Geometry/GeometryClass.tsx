import React from "react";
import { UIView } from "../../components/UIView/UIView";
import { ViewProperty } from "../../components/UIView/ViewProperty";
import GeometryRenderer from "./GeometryRenderer";



export class GeometryClass extends UIView {

   /** @internal */
   @ViewProperty() vp_Chidren: (params)=> UIView;

   public children(value: (params)=> UIView): this {
       this.vp_Chidren = value;
       return this;
   }

   public constructor() {
       super();
      
   }

   public render() {
       return (<GeometryRenderer control={this}></GeometryRenderer>)
   }
}