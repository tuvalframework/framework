import { UIView } from "./components/UIView/UIView";
import { State, UIController } from "./UIController";
import { ReactView } from './components/ReactView/ReactView';
import { createBrowserRouter, Link, Navigate, Outlet, Route, RouterProvider, Routes, useLocation, useParams } from "react-router-dom";
import React, { Fragment, Profiler, useEffect, useState } from "react";
import { MyTestController, TestController } from "./MyController";
import usePromise from "react-promise-suspense";
import { Application } from "./layout/Application/Application";
import { is, ModuleLoader } from "@tuval/core";
import { Loader } from "monday-ui-react-core";
import { Toast } from 'primereact'
import { HStack, VStack } from "./layout";
import { Heading } from "./components";
import { TrackJS } from 'trackjs';
import { Tracker } from "./tracker";
import { Theme } from "./thema-system";

export function getAppName() {
    try {
        let regex = /\/app\/com\.([A-Za-z]+)\.([A-Za-z]+)\.([A-Za-z]+)/i;

        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('(?:^\\/app\\/+|\\G(?!^)\\.)\\K\\w+', 'g')

        const str = window.location.href;

        let m;
        console.log(m = regex.exec(str))
        return m[3];
    }
    catch {
        return '';
    }
}


export function getAppFullName() {
    try {
        let regex = /\/app\/com\.([A-Za-z]+)\.([A-Za-z]+)\.([A-Za-z]+)/i;

        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('(?:^\\/app\\/+|\\G(?!^)\\.)\\K\\w+', 'g')

        const str = window.location.href;


        const m = regex.exec(str);
        if (m.length !== 4) {
            return null
        }

        if (is.nullOrEmpty(m[3])) {
            return null;
        }
        //alert(`com.${m[1]}.${m[2]}.${m[3]}`)
        return `com.${m[1]}.${m[2]}.${m[3]}`;
    }
    catch {
        return null;
    }
}

const AppCache = {}
const AppThemeCache = {}
const AppMainColorCache = {}
export const Paths = {}

export const ApplicationLoader = () => {
    function measureInteraction() {
        // performance.now() returns the number of ms
        // elapsed since the page was opened
        const startTimestamp = performance.now();
      
        return {
          end() {
            const endTimestamp = performance.now();
            console.log('The interaction took', endTimestamp - startTimestamp, 'ms');
          },
        };
      }

    const { app_name } = useParams();

    const location = useLocation();


    if (`/app/${app_name}` === location.pathname && Paths[app_name] != null && Paths[app_name] !== `/app/${app_name}`) {
        console.log(`/app/${app_name}` === location.pathname)
        return (<Navigate to={Paths[app_name]}></Navigate>)
    } else {
        Paths[app_name] = location.pathname;
    }

    const controllerPromise = new Promise((resolve, reject) => {
        if (AppCache[app_name]) {
            resolve({
                controller: AppCache[app_name],
                theme: AppThemeCache[app_name],
                app_main_color: AppMainColorCache[app_name]
            });
        } else {
            const app_path = `/realmocean/store/app/open-testing/${app_name}`;
            // alert(app_path)
            const app_path_local = `/static/applications/${app_name}.app`;

            const interaction = measureInteraction();
            ModuleLoader.LoadBundledModuleWithDecode(is.localhost() ? app_path_local : app_path, app_name).then((_app: any) => {
                if (_app != null) {
                    const app = new _app();
                    AppCache[app_name] = app.GetMainController();
                    AppThemeCache[app_name] = is.function(app.GetAppTheme) ? app.GetAppTheme() : null;
                    AppThemeCache[app_name] = is.function(app.GetMainThemeColor) ? app.GetMainThemeColor() : null;

                    interaction.end();
                    resolve({
                        controller: app.GetMainController(),
                        theme: is.function(app.GetAppTheme) ? app.GetAppTheme() : null,
                        app_main_color: is.function(app.GetMainThemeColor) ? app.GetMainThemeColor() : null
                    });
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
    const appInfo: any = usePromise(fetchController, [app_name]);

    Tracker.removeMetadata("app");
   
    Tracker.addMetadata("app", getAppFullName());
   

    return (<Application name={app_name} controller={appInfo.controller} theme={appInfo.theme} mainColor={appInfo.app_main_color}></Application>)
};

export class DesktopController extends UIController {

    public override LoadView(): UIView {
        const handleRender = (id, phase, actualDuration) => {
            console.log(
                `The ${id} interaction took ` +
                `${actualDuration}ms to render (${phase})`,
            );
            // Would log “The ComposeButton interaction
            // took 25.2999999970197678ms to render (update)”
        };

        return (
            ReactView(
                <Routes>
                    {/* <Route path="/" element={<div>Home Me Test Me</div>} /> */}
                    <Route path={this.props.baseUrl + "/app/:app_name/*"} element={(
                        <React.Suspense fallback={
                            <Fragment>
                                {
                                    VStack(
                                        Heading(getAppName()).h2(),
                                        ReactView(
                                            <Loader size={Loader.sizes.MEDIUM} />
                                        )
                                    ).render()
                                }

                            </Fragment>

                        } >
                            <ErrorBoundary>
                                <Profiler id="ComposeButton" onRender={handleRender}>
                                    <ApplicationLoader></ApplicationLoader>
                                </Profiler>
                            </ErrorBoundary>
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

/**
 * NEW: The error boundary has a function component wrapper.
 */
export function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if (hasError) {
            setHasError(false);
        }
    }, [location.key]);
    return (
        /**
         * NEW: The class component error boundary is now
         *      a child of the functional component.
         */
        <ErrorBoundaryInner
            hasError={hasError}
            setHasError={setHasError}
        >
            {children}
        </ErrorBoundaryInner>
    );
}



/**
 * NEW: The class component accepts getters and setters for
 *      the parent functional component's error state.
 */
export class ErrorBoundaryInner extends React.Component<any, any> {
    private ref;
    constructor(props) {
        super(props);
        this.state = { hasError: false };
        this.ref = React.createRef();
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidUpdate(prevProps, _previousState) {
        if (!this.props.hasError && prevProps.hasError) {
            this.setState({ hasError: false });
        }
    }

    componentDidCatch(_error, _errorInfo) {

        if (_errorInfo && _errorInfo.componentStack) {
            // The component stack is sometimes useful in development mode
            // In production it can be somewhat obfuscated, so feel free to omit this line.
            //console.log(_errorInfo.componentStack);
        }


        _error['Hata'] = JSON.stringify(_error)

        Tracker.track(_error);


        this.props.setHasError(true);
        this.setState({ errorText: JSON.stringify(_error) });
    }

    render() {
        return this.state.hasError
            ? <p>{this.state.errorText}</p>


            : this.props.children;
    }
}