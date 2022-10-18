import { foreach, is } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
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
import { UIChipClass } from "./UIChipClass";
import { DomHandler } from "../../windows/Forms/Components/DomHandler";

DomHandler.addCssToDocument(require('../Components/chips/Chips.css'));

export class UIChipsRenderer extends ControlHtmlRenderer<UIChipClass> {
    overlay: any;

    public GenerateElement(obj: UIChipClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public override GetCustomJss<UIChipClass>(obj: UIChipClass): Object {
        return {
            '& .p-chips.p-inputwrapper' : {
                width:'100%',
                height:'100%'
            },
            '& .p-chips .p-chips-multiple-container': {
                padding: '0.375rem 0.75rem',
                display:'flex',
                alignItems: 'flex-start',
                width:'100%',
                height:'100%'
            },
            '& .p-chips .p-chips-multiple-container:not(.p-disabled):hover ': {
                borderColor: '#6366F1'
            },
            '& .p-chips .p-chips-multiple-container:not(.p-disabled).p-focus': {
                outline: '0 none',
                outlineOffset: 0,
                boxShadow: '0 0 0 0.2rem #C7D2FE',
                borderColor: '#6366F1'
            },
            '& .p-chips .p-chips-multiple-container .p-chips-token': {
                padding: '0.375rem 0.75rem',
                marginRight: '0.5rem',
                background: '#EEF2FF',
                color: '#4338CA',
                borderRadius: ' 6px'
            },

            '& .p-chips .p-chips-multiple-container .p-chips-token .p-chips-token-icon': {
                marginLeft: '0.5rem'
            },
            '& .p-chips .p-chips-multiple-container .p-chips-input-token': {
                padding: '0.375rem 0'
            },
            '& .p-chips .p-chips-multiple-container .p-chips-input-token input': {
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                fontSize: '1rem',
                color: '#495057',
                padding: 0,
                margin: 0,
            },
            '& .p-chips.p-invalid.p-component > .p-inputtext': {
                borderColor: '#e24c4c'
            }
        }
    }

    public GenerateBody(obj: UIChipClass): void {
        this.WriteComponent(
            <Chips value={obj.vp_Value} placeholder={obj.vp_PlaceHolder} onChange={(e) => is.function(obj.vp_OnChange) ? obj.vp_OnChange(e) : void 0}></Chips>
        );
    }


}