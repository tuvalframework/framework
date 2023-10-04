import React, { Fragment, useEffect, useState } from "react";
import { Spinner } from "../../components/UISpinner/UISpinner";
import { VStack } from "../../layout/VStack/VStack";
import { WidgetClass } from "./WidgetClass";
import { WidgetLoader } from "./WidgetLoader";

export interface IControlProperties {
    control: WidgetClass
}

/**
 * NEW: The error boundary has a function component wrapper.
 */
function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    let location ;
    useEffect(() => {
        if (hasError) {
            setHasError(false);
        }
    }, []);
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


function WidgetRenderer({ control }: IControlProperties) {

    return (
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
                <WidgetLoader alwaysNew={control.vp_AlwaysNew} widget={control.vp_qn} config={control.vp_Config} data={control.vp_Data} onSave={(content) => {
                }}></WidgetLoader>
            </ErrorBoundary>
        </React.Suspense>
    )

}

export default WidgetRenderer;