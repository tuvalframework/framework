import { DomHandler } from '../../DomHandler';
import { Control } from "../Control";
import { Message } from "../Message";
import { Msg } from "../Msg";
import { HtmlRenderer } from "./HtmlRenderer";
import { CGColor } from '@tuval/cg';
import { StringBuilder } from "@tuval/core";
import { IControl } from '../IControl';

export abstract class ControlHtmlRenderer<T extends IControl> extends HtmlRenderer<T> {

    private styleId: string;
    private prevStyleObject: any;
    public DecideCache(obj: T): void {
        throw new Error("Method not implemented.");
    }
    public GenerateElement(obj: T): boolean {
        this.WriteStartElement(`div`);
        return true;
    }

    private generatePaddingAttributes(obj: T) {
        if (obj.PaddingAll != null) {
            this.WriteStyleAttrVal('padding', obj.PaddingAll);
        }

        if (obj.PaddingLeft != null) {
            this.WriteStyleAttrVal('padding-left', obj.PaddingLeft);
        }
        if (obj.PaddingRight != null) {
            this.WriteStyleAttrVal('padding-right', obj.PaddingRight);
        }
        if (obj.PaddingTop != null) {
            this.WriteStyleAttrVal('padding-top', obj.PaddingTop);
        }
        if (obj.PaddingBottom != null) {
            this.WriteStyleAttrVal('padding-bottom', obj.PaddingBottom);
        }
    }

    /*    private generateBorderStyles(obj: T) {
           this.WriteStyleAttrVal('border-left-color', this.TranslateColor(obj.Appearance.BorderLeftColor));
           this.WriteStyleAttrVal('border-left-style', obj.Appearance.BorderLeftStyle);
           this.WriteStyleAttrVal('border-left-width', obj.Appearance.BorderLeftWidth);
           this.WriteStyleAttrVal('border-right-color', this.TranslateColor(obj.Appearance.BorderRightColor));
           this.WriteStyleAttrVal('border-right-style', obj.Appearance.BorderRightStyle);
           this.WriteStyleAttrVal('border-right-width', obj.Appearance.BorderRightWidth);

           this.WriteStyleAttrVal('border-top-color', this.TranslateColor(obj.Appearance.BorderTopColor));
           this.WriteStyleAttrVal('border-top-style', obj.Appearance.BorderTopStyle);
           this.WriteStyleAttrVal('border-top-width', obj.Appearance.BorderTopWidth);
           this.WriteStyleAttrVal('border-bottom-color', this.TranslateColor(obj.Appearance.BorderBottomColor));
           this.WriteStyleAttrVal('border-bottom-style', obj.Appearance.BorderBottomStyle);
           this.WriteStyleAttrVal('border-bottom-width', obj.Appearance.BorderBottomWidth);

       } */

    private generateMaxMinStyles(obj: T) {
        this.WriteStyleAttrVal('max-width', obj.Appearance.MaxWidth);
        this.WriteStyleAttrVal('max-height', obj.Appearance.MaxHeight);
        this.WriteStyleAttrVal('min-width', obj.Appearance.MinWidth);
        this.WriteStyleAttrVal('min-height', obj.Appearance.MinHeight);
    }
    protected OnComponentDidMount(ref:any,obj: T): void {
        if (!this.UseShadowDom) {
            const styleElement = document.getElementById(obj.Id + '_style');
            if (styleElement == null) {
                let addToDocument: boolean = false;
                const sb = new StringBuilder();

                const styleObject = obj.Appearance.GetStyleObject();
                if (Object.keys(styleObject).length > 0) {
                    addToDocument = true;
                    sb.AppendLine(`#id-${obj.Id} {`);
                    for (let key in styleObject) {
                        sb.AppendLine(`${key}:${styleObject[key]} !important;`);
                    }
                    sb.AppendLine(`}`);
                }


                const hoverStyleObject = obj.HoverAppearance.GetStyleObject();
                if (Object.keys(hoverStyleObject).length > 0) {
                    addToDocument = true;
                    sb.AppendLine(`#id-${obj.Id}:hover {`);
                    for (let key in hoverStyleObject) {
                        sb.AppendLine(`${key}:${hoverStyleObject[key]} !important;`);
                    }
                    sb.AppendLine(`}`);
                }

                if (addToDocument) {
                    this.styleId = DomHandler.addCssToDocument(sb.ToString(), obj.Id + '_style');
                }
            }
        }
    }
    protected OnComponentWillUnmount(obj: T): void {
        if (!this.UseShadowDom) {
            DomHandler.removeCssToDocument(obj.Id + '_style');
        }
    }
    public GenerateAttributes(obj: T): void {
        if (!this.UseShadowDom) {
            this.WriteAttrVal('id', 'id-' + obj.Id);
            this.WriteAttrVal('class', `tvl-control-${obj.constructor.name}`);
        }
        //this.WriteAttrVal('class', `${obj.Id}`);

        /*  for (let key in obj.CurrentStyleObject) {
             this.WriteStyleAttrVal(key, obj.CurrentStyleObject[key]);
         } */

        /*  this.generateBorderStyles(obj);
         this.generateMaxMinStyles(obj); */

        if (obj.BackColor != null && !obj.BackColor.IsEmpty) {
            this.WriteStyleAttrVal('background-color', this.TranslateColor(obj.BackColor));
        }

        if (obj.Left != null && obj.Top != null) {
            this.WriteStyleAttrVal('position', 'absolute');
            this.WriteStyleAttrVal('left', obj.Left);
            this.WriteStyleAttrVal('top', obj.Top);
            this.WriteStyleAttrVal('bottom', obj.Bottom);
            this.WriteStyleAttrVal('right', obj.Right);
        } else {
            this.WriteStyleAttrVal('position', 'relative');
        }

        if (obj._Width != null) {
            this.WriteStyleAttrVal('width', obj._Width);
        }
        if (obj._Height != null) {
            this.WriteStyleAttrVal('height', obj._Height);
        }



        this.generatePaddingAttributes(obj);

        this.WriteAttrVal('onmouseover', (e) => obj.WndProc(Message.Create(Msg.WM_MOUSEHOVER, e, e)));
        this.WriteAttrVal('onmousemove', (e) => {
            obj.WndProc(Message.Create(Msg.WM_MOUSEMOVE, e, e));
        });

        this.WriteAttrVal('onmouseenter', (e) => {



        });

        this.WriteAttrVal('onmouseleave', (e) => {


        });

    }
    public abstract GenerateBody(obj: T): void;

    public GenerateElementFinish(obj: T): void {
        this.WriteEndElement();
    }

}