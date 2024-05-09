import { ModuleLoader } from "@tuval/core";
import React from "react";
import usePromise from "react-promise-suspense";
import { WidgetComponent } from "./WidgetComponent";

export const WidgetCache = {}
export const LoadingWidgets = {}


export const WidgetLoader = ({ alwaysNew, widget, type, config, data, onSave }) => {

    var controllerPromise = function (widget) {
        return new Promise(function (resolve, reject) {

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
                        const controller = app.GetMainController();
                        WidgetCache[widget] = controller;
                        LoadingWidgets[widget].forEach(resolve => resolve(controller));
                        delete LoadingWidgets[widget];

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
        });
    };



    const fetchController = (widget, type) => controllerPromise(widget);

    let contoller: any = usePromise(fetchController, [widget, type]);
    if (type != null) {
        contoller = contoller[type];
    }

    return (<WidgetComponent name={widget} controller={alwaysNew ? class extends contoller { } : contoller} config={config} data={data} onSave={onSave}></WidgetComponent>)
}