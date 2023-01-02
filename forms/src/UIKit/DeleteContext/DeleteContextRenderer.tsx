
import { foreach, is } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import React, { Fragment } from "../../preact/compat";
import { QueryClient } from "../../query/core/queryClient";
import { RecordContextProvider } from "../../query/record/RecordContext";
import { useUpdate } from "../../query/dataProvider/useUpdate";
import { QueryClientProvider, useQueryClient } from "../../query/tuval/QueryClientProvider";
import { useFormContext, _useDataProvider } from "../../tuval-forms";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { DeleteContextClass } from "./DeleteContextClass";
import { bindFormController } from '../UIController';
import { useGetOne } from "../../query/dataProvider/useGetOne";
import { useDelete } from "../../query/dataProvider/useDelete";

const query = new QueryClient();

const CreateProxy = ({ renderer, obj, handleUpdate, data, isLoading, isSuccess }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj, handleUpdate, data, isLoading, isSuccess)}
        </Fragment>
    )
}

export class DeleteContextRenderer extends ControlHtmlRenderer<DeleteContextClass> {
    overlay: any;

    public GenerateElement(obj: DeleteContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: DeleteContextClass): void {

        debugger;
        const formController = bindFormController();

        const getOneResult = useGetOne(obj.vp_Resource, obj.vp_Filter, {
            onSuccess: (data) => {
                if (!formController.IsLoaded) {
                    for (const key in data) {
                        formController.SetValue(key, data[key], false);
                    }
                    console.log('form loaded.')
                    formController.IsLoaded = true;
                }
            }
        });

        if (getOneResult.isLoading) {
            this.WriteComponent(
                <div>Loading...</div>
            );
        }

        if (getOneResult.error) {
            this.WriteComponent(
                <div>Error</div>
            );
        }

        const [deleteOne, { isLoading, isSuccess }] = useDelete();

        const handleDelete = () => {

            deleteOne(obj.vp_Resource, { id: getOneResult.data.id, previousData: getOneResult.data },
                {
                    onSuccess: () => {
                        if (is.function(obj.vp_OnSuccess)) {
                            obj.vp_OnSuccess();
                        }
                    }
                })



        }



        /*   if (isLoading) {
              this.WriteComponent(
                  <div>Loading...</div>
              );
          } */

        this.WriteComponent(

            <CreateProxy renderer={this} obj={obj} data={getOneResult.data} handleUpdate={handleDelete} isLoading={isLoading} isSuccess={isSuccess} ></CreateProxy>

        );
    }

    protected CreateControls(obj: DeleteContextClass, handleUpdate: any, data: any, isLoading: boolean, isSuccess: boolean): any[] {
        const vNodes: any[] = [];

        if (obj.vp_Content != null) {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, obj.vp_Content(handleUpdate, data, isLoading, isSuccess));
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