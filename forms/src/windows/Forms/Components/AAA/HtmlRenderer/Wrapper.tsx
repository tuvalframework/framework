import { jss } from "../../../../../jss/jss";
import { Component, Fragment } from "../../../../../preact/compat";
import { Teact } from "../../Teact";

export class Wrapper extends Component {

    get jssStyle(): any {
        return this.state.jssStyle;
    }

    set jssStyle(value: any) {
        this.setState({
            'jssStyle': value
        });
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        const className = `tuval-view`;
        const styles = {
            [className]: control => ({
                ...control.Appearance.GetStyleObject(),
                '&:hover': control => ({
                    ...control.HoverAppearance.GetStyleObject()
                }),
                '&:active': control => ({
                    ...control.ActiveAppearance.GetStyleObject()
                }),
                '&:focus': control => ({
                    ...control.FocusAppearance.GetStyleObject()
                })
            }),

        }

        const jssStyle = jss.createStyleSheet(styles, { link: true } ).attach();
      //  this.props.elementProps['className'] = jssStyle.classes[className];
        this.jssStyle = jssStyle;
        this.props.OnComponentWillMount();
    }
    componentDidMount() {
        this.props.OnComponentDidMount();
    }

    componentWillUnmount() {
        this.jssStyle.detach();
        jss.removeStyleSheet(this.jssStyle);
        this.props.OnComponentWillUnmount();
    }



    render() {
        const className = `tuval-view`;
        this.jssStyle.update(this.props.control);
        return (
            <div view={this.props.control.constructor.name} className={this.jssStyle.classes[className]} {...this.props.elementProps}>
                {this.props.children}
            </div>
        );
    }
}