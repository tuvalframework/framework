import { Component } from '../component';
import { shallowDiffers } from './util';

/**
 * Component class with a predefined `shouldComponentUpdate` implementation
 */
export class PureComponent extends Component{
    props: any;
    // Some third-party libraries check if this property is present
    isPureReactComponent: boolean = true;
    public constructor(p) {
        super(p);
        this.props = p;
    }
    public shouldComponentUpdate(props, state) {
        return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    }
}