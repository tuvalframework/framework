import { foreach, Guid, is } from "@tuval/core";
import { useEffect, useRef, useState } from "../../hooks";
import { Fragment } from "../../preact/compat";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Avatar } from "../Components/avatar/Avatar";
import { Chips } from "../Components/chips/Chips";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { SlideMenu } from "../Components/slidemenu/SlideMenu";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { DomHandler } from "../../windows/Forms/Components/DomHandler";
import { Sidebar } from "../Components/sidebar/Sidebar";
import { RadioGroupClass } from "./UIRadioGroupClass";
import { RadioButton } from "../Components/radiobutton/RadioButton";


DomHandler.addCssToDocument(require('../Components/radiobutton/Radiobutton.css'));
DomHandler.addCssToDocument(require('../Components/radiobutton/Theme.css'));

export class RadioGroupRenderer extends ControlHtmlRenderer<RadioGroupClass> {
    overlay: any;

    public GenerateElement(obj: RadioGroupClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public override GetCustomJss<UISidebarClass>(obj: UISidebarClass): Object {
        return {

        }
    }

    public GenerateBody(obj: RadioGroupClass): void {
        const groupGuid = Guid.NewGuid().ToString();
        const [selectedValue, setSelectedValue] = useState('')
        this.WriteComponent(
            <Fragment>
                {obj.vp_RadioButtons.map(radioButtonInfo => {
                    const guid = Guid.NewGuid().ToString();

                    return (
                        <div className="field-radiobutton">
                            <RadioButton inputId={guid} name={groupGuid} value={radioButtonInfo.value} onChange={(e) => {
                                setSelectedValue(e.value);
                                if (is.function(obj.vp_OnChange)){
                                    obj.vp_OnChange(e.value);
                                }
                            }} checked={selectedValue === radioButtonInfo.value} />
                            <label htmlFor={guid}>{radioButtonInfo.label}</label>
                        </div>
                    )
                })}
            </Fragment>


        );
    }




}