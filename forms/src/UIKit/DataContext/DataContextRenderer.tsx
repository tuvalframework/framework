
import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import React, { Fragment } from "../../preact/compat";
import { QueryClient } from "../../query/core/queryClient";
import convertLegacyDataProvider from "../../query/dataProvider/convertLegacyDataProvider";
import { DataProviderContext } from "../../query/dataProvider/DataProviderContext";
import { QueryClientProvider, useQueryClient } from "../../query/tuval/QueryClientProvider";
import { _useDataProvider } from "../../tuval-forms";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { DataContextClass } from "./DataContextClass";

const query = new QueryClient();

const DataProxy = ({ renderer, obj }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj)}
        </Fragment>
    )
}

export class DataContextRenderer extends ControlHtmlRenderer<DataContextClass> {
    overlay: any;

    public GenerateElement(obj: DataContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: DataContextClass): void {

        const finalQueryClient = new QueryClient()/* React.useMemo(() => obj.vp_QueryClient || new QueryClient(), [
            obj.vp_QueryClient,
        ]);
 */
        const finalDataProvider = React.useMemo(
            () =>
                obj.vp_DataProvider instanceof Function
                    ? convertLegacyDataProvider(obj.vp_DataProvider)
                    : obj.vp_DataProvider,
            [obj.vp_DataProvider]
        );

        debugger;
        this.WriteComponent(
            <DataProviderContext.Provider value={finalDataProvider}>
                <QueryClientProvider client={query}>
                      <DataProxy renderer={this} obj={obj}></DataProxy> 
                </QueryClientProvider>
            </DataProviderContext.Provider>

        );
    }

    /*  public override OnComponentDidUpdate(obj: OverlayPanelClass): void {
         if (obj._show) {
             this.overlay.show();
         } else {
             this.overlay.hide();
         }
     }
  */


    protected CreateControls(obj: DataContextClass): any[] {
        const vNodes: any[] = [];

        if ((obj as any).SubViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
            });
        }

        return vNodes;
    }
}