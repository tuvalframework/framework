
import { ModuleLoader, is } from "@tuval/core";
import usePromise from "react-promise-suspense";
import { useLocation } from "react-router-dom";

import React from "react";

export class ProviderComponent extends React.Component<any, any> {
    public get Name(): string {
        return this.props.name;
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (

            <this.props.controller config={this.props.config} content={this.props.content}  onSave={this.props.onSave}></this.props.controller>

        )
    }
}




const ProviderCache = {}
export const Paths = {}

export const ProviderLoader = ({ widget, config,content, onSave }) => {
    // const { app_name } = useParams();

    const location = useLocation();


    /* if (`/app/${app_name}` === location.pathname && Paths[app_name] != null && Paths[app_name] !== `/app/${app_name}`) {
        console.log(`/app/${app_name}` === location.pathname)
        return (<Navigate to={Paths[app_name]}></Navigate>)
    } else {
        Paths[app_name] = location.pathname;
    } */

    const controllerPromise = new Promise((resolve, reject) => {
        if (ProviderCache[widget]) {
            resolve(ProviderCache[widget]);
        } else {

            const app_path = `/realmocean/store/widget/open-testing/${widget}`;
            // alert(app_path)
            const app_path_local = `/system/${widget}`;

            // const app_path_local = `/static/applications/${widget}`;
            ModuleLoader.LoadBundledModule(/* is.localhost() ? */ app_path_local /* : app_path */, widget).then((_app: any) => {
                if (_app != null) {
                    const app = new _app();
                    ProviderCache[widget] = app.GetMainController();
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

    return (
        <ProviderComponent name={widget} controller={contoller} config={config} content={content}  onSave={onSave}>

        </ProviderComponent>)
}