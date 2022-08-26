import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView, ViewProperty } from "../UIView";
import { foreach } from '@tuval/core';
import { getView, viewFunc } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { IControl } from "../../windows/Forms/Components/AAA/IControl";
import { Control } from "../../windows/Forms/Components/AAA/Control";
import { Teact } from "../../windows/Forms/Components/Teact";



class TableColumnRenderer extends ControlHtmlRenderer<TableColumnClass> {

    public OnCustomAttributesCreating(obj: TableColumnClass, attributeObject: any): void {

    }

    public GenerateElement(obj: TableColumnClass): boolean {
        this.WriteStartElement('th');

        return true;
    }
    public GenerateBody(obj: TableColumnClass): void {

        const nodes = this.CreateControls(obj);
        foreach(nodes, node => {
            this.WriteComponent(
                node[0]
            )
        });

        this.WriteEndElement();
    }

    protected CreateControls(obj: TableColumnClass): any[] {
        const vNodes: any[] = [];
        if (obj.Controls != null) {
            foreach(obj.Controls, (control) => {
                vNodes.push((control as any).CreateMainElement());
            });
        }
        if (obj.GetViews != null) {
            let viewCount = obj.GetViews().length;
            let index = 0;
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    const style = {};
                    const _view = view as UIView;
                    if (_view.vp_TableHeaderWidth) {
                        style['width'] = _view.vp_TableHeaderWidth;
                    }
                    if (_view.vp_TableHeaderHeight) {
                        style['height'] = _view.vp_TableHeaderHeight;
                    }
                    vNodes.push([view.Render(), style]);
                }
                index++;
            });
        }
        return vNodes;
    }

}

export class TableColumnClass extends UIView {

    /** @internal */
    @ViewProperty() vp_HeaderView: UIView;
    setHeaderView(value: UIView): this {
        this.vp_HeaderView = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_RowFunction: (dataRow: any) => UIView;
    setRowFunction(value: (dataRow: any) => UIView): this {
        this.vp_RowFunction = value;
        return this;
    }

    /** @internal */
    @ViewProperty() vp_HeaderWidth: string;
    headerWidth(value: string): this {
        this.vp_HeaderWidth = value;
        return this;
    }

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new TableColumnRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
}


export interface HeaderParams {

}

export type FunctionHeader = (...views: UIView[]) => TableColumnClass;
export type FunctionRow= (rowFunction: (dataRow: any)=>UIView) => TableColumnClass;

export function TableColumn(): TableColumnClass;
export function TableColumn(...views: (UIView | IControl | UIController)[]): FunctionRow;
export function TableColumn(value: HeaderParams): FunctionHeader;
export function TableColumn(...args: any[]): FunctionHeader | TableColumnClass | FunctionRow {
    if (args.length === 0) {
        return viewFunc(TableColumnClass, (controller, propertyBag) => {
            return new TableColumnClass().setController(controller).PropertyBag(propertyBag);
        });
    } else if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const params: HeaderParams = args[0];

        return (...views: UIView[]) => {
            return viewFunc(TableColumnClass, (controller, propertyBag) => {
                return new TableColumnClass().setController(controller).PropertyBag(propertyBag).setChilds(...views);
            });
        }
    } else {
        return (rowFunction: (dataRow: any) => UIView) => {
            return viewFunc(TableColumnClass, (controller, propertyBag) => {
                return new TableColumnClass().setController(controller).PropertyBag(propertyBag).setHeaderView(args[0]).setRowFunction(rowFunction);
            });
        }
    }
}