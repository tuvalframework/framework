import React, { createElement, Fragment } from "../../../../preact/compat";
import PrimeReact from '../api/Api';

export class Portal extends React.Component {

    static defaultProps = {
        element: null,
        appendTo: null,
        visible: false,
        onMounted: null,
        onUnmounted: null
    };


    constructor(props) {
        super(props);

        this.state = {
            mounted: props.visible
        };
    }

    hasDOM() {
        return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
    }

    componentDidMount() {
        if (this.hasDOM() && !this.state.mounted) {
            this.setState({ mounted: true }, this.props.onMounted);
        }
    }

    componentWillUnmount() {
        this.props.onUnmounted && this.props.onUnmounted();
    }

    render() {
        if (this.props.element && this.state.mounted) {
            const appendTo = this.props.appendTo || PrimeReact.appendTo || document.body;
            return appendTo === 'self' ? this.props.element : React.createPortal(this.props.element, appendTo);
        }

        return null;
    }
}
