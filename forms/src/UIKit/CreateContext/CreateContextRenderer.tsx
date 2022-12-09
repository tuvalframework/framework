
import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import React, { Fragment } from "../../preact/compat";
import { QueryClient } from "../../query/core/queryClient";
import { RecordContextProvider } from "../../query/record/RecordContext";
import { useCreate } from "../../query/dataProvider/useCreate";
import { QueryClientProvider, useQueryClient } from "../../query/tuval/QueryClientProvider";
import { useFormContext, _useDataProvider } from "../../tuval-forms";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { CreateContextClass } from "./CreateContextClass";
import { bindFormController } from '../UIController';

const query = new QueryClient();

const CreateProxy = ({ renderer, obj, handleCreate, isLoading, isSuccess }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj, handleCreate, isLoading, isSuccess)}
        </Fragment>
    )
}

export class CreateContextRenderer extends ControlHtmlRenderer<CreateContextClass> {
    overlay: any;

    public GenerateElement(obj: CreateContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: CreateContextClass): void {

        const formController = bindFormController();
        const [create, { isLoading, isSuccess }] = useCreate();

        const handleCreate = () => {
            const [isValid, data] = formController.validateForm();
            if (isValid) {
                create(obj.vp_Resource, { data: data })
            }
        }

       

      /*   if (isLoading) {
            this.WriteComponent(
                <div>Loading...</div>
            );
        } */

        this.WriteComponent(
          
                <CreateProxy renderer={this} obj={obj} handleCreate={handleCreate} isLoading={isLoading} isSuccess={isSuccess} ></CreateProxy>
            
        );
    }

    protected CreateControls(obj: CreateContextClass, handleCreate: any, isLoading: boolean, isSuccess: boolean): any[] {
        const vNodes: any[] = [];

        if (obj.vp_Content != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_Content(handleCreate, isLoading, isSuccess));
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