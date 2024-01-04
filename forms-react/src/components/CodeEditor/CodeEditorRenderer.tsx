import { css } from "@emotion/css";
import { is } from "@tuval/core";
import { InputTextarea } from 'primereact';
import React from "react";
import { CodeEditorClass } from "./CodeEditorClass";
/* import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript'; */
import { json } from '@codemirror/lang-json';


export interface IControlProperties {
    control: CodeEditorClass
}


function CodeEditorRenderer({ control }: IControlProperties) {
    const className = css`
    ${control.Appearance.ToString()}
    ${control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + control.HoverAppearance.ToString() + ' }'}
    ${control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + control.ActiveAppearance.ToString() + ' }'}
    ${control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + control.FocusAppearance.ToString() + ' }'}
    `;

    return (
       <div></div>
    /*     <CodeMirror
            value={control.vp_Value}
            height="100%"
            width="100%"
         
            options={{lineNumbers: false}}
            extensions={[ json()]}
            onChange={(e) => is.function(control.vp_OnChange) ? control.vp_OnChange(e) : void 0}
        /> */
    );

}

export default CodeEditorRenderer;