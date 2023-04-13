import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tracker } from "./tracker";
import { HStack } from "./layout";
import { Text } from "./components";
import { cLeading } from "./Constants";

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

        console.log(_error)
        this.props.setHasError(true);
        this.setState({ errorText: JSON.stringify(_error), error: _error});
    }

    render() {
        return this.state.hasError
            ? HStack({alignment:cLeading})(
                Text(this.state.error?.toString()).fontSize(15)
            )
            .background('rgba(255,0,0,.4)')
            .border('solid 2px red')
            .render() 


            : this.props.children;
    }
}