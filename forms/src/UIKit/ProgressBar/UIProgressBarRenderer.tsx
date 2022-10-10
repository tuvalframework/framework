import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { StringBuilder, is } from '@tuval/core';
import { Teact } from "../../windows/Forms/Components/Teact";
import { Fragment } from "../../preact";
import { UIProgressBarClass } from "./UIProgressBarClass";
import { jss } from "../../jss/jss";
import { ProgressBar } from "../Components/progressbar/ProgressBar";
import { getView } from "../getView";
import { darken, lighten } from "../../tuval-system/colorManipulator";
import { DomHandler } from "../../windows/Forms/Components/DomHandler";


DomHandler.addCssToDocument(require('../Components/progressbar/ProgressBar.css'));


const cssAttributes = {
    fontSize: 'font-size',
    fontFamily: 'font-family',
    fontWeight: 'font-weight',
    lineHeight: 'line-height',
    color: 'color',
    margin: 'margin'
}

const getColorShade = (theme, color) => {
    if (color === 'inherit') {
        return 'currentColor';
    }
    if (theme.vars) {
        return theme.vars.palette.LinearProgress[`${color}Bg`];
    }
    return theme.palette.mode === 'light'
        ? lighten(theme.palette[color].main, 0.62)
        : darken(theme.palette[color].main, 0.5);
};

export class UIProgressBarRenderer extends ControlHtmlRenderer<UIProgressBarClass> {
    public GetCustomJss(obj: UIProgressBarClass): Object {
        const theme = obj.controller?.Theme;
        let styles = {
            border: '0 none',
            background: '#dee2e6',
            borderRadius: 6,
            width: '100%',
            height: '100%',
            ...(obj.vp_LabelOffset !== 0 && {
                overflow: 'unset'
            }),
            ...(theme && {
                backgroundColor: getColorShade(theme, 'primary'),
                boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 10%)'
            }),
            // progress bar
            '& .p-progressbar-value': {
                border: '0 none',
                borderRadius: '6px 0px 0px 6px',
                margin: 0,
                transition: 'transform 0.2s linear',
                ...(theme && {
                    backgroundColor: (theme.vars || theme).palette['primary'].main,
                }),
                ...(theme == null && {
                    background: '#6366F1'
                }),

            },
            '& .p-progressbar-label': {
                color: '#ffffff',
                lineHeight: '1.5rem',
                ...(obj.vp_LabelOffset !== 0 && {
                    position: 'absolute',
                    top: obj.vp_LabelOffset,
                    left: obj.vp_value + '%',
                    width: 'auto',
                    transform: 'translate(-50%)',
                    transition: 'all .5s ease-in-out'
                })
            }
        }

        let astyles = {
            '& .p-progressbar-value': {
                border: '0 none',
                borderRadius: '6px 0px 0px 6px',
                margin: 0,
                transition: 'transform 0.2s linear',
                ...(theme && {
                    backgroundColor: (theme.vars || theme).palette['primary'].main,
                }),
                ...(theme == null && {
                    background: '#6366F1'
                }),

            },
            '& .p-progressbar-label': {
                color: '#ffffff',
                lineHeight: '1.5rem',
                ...(obj.vp_LabelOffset !== 0 && {
                    position: 'absolute',
                    top: obj.vp_LabelOffset,
                    left: obj.vp_value + '%',
                    width: 'auto',
                    transform: 'translate(-50%)',
                    transition: 'all .5s ease-in-out'
                })
            }
        }
        return styles;
    }

    public OnStyleCreating(obj: UIProgressBarClass, sb: StringBuilder): void {

        const theme = obj.controller?.Theme;

        let styles = {
            'p-progressbar': {
                border: '0 none',
                background: '#dee2e6',
                borderRadius: 6,
                width: '100%',
                height: '100%',
                ...(obj.vp_LabelOffset !== 0 && {
                    overflow: 'unset'
                }),
                ...(theme && {
                    backgroundColor: getColorShade(theme, 'primary'),
                    boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 10%)'
                }),
                // progress bar
                '& .p-progressbar-value': {
                    border: '0 none',
                    borderRadius: '6px 0px 0px 6px',
                    margin: 0,
                    transition: 'transform 0.2s linear',
                    ...(theme && {
                        backgroundColor: (theme.vars || theme).palette['primary'].main,
                    }),
                    ...(theme == null && {
                        background: '#6366F1'
                    }),

                },
                '& .p-progressbar-label': {
                    color: '#ffffff',
                    lineHeight: '1.5rem',
                    ...(obj.vp_LabelOffset !== 0 && {
                        position: 'absolute',
                        top: obj.vp_LabelOffset,
                        left: obj.vp_value + '%',
                        width: 'auto',
                        transform: 'translate(-50%)',
                        transition: 'all .5s ease-in-out'
                    })

                }
            }
        }

        const aa = jss.createStyleSheet(styles);
        sb.AppendLine(aa.toString());
    }

    public GenerateElement(obj: UIProgressBarClass): boolean {
        this.WriteStartFragment();
        return true;
    }
    public GenerateBody(obj: UIProgressBarClass): void {
        const template = (value) => {
            const view = getView(obj.controller, obj.vp_ValueTemplate(value));
            if (view != null) {
                return view.Render();
            }
        }

         this.WriteComponent(
             is.function(obj.vp_ValueTemplate) ?
                 <ProgressBar value={obj.vp_value} displayValueTemplate={template}></ProgressBar>
                 :
                 <ProgressBar value={obj.vp_value}></ProgressBar>
         ); 
     /*    this.WriteComponent(<div class='hello'>
              <ProgressBar value={obj.vp_value}></ProgressBar>
           <div class='hellome'>Merhaba</div> 
        </div>) */
    }
}