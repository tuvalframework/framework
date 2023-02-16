import { is } from "@tuval/core";
import React, { useState } from "react";
import { UIView } from "../UIView/UIView";
import { RenderingTypes, TextAlignment, TextClass } from "./TextClass";
import * as MarkdownIt from "markdown-it";

export interface IControlProperties {
    control: TextClass
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});



function TextRenderer({ control }: IControlProperties) {

    const style = {};
    /*   if (obj.RenderingType === RenderingTypes.Normal) {
          if (obj.MultilineTextAlignment === TextAlignment.center) {
              this.WriteStyleAttrVal('text-align', 'center');
              this.WriteStyleAttrVal('vertical-align', 'middle');
          } else if (obj.MultilineTextAlignment === TextAlignment.leading) {
              this.WriteStyleAttrVal('text-align', 'start');
              this.WriteStyleAttrVal('vertical-align', 'middle');
          } else if (obj.MultilineTextAlignment === TextAlignment.trailing) {
              this.WriteStyleAttrVal('text-align', 'end');
              this.WriteStyleAttrVal('vertical-align', 'middle');
          }
          this.WriteStyleAttrVal('overflow', 'hidden');
          this.WriteStyleAttrVal('text-overflow', obj.TextOverflow);
          this.WriteStyleAttrVal('width', 'auto');
          this.WriteStyleAttrVal('white-space', obj.WhiteSpace);
          this.WriteTextBody(obj.Text);
      } */

    if (control.RenderingType === RenderingTypes.Normal) {
        if (control.MultilineTextAlignment === TextAlignment.center) {
            style['text-align'] = 'center';
            style['vertical-align'] = 'middle';
        } else if (control.MultilineTextAlignment === TextAlignment.leading) {
            style['text-align'] = 'start';
            style['vertical-align'] = 'middle';
        } else if (control.MultilineTextAlignment === TextAlignment.trailing) {
            style['text-align'] = 'end';
            style['vertical-align'] = 'middle';
        }

        style['overflow'] = 'hidden';
        style['text-overflow'] = control.TextOverflow;
        style['width'] = 'auto';
        style['white-space'] = control.WhiteSpace;
        return (
            <span style={style}>{control.vp_Text}</span>
        )

    } else {

        return (
            <div className='markdown-body' dangerouslySetInnerHTML={{ __html: !is.nullOrEmpty(control.vp_Text) ? md.render(control.vp_Text) : '' }}></div>
        )
    }

}

export default TextRenderer;