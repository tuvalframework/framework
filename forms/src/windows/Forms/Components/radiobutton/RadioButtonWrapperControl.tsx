import { ControlHtmlRenderer } from '../AAA';
import { Control } from '../AAA/Control';
import { Event, StringBuilder } from '@tuval/core';
import { Teact } from '../Teact';
import { RadioButtonComponent } from './RadioButton';

export class RadioButtonWrapperControl extends Control<RadioButtonWrapperControl> {
    /**
     * Unique identifier of the inner native radiobutton.
     */

    public InputId: string = null;

    /**
     * Name of the checkbox element .
     */
    public Name: string = null;

    /**
     * Value of the radiobutton.
     */
    public Value: any = null;

    /**
     * Specifies whether a radiobutton should be checked or not.
     */
    public Checked: boolean = false;

    /**
     * Inline style of the element.
     */
    public Style: string = null;
    public ClassName: string = null;
    public Disabled: boolean = false;
    public Required: boolean = false;
    public Tooltip: any = null;
    public TooltipOptions: Object = null;
    public AriaLabelledBy: string = null;
    public OnChange: any = new Event();

    protected GetRenderer(): any {
        return class RadioButtonWrapperControlRenderer extends ControlHtmlRenderer<RadioButtonWrapperControl> {
            public get UseShadowDom(): boolean {
                return true;
            }
            public OnStyleCreating(obj: RadioButtonWrapperControl, sb: StringBuilder): void {
                const style = `
                .p-radiobutton {
                    display: inline-flex;
                    cursor: pointer;
                    user-select: none;
                    vertical-align: bottom;
                }

                .p-radiobutton-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .p-radiobutton-icon {
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    transform: translateZ(0) scale(.1);
                    border-radius: 50%;
                    visibility: hidden;
                }
                .p-hidden-accessible {
                    border: 0;
                    clip: rect(0 0 0 0);
                    height: 1px;
                    margin: -1px;
                    overflow: hidden;
                    padding: 0;
                    position: absolute;
                    width: 1px;
                }
                `;

                sb.AppendLine(style);

                const visualStyles = `
                .p-radiobutton-box.p-highlight .p-radiobutton-icon {
                    transform: translateZ(0) scale(1.0, 1.0);
                    visibility: visible;
                }

                .p-radiobutton .p-radiobutton-box {
                    border: 2px solid #ced4da;
                    background: #ffffff;
                    width: 18px;
                    height: 18px;
                    color: #495057;
                    border-radius: 50%;
                    transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
                }

                .p-radiobutton .p-radiobutton-box:not(.p-disabled):not(.p-highlight):hover {
                    border-color: #6366F1;
                }

                .p-radiobutton .p-radiobutton-box.p-highlight {
                    border-color: #6366F1;
                    background: #6366F1;
                }

                .p-radiobutton .p-radiobutton-box:not(.p-disabled).p-focus {
                    outline: 0 none;
                    outline-offset: 0;
                    box-shadow: 0 0 0 0.2rem #c7d2fe;
                    border-color: #6366F1;
                }

                .p-radiobutton .p-radiobutton-box .p-radiobutton-icon {
                    width: 8px;
                    height: 8px;
                    transition-duration: 0.2s;
                    background-color: #ffffff;
                }
                `;
                sb.AppendLine(visualStyles);
            }
            public GenerateBody(obj: RadioButtonWrapperControl): void {
                const component = (
                    <RadioButtonComponent
                        inputId={obj.InputId}
                        name={obj.Name}
                        value={obj.Value}
                        checked={obj.Checked}
                        style={obj.Style}
                        className={obj.ClassName}
                        disabled={obj.Disabled}
                        required={obj.Required}
                        tooltip={obj.Tooltip}
                        tooltipOptions={obj.TooltipOptions}
                        ariaLabelledBy={obj.AriaLabelledBy}
                        onChange={(e) => obj.OnChange(e)} />
                );
                this.WriteComponent(component);
            }
        }
    }
}