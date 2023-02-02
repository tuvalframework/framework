
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
import { UpdateContextClass } from "./UpdateContextClass";
import { bindFormController } from '../UIController';
import { useGetOne } from "../../query/dataProvider/useGetOne";

const query = new QueryClient();

const CreateProxy = ({ renderer, obj, handleUpdate, data, isLoading, isSuccess }) => {
    // console.log(_useDataProvider())
    return (
        <Fragment>
            {renderer.CreateControls(obj, handleUpdate, data, isLoading, isSuccess)}
        </Fragment>
    )
}

export class UpdateContextRenderer extends ControlHtmlRenderer<UpdateContextClass> {
    overlay: any;

    public GenerateElement(obj: UpdateContextClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public get UseFrameStyles(): boolean {
        return false;
    }

    public GenerateBody(obj: UpdateContextClass): void {

        debugger;
        const formController = bindFormController();

        const getOneResult = useGetOne(obj.vp_Resource, obj.vp_Filter, {
            onSuccess: (data) => {


            }
        });

        if (getOneResult.isSuccess) {
            if (!formController.IsLoaded) {
                for (const key in getOneResult.data) {
                    formController.SetValue(key, getOneResult.data[key], false);
                }
                // console.log('form loaded.')
                formController.IsLoaded = true;
            }
        }


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

        const [update, { isLoading, isSuccess }] = useUpdate();

        const handleUpdate = () => {
            const [isValid, formData] = formController.validateForm();

           /*  for(let key in formData) {
                if (is.nullOrUndefined(formData[key])) {
                    delete formData[key];
                }
            } */

            if (isValid) {
                update(obj.vp_Resource, { id: getOneResult.data.id, data: formData, previousData: getOneResult.data },
                    {
                        onSuccess: (data) => {
                            if (is.function(obj.vp_OnSuccess)) {
                                obj.vp_OnSuccess(data);
                            }
                        },
                        onError: (e) => {
                            if (is.function(obj.vp_OnError)) {
                                obj.vp_OnError(e);
                            }
                        }
                    })
            }
        }



        /*   if (isLoading) {
              this.WriteComponent(
                  <div>Loading...</div>
              );
          } */

        this.WriteComponent(

            <CreateProxy renderer={this} obj={obj} data={getOneResult.data} handleUpdate={handleUpdate} isLoading={isLoading} isSuccess={isSuccess} ></CreateProxy>

        );
    }

    protected CreateControls(obj: UpdateContextClass, handleUpdate: any, data: any, isLoading: boolean, isSuccess: boolean): any[] {
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