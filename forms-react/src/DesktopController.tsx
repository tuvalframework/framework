import { UIView } from "./components/UIView/UIView";
import { State, UIController } from "./UIController";
import { ReactView } from './components/ReactView/ReactView';
import { createBrowserRouter, Link, Navigate, Outlet, Route, RouterProvider, Routes, useLocation, useParams } from "react-router-dom";
import React from "react";
import { MyTestController, TestController } from "./MyController";
import usePromise from "react-promise-suspense";
import { Application } from "./layout/Application/Application";
import { ModuleLoader } from "@tuval/core";


const AppCache = {}
export const Paths = {}

export const ApplicationLoader = () => {
    const { app_name } = useParams();

    const location = useLocation();


    if ( `/app/${app_name}` === location.pathname && Paths[app_name] != null && Paths[app_name] !== `/app/${app_name}` ) {
        console.log(`/app/${app_name}` === location.pathname)
        return (<Navigate to={Paths[app_name]}></Navigate>)
    } else {
        Paths[app_name] = location.pathname;
    }

    const controllerPromise = new Promise((resolve, reject) => {
        if (AppCache[app_name]) {
            resolve(AppCache[app_name]);
        } else {
            ModuleLoader.LoadBundledModuleWithDecode(`/${app_name}.app`, app_name).then((_app: any) => {
                if (_app != null) {
                    const app = new _app();
                    AppCache[app_name] = app.GetMainController();
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
    const contoller: any = usePromise(fetchController, [app_name]);

    return (<Application name={app_name} controller={contoller}></Application>)
};

export class DesktopController extends UIController {

    public override LoadView(): UIView {
        return (
            ReactView(
                <Routes>
                    {/* <Route path="/" element={<div>Home Me Test Me</div>} /> */}
                    <Route path="/app/:app_name/*" element={(
                        <React.Suspense fallback={<h1>Loading...</h1>} >
                            <ApplicationLoader></ApplicationLoader>
                        </React.Suspense>
                    )}
                        action={async ({ params, request }) => {
                            alert(JSON.stringify(params))
                        }}
                    />

                </Routes>
            )
        )
    }

}