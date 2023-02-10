import { UIViewClass } from "./components/UIView/UIViewClass";
import { State, UIController } from "./UIController";
import { ReactView } from './components/ReactView/ReactView';
import { createBrowserRouter, Link, Outlet, Route, RouterProvider, Routes, useParams } from "react-router-dom";
import React from "react";
import { MyTestController, TestController } from "./MyController";
import usePromise from "react-promise-suspense";
import { Application } from "./layout/Application/Application";
import { ModuleLoader } from "@tuval/core";


const AppStore = [{
    name: "organizationmanager",
    controller: MyTestController
},
{
    name: "testapp",
    controller: TestController
}];

export const ApplicationLoader = () => {
    const { app_name } = useParams();

    const controllerPromise = new Promise((resolve, reject) => {
         ModuleLoader.LoadBundledModuleWithDecode(`/${app_name}.app`, app_name).then((_app: any) => {
            if (_app != null) {
                const app = new _app();
                resolve(app.GetMainController());
            } else {

            }
        });
        /*   setTimeout(() => {
              const app = AppStore.find(app => app.name === app_name)
              resolve(app.controller)
          }, 2000
          ) */
    })

    const fetchController = input => controllerPromise.then(res => res);
    const contoller = usePromise(fetchController, [app_name]);

    return (<Application name={app_name} controller={contoller}></Application>)
};

export class DesktopController extends UIController {

    public override LoadView(): UIViewClass {
        return (
            ReactView(
                /*  <RouterProvider router={router} /> */
                <Routes>
                    <Route path="/" element={<div>Home Me Test Me</div>} />
                    <Route path="/app/:app_name/*" element={(
                        <React.Suspense fallback={<h1>Loading...</h1>} >
                            <ApplicationLoader></ApplicationLoader>
                        </React.Suspense>
                    )} />

                </Routes>
            )
        )
    }

}