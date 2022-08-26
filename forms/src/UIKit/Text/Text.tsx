
import { TLabel } from "../../windows/Forms/Components/AAA/TLabel/TLabel";
import { TLabelRenderer } from "../../windows/Forms/Components/AAA/TLabel/TLabelRenderer";
import { UIView, ViewProperty } from "../UIView";
import { ILabel } from '../../windows/Forms/Components/AAA/TLabel/ILabel';
import { int, is, StringBuilder } from "@tuval/core";
import * as MarkdownIt from "markdown-it";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIController } from "../UIController";
import { viewFunc } from "../getView";
import { Teact } from "../../windows/Forms/Components/Teact";
import { ShadowRoot } from "../../windows/Forms/Components/ShadowRoot/ShadowRoot";

import Highlighter from "./Highlighter";
import { Fragment } from "../../preact";
import { Skeleton } from "../Components/skeleton/Skeleton";
import { Tooltip } from "../Components/tooltip/Tooltip";
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

export enum RenderingTypes {
    Normal = 1,
    Markdown = 2
}

export enum TextAlignment {
    center = 0,
    leading = 1,
    trailing = 2
}

class TextRenderer extends ControlHtmlRenderer<UITextClass> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UITextClass, sb: StringBuilder): void {

        if (obj.vp_Skeleton) {
            sb.AppendLine(require('../Components/skeleton/Skeleton.css'));
            sb.AppendLine(require('../Components/skeleton/Thema.css'));
        } else {
            sb.AppendLine(`
          .Highlight {
            background-color: #ffd54f;
          }

          `);

            if (obj.RenderingType === RenderingTypes.Markdown) {

                sb.AppendLine(require('./markdown.css'));

                if (!is.nullOrEmpty(obj.Appearance.FontFamily)) {
                    sb.AppendLine(`
            * {
                font-family:${obj.Appearance.FontFamily} !important;
              }
            `);
                }

                if (!is.nullOrEmpty(obj.Appearance.FontSize)) {
                    sb.AppendLine(`
            * {
                font-size:${obj.Appearance.FontSize} !important;
              }
            `);
                }
                if (!is.nullOrEmpty(obj.Appearance.LineHeight)) {
                    sb.AppendLine(`
            * {
                line-height:${obj.Appearance.LineHeight} !important;
              }

            `);
                }
            }
        }
    }

    protected OnShadowDomDidMount(ref: HTMLElement, obj: UITextClass): void {
        //alert(md.render(obj.Text));
        if (obj.RenderingType === RenderingTypes.Markdown) {
            const parent = document.createElement('div');
            parent.className = 'markdown-body';
            if (!is.nullOrEmpty(obj.vp_Text)) {
                parent.innerHTML = md.render(obj.vp_Text);
            }
            ref.appendChild(parent);
        }

    }

    public GenerateElement(obj: UITextClass): boolean {
        this.WriteStartFragment();

        /*  if (obj.RenderingType === RenderingTypes.Markdown) {
             this.WriteStartFragment();
         } else if (obj.RenderingType === RenderingTypes.Normal) {
             this.WriteStartElement('span');
         } */
        return true;
    }
    public GenerateBody(obj: UITextClass): void {

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

        if (obj.RenderingType === RenderingTypes.Normal) {
            if (obj.MultilineTextAlignment === TextAlignment.center) {
                style['text-align'] = 'center';
                style['vertical-align'] = 'middle';
            } else if (obj.MultilineTextAlignment === TextAlignment.leading) {
                style['text-align'] = 'start';
                style['vertical-align'] = 'middle';
            } else if (obj.MultilineTextAlignment === TextAlignment.trailing) {
                style['text-align'] = 'end';
                style['vertical-align'] = 'middle';
            }

            style['overflow'] = 'hidden';
            style['text-overflow'] = obj.TextOverflow;
            style['width'] = 'auto';
            style['white-space'] = obj.WhiteSpace;
            if (obj.vp_Skeleton) {
                style['color'] = 'transparent';
            }

            if (obj.vp_Skeleton) {
                this.WriteComponent(
                    <Fragment>
                        <span style={style}>{obj.vp_Text}</span>
                        <Skeleton style={{ position: 'absolute' }} width="100%" height="100%" animation="wave" shape='rectangle' borderRadius="16px" />
                    </Fragment>
                    /*  <Highlighter
                         findChunks={undefined as any}
                         sanitize={undefined as any}
                         className={undefined as any}
                         unhighlightStyle={undefined as any}
                         highlightClassName="Highlight"
                         searchWords={obj.SearchWords}
                         autoEscape={true}
                         textToHighlight={obj.Text}
                         style={style}
                     /> */
                );
            } else {
                this.WriteComponent(
                    <span style={style}>{obj.vp_Text}</span>
                    /*  <Highlighter
                         findChunks={undefined as any}
                         sanitize={undefined as any}
                         className={undefined as any}
                         unhighlightStyle={undefined as any}
                         highlightClassName="Highlight"
                         searchWords={obj.SearchWords}
                         autoEscape={true}
                         textToHighlight={obj.Text}
                         style={style}
                     /> */
                );
            }

        }


    }
}
export class UITextClass extends UIView implements ILabel {

    /** @internal */
    @ViewProperty() MultilineTextAlignment: TextAlignment = TextAlignment.leading;

    /** @internal */
    @ViewProperty() RenderingType: RenderingTypes = RenderingTypes.Normal;

    /** @internal */
    @ViewProperty() HtmlFor: string;

    /** @internal */
    @ViewProperty() TextAlign: string;

    /** @internal */
    @ViewProperty() WhiteSpace: string;

    /** @internal */
    @ViewProperty() TextOverflow: string;

    /** @internal */
    @ViewProperty() SearchWords: string[];

    /** @internal */
    @ViewProperty() vp_Text: string;



    public setController(controller: UIController): this {
        super.setController(controller);

        this.Renderer = new TextRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        // Sola yaslanmıyor
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'inherit';
        this.Appearance.JustifyContent = 'inherit';

        this.MultilineTextAlignment = TextAlignment.center;
        this.RenderingType = RenderingTypes.Normal;


        this.SearchWords = [];
    }
    public text(buttonLabel: string) {
        this.vp_Text = buttonLabel;
        return this;
    }
    public textAlign(value: string) {
        this.TextAlign = value;
        return this;
    }
    public render(type: RenderingTypes): this {
        this.RenderingType = type;
        if (type === RenderingTypes.Markdown) {
            this.Appearance.Display = 'block'; // flex olmasını istemiyoruz markdown modda.
        }
        return this;
    }
    public multilineTextAlignment(value: TextAlignment): this {
        this.MultilineTextAlignment = value;
        return this;
    }
    public whiteSpace(value: string): this {
        this.WhiteSpace = value;
        return this;
    }
    public textOverflow(value: string): this {
        this.TextOverflow = value;
        return this;
    }
    public searchWords(value: string[]): this {
        this.SearchWords = value;
        return this;
    }


}

export function Text(text: string): UITextClass {
    //  return viewFunc(UITextClass, (controller, propertyBag) => {
    return new UITextClass().setController(null)/* .PropertyBag(propertyBag) */.text(text);
    //  });
}


export class UIFastTextClass extends UITextClass implements ILabel {
    public Render() {
        return (
            Teact.createElement('tuval-view-text', { style: this.Appearance.StylePropertyBag }, this.vp_Text)
        )
    }
}

export function FastText(text: string): UIFastTextClass {
    //return viewFunc(_UITextClass, (controller, propertyBag) => {
    return new UIFastTextClass().setController(null)/*.PropertyBag(propertyBag) */.text(text);
    //});
}