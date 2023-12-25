import { ModuleLoader } from "@tuval/core";
import React from "react";
import usePromise from "react-promise-suspense";
import { WidgetComponent } from "./WidgetComponent";

const WidgetCache = {}
export const Paths = {}

export const WidgetLoader = ({ alwaysNew, widget, config, data, onSave }) => {

    const controllerPromise = new Promise((resolve, reject) => {
        if (WidgetCache[widget]) {
            resolve(WidgetCache[widget]);
        } else {

            const app_path = `/realmocean/store/widget/open-testing/${widget}`;
            // alert(app_path)
            const app_path_local = `/system/${widget}`;

            // const app_path_local = `/static/applications/${widget}`;
            ModuleLoader.LoadBundledModuleWithDecode(/* is.localhost() ? */ app_path_local /* : app_path */, widget).then((_app: any) => {
                if (_app != null) {
                    const app = new _app();
                    const controller = app.GetMainController();
                    WidgetCache[widget] = controller;
                    resolve(controller);
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

    const fetchController = input => controllerPromise.then(res => res);
    const contoller: any = usePromise(fetchController, [widget]);

    return (<WidgetComponent name={widget} controller={alwaysNew ? class extends contoller { } : contoller} config={config} data={data} onSave={onSave}></WidgetComponent>)
}