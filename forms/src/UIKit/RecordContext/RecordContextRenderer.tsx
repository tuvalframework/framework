
import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import React, { Fragment } from "../../preact/compat";
import { QueryClient } from "../../query/core/queryClient";
import { RecordContextProvider } from "../../query/record/RecordContext";
import { useGetOne } from "../../query/dataProvider/useGetOne";
import { QueryClientProvider, useQueryClient } from "../../query/tuval/QueryClientProvider";
import { _useDataProvider } from "../../tuval-forms";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { RecordContextClass } from "./RecordContextClass";

const query = new QueryClient();

const RecordProxy = ({ renderer, obj, data }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj, data)}
        </Fragment>
    )
}

export class RecordContextRenderer extends ControlHtmlRenderer<RecordContextClass> {
    overlay: any;

    public GenerateElement(obj: RecordContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: RecordContextClass): void {
        const { data, isLoading, error } = useGetOne(obj.vp_Resource, obj.vp_Filter);

         if (isLoading) {
            this.WriteComponent(
                <div>Loading...</div>
            );
        } 

        this.WriteComponent(
            <RecordContextProvider value={data}>
                <RecordProxy renderer={this} obj={obj} data={data} ></RecordProxy>
            </RecordContextProvider>
        );
    }

     protected CreateControls(obj: RecordContextClass, data: any): any[] {
        const vNodes: any[] = [];

        if (obj.vp_Content != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_Content(data));
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