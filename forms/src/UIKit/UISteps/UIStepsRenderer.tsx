import { StringBuilder } from "@tuval/core";
import { Fragment } from "../../preact";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Steps } from "../Components/steps/Steps";
import { classNames } from "../Components/utils/ClassNames";
import { UIStepsClass } from "./UIStepsClass";

export class UIStepsRenderer extends ControlHtmlRenderer<UIStepsClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UIStepsClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/steps/Steps.css'));
        sb.AppendLine(require('../Components/steps/Thema.css'));
    }

    public GenerateElement(obj: UIStepsClass): boolean {
        this.WriteStartFragment();
        return true;
    }


    protected OnShadowDomDidMount(ref: any, obj: UIStepsClass): void {
        this.shadowDom = ref;
    }

    /*    protected OnShadowDomWillMount(ref: any, obj: UIContextMenuClass): void {
          const prevMenu = document.getElementById('mu_context_menu');
          if (prevMenu) {
             prevMenu.remove();
          }
       } */


    public GenerateBody(obj: UIStepsClass): void {
        const items = [
            {
                label: 'Personal',
                template: (item, options) => {
                    return (
                        /* custom element */
                        <a className={options.className} target={item.target} onClick={options.onClick}>
                            <span className={classNames(options.iconClassName, 'pi pi-home')}></span>;
                            <span className={options.labelClassName}>{item.label}</span>;
                        </a>
                    );
                }
            },
            { label: 'Seat' },
            { label: 'Payment' },
            { label: 'Confirmation' }
        ];

        this.WriteComponent(
            <Steps model={items} />
        );
    }
}