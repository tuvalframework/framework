import { ModuleLoader } from "@tuval/core";
import React from "react";
import usePromise from "react-promise-suspense";
import { WidgetComponent } from "./WidgetComponent";

const WidgetCache = {}
const LoadingWidgets = {}
export const Paths = {}

export const WidgetLoader = ({ alwaysNew, widget, config, data, onSave }) => {

    const controllerPromise = new Promise((resolve, reject) => {
        if (WidgetCache[widget]) {
            resolve(WidgetCache[widget]);
        } else if (LoadingWidgets[widget]) {
            LoadingWidgets[widget].push(resolve);
        }
        else {

            const app_path = `/realmocean/store/widget/open-testing/${widget}`;
            // alert(app_path)
            const app_path_local = `/system/${widget}`;

            LoadingWidgets[widget] = [];
            // const app_path_local = `/static/applications/${widget}`;
            ModuleLoader.LoadBundledModule(/* is.localhost() ? */ app_path_local /* : app_path */, widget).then((_app: any) => {
                if (_app != null) {
                    const app = new _app();
                    const element = app.GetMainController();
                    WidgetCache[widget] = element;
                    LoadingWidgets[widget].forEach(resolve => resolve(element));
                    delete LoadingWidgets[widget];
                    resolve(element);
                } else {

                }
            });
        }

        /*   setTimeout(() => {
              const app = AppStore.find(app => app.name === app_name)
              resolve(app.controller)
          }, 2000
          ) */
    })

    const element = input => controllerPromise.then(res => res);
    const contoller: any = usePromise(element, [widget]);

    return (<WidgetComponent name={widget} element={contoller} config={config} data={data} onSave={onSave}></WidgetComponent>)
}