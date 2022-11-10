import { StringBuilder } from "@tuval/core";
import { Fragment } from "../../preact";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Steps } from "../Components/steps/Steps";
import { classNames } from "../Components/utils/ClassNames";
import { DynamicViewClass } from "./DynamicViewClass";


export class DynamicViewRenderer extends ControlHtmlRenderer<DynamicViewClass> {
    shadowDom: any;
    protected menu: any;
   

    public GenerateElement(obj: DynamicViewClass): boolean {
        this.WriteStartFragment();
        return true;
    }


    public GenerateBody(obj: DynamicViewClass): void {
        
        debugger;

        this.WriteComponent(obj.vp_Node);
    }
}