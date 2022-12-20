
import { foreach, int } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import React, { Fragment } from "../../preact/compat";
import { QueryClient } from "../../query/core/queryClient";
import { RecordContextProvider } from "../../query/record/RecordContext";
import { useGetOne } from "../../query/dataProvider/useGetOne";
import { QueryClientProvider, useQueryClient } from "../../query/tuval/QueryClientProvider";
import { useGetList, _useDataProvider } from "../../tuval-forms";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { RecordsContextClass } from "./RecordsContextClass";

const query = new QueryClient();

const RecordProxy = ({ renderer, obj, data, total, isLoading, error, refetch }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj, data, total, isLoading, error, refetch)}
        </Fragment>
    )
}

export class RecordsContextRenderer extends ControlHtmlRenderer<RecordsContextClass> {
    overlay: any;

    public GenerateElement(obj: RecordsContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: RecordsContextClass): void {
        const { data, total, isLoading, error, refetch } = useGetList(obj.vp_Resource, {
            pagination: undefined,
            sort: undefined,
            filter: obj.vp_Filter
        });

        /*  if (isLoading) {
             this.WriteComponent(
                 <div>Loading...</div>
             );
         } */

        this.WriteComponent(
            <RecordContextProvider value={data}>
                <RecordProxy renderer={this} obj={obj} data={data} total={total} isLoading={isLoading} error={error} refetch={refetch}></RecordProxy>
            </RecordContextProvider>
        );
    }

    protected CreateControls(obj: RecordsContextClass, data: any, total: int, isLoading: boolean, error: string, refetch: boolean): any[] {
        const vNodes: any[] = [];

        if (obj.vp_Content != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_Content({ data, isLoading, total, error, refetch }));
            if (view != null) {
                vNodes.push(view.Render());
            }
        }

        return vNodes;
    }

    /* protected CreateControls(obj: RecordContextClass): any[] {
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
   }  */
}