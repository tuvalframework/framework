import { ModuleLoader, is } from "@tuval/core";
import usePromise from "react-promise-suspense";
import { useLocation } from "react-router-dom";
import { WidgetComponent } from "./WidgetComponent";
import React from "react";

const WidgetCache = {}
export const Paths = {}

export const WidgetLoader = ({ widget, config, onSave }) => {
    // const { app_name } = useParams();
 
     const location = useLocation();
 
 
     /* if (`/app/${app_name}` === location.pathname && Paths[app_name] != null && Paths[app_name] !== `/app/${app_name}`) {
         console.log(`/app/${app_name}` === location.pathname)
         return (<Navigate to={Paths[app_name]}></Navigate>)
     } else {
         Paths[app_name] = location.pathname;
     } */
 
     const controllerPromise = new Promise((resolve, reject) => {
         if (WidgetCache[widget]) {
             resolve(WidgetCache[widget]);
         } else {
 
             const app_path = `/realmocean/store/widget/open-testing/${widget}`;
             // alert(app_path)
             const app_path_local = `/static/applications/${widget}`;
 
            // const app_path_local = `/static/applications/${widget}`;
             ModuleLoader.LoadBundledModuleWithDecode(is.localhost() ? app_path_local : app_path, widget).then((_app: any) => {
                 if (_app != null) {
                     const app = new _app();
                     WidgetCache[widget] = app.GetMainController();
                     resolve(app.GetMainController());
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
 
     return (<WidgetComponent name={widget} controller={contoller} config={config} onSave={onSave}></WidgetComponent>)
 }