import React from "../../../../preact/compat";
import { DomHandler } from "../DomHandler";
import { Teact } from '../Teact';

const constructableStylesheetsSupported = window
    && window.ShadowRoot
    && window.ShadowRoot.prototype.hasOwnProperty('adoptedStyleSheets')
    && window.CSSStyleSheet
    && window.CSSStyleSheet.prototype.hasOwnProperty('replace');

const shadowRootSupported = window
    && window.Element
    && window.Element.prototype.hasOwnProperty('attachShadow');

export class ShadowRoot extends React.PureComponent {
    static constructableStylesheetsSupported = constructableStylesheetsSupported;
    static constructibleStylesheetsSupported = constructableStylesheetsSupported;
    static defaultProps = {
        delegatesFocus: false,
        mode: 'open'
    };
    static displayName = 'ReactShadowRoot';
    /* static propTypes = {
      delegatesFocus: PropTypes.bool,
      mode: PropTypes.oneOf(['open', 'closed']),
      stylesheets: PropTypes.arrayOf(PropTypes.instanceOf(window.CSSStyleSheet))
    }; */
    static shadowRootSupported = shadowRootSupported;

    state = { initialized: false };
    placeholder: any;
    shadowRoot: any;

    /**
     * @param {object} props Properties passed to the component
     * @param {boolean} props.delegatesFocus  Expands the focus behavior of elements within the shadow DOM.
     * @param {string} props.mode Sets the mode of the shadow root. (open or closed)
     * @param {CSSStyleSheet[]} props.stylesheets Takes an array of CSSStyleSheet objects for constructable stylesheets.
     */
    constructor(props) {
        super(props);
        this.placeholder = React.createRef();
    }

    componentDidMount() {
        const {
            delegatesFocus,
            mode,
            stylesheets
        } = this.props;

        this.shadowRoot = this.placeholder.current.parentNode.attachShadow({
            delegatesFocus,
            mode
        });

        if (stylesheets) {
            this.shadowRoot.adoptedStyleSheets = stylesheets;
        }

        this.setState({
            initialized: true
        });

        if (this.props.componentDidMount != null) {
            this.props.componentDidMount(this.shadowRoot);
        }


    }

    componentWillMount() {
        if (this.props.componentWillMount != null) {
            this.props.componentWillMount(this.shadowRoot);
        }
    }

    componentWillUnmount() {
        if (this.props.componentWillUnmount != null) {
            this.props.componentWillUnmount(this.shadowRoot);
        }
    }

    render() {
        if (!this.state.initialized) {
            return <span ref={this.placeholder}></span>;
        }

        return React.createPortal(this.props.children, this.shadowRoot);
    }
}