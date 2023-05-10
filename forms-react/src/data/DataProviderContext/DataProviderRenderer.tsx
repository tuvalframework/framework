import React, { Fragment, useEffect, useState } from "react";
import { DataProtocolClass, DataProtocolContext } from "./DataProviderClass";
import { ProviderLoader } from "./ProviderLoader";
import { VStack } from "../../layout/VStack/VStack";
import { Spinner } from "../../components/UISpinner/UISpinner";
import { useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModuleLoader, Reflect } from "@tuval/core";
import { useAsync } from "react-async-hook";
import { TaskProtocol } from "./Protocols";
import { query } from "../DataContext/DataContextRenderer";

export interface IControlProperties {
    control: DataProtocolClass<any>
}


/* const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: false
        }
    },
}); */

/**
 * NEW: The error boundary has a function component wrapper.
 */
function ErrorBoundary({ children }) {
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
class ErrorBoundaryInner extends React.Component<any, any> {
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


        _error['Hey'] = 'sdfsdf'
        _error['Mert'] = 'sdfsdf'


        //Tracker.track(_error);


        this.props.setHasError(true);
        this.setState({ errorText: JSON.stringify(_error) });
    }

    render() {
        return this.state.hasError
            ? <p>{this.state.errorText}</p>


            : this.props.children;
    }
}

const LoadProvider = (providerName: string) => {
    const app_path = `/realmocean/store/widget/open-testing/${providerName}`;
    // alert(app_path)
    const app_path_local = `/static/applications/${providerName}`;

    return new Promise((resolve, reject) => {
        ModuleLoader.LoadBundledModuleWithDecode(/* is.localhost() ? */ app_path_local /* : app_path */, providerName).then((_app: any) => {
            if (_app != null) {
                const app = new _app();
                // ProviderCache[widget] = app.GetMainController();
                resolve(app.GetProvider());
            } else {

            }
        });
    })
}

/* const LoadProvider = (providerName: string) => {
    const app_path = `/realmocean/store/widget/open-testing/${providerName}`;
    // alert(app_path)
    const app_path_local = `/static/applications/${providerName}`;
    return (
        Promise.all([
            _LoadProvider('com.tuvalsoft.provider.tasks'),
            _LoadProvider('com.tuvalsoft.provider.okr')
        ])
    )

} */



function _DataProtocolRenderer({ control }: IControlProperties) {
    const [queryClient] = useState(new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <React.Suspense fallback={
                <Fragment>
                    {
                        VStack(
                            Spinner()
                        ).render()
                    }
                </Fragment>
            } >
                <ErrorBoundary>
                    <ProviderLoader widget={control.vp_qn} config={control.vp_Config} content={control.vp_Content} onSave={(content) => {
                    }}></ProviderLoader>
                </ErrorBoundary>
            </React.Suspense>
        </QueryClientProvider>
    )

}


const ProviderContentProxy = ({ config, content, /* data, isLoading, error */ }) => {
    const view = content(/*{  data, isLoading, error } */);
    return (
        <Fragment>
            {
                view.render()
            }
        </Fragment>
    )

}

function DataProtocolRenderer({ control }: IControlProperties) {

    let dataProtocolContextObject = {}
    const dataProtocolContext = React.useContext(DataProtocolContext);



    const { result, loading: isLoading, error } = useAsync(LoadProvider, [control.vp_qn]);
    /* let result;
    if (results != null) {
        result = results[0];
    } */
    //const result = results[0]

    if (isLoading) return null;

    /* for(let i=0;i<results.length;i++){
        
    } */

    const providers = window.Reflect.ownKeys(result as any);
    let variables = control.vp_Config.variables;

    if (dataProtocolContext?.qn === control.vp_qn) {
        variables = Object.assign({ ...control.vp_Config.variables }, dataProtocolContext.config.variables)
    }

    Object.assign(control.vp_Config, { variables });

    for (let i = 0; i < providers.length; i++) {

        if (dataProtocolContext == null) {
            dataProtocolContextObject[providers[i]] = { provider: result[providers[i]], config: control.vp_Config };
        } else if (dataProtocolContext.dataProtocolContextObject == null) {
            dataProtocolContextObject = dataProtocolContext.dataProtocolContextObject = {};
            dataProtocolContextObject[providers[i]] = { provider: result[providers[i]], config: control.vp_Config };
        } else {
            dataProtocolContextObject = dataProtocolContext.dataProtocolContextObject;
            dataProtocolContextObject[providers[i]] = { provider: result[providers[i]], config: control.vp_Config };
        }
    }

    return (
        <QueryClientProvider client={query}>
            <DataProtocolContext.Provider value={{ qn: control.vp_qn, dataProtocolContextObject, config: control.vp_Config }}>
                <ProviderContentProxy config={control.vp_Config} content={control.vp_Content}></ProviderContentProxy>
            </DataProtocolContext.Provider>
        </QueryClientProvider>
    )

}

export default DataProtocolRenderer;