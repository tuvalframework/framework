import { jss } from "../../../../../jss/jss";
import { Component, Fragment } from "../../../../../preact/compat";
import { Teact } from "../../Teact";
import { motion } from '../../../../../motion/render/dom/motion';
import { HtmlRenderer } from "../..";
import { createMotionProxy } from "../../../../../motion/render/dom/motion-proxy";
import { css } from '@emotion/css'

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
        const renderer: HtmlRenderer<any> = this.props.renderer;

        if (renderer.UseFrameStyles) {
            const className = `tuval-view`;
            const styles = {
                [className]: control => (
                    {
                        ...control.Appearance.GetStyleObject(),
                        '&:hover': {
                            ...control.HoverAppearance.GetStyleObject()
                        },
                        '&:active': {
                            ...control.ActiveAppearance.GetStyleObject()
                        },
                        '&:focus': {
                            ...control.FocusAppearance.GetStyleObject()
                        },
                        ...this.props.renderer.GetCustomJss(control)
                    }

                ),

            }

            //const jssStyle = jss.createStyleSheet(styles, { link: true }).attach();

            //this.jssStyle = jssStyle;
        }
        this.props.OnComponentWillMount();
    }
    componentDidMount() {
        this.props.OnComponentDidMount();
    }

    componentDidUpdate() {
        this.props.OnComponentDidUpdate();
    }


    componentWillUnmount() {


        const renderer: HtmlRenderer<any> = this.props.renderer;

        if (renderer.UseFrameStyles) {
            //this.jssStyle.detach();
            //jss.removeStyleSheet(this.jssStyle);
            this.props.OnComponentWillUnmount();
        }
    }



    render() {


        let className = ``;
        const renderer: HtmlRenderer<any> = this.props.renderer;

        if (renderer.UseFrameStyles) {
            className = `tuval-view`;
            //this.jssStyle.update(this.props.control);
            //className = this.jssStyle.classes[className];
        }

        const _className = css`
                            ${this.props.control.Appearance.ToString()}
                            ${this.props.control.HoverAppearance.IsEmpty ? '' :  '&:hover { ' +  this.props.control.HoverAppearance.ToString() + ' }'}
                            ${this.props.control.ActiveAppearance.IsEmpty ? '' :  '&:active { ' +  this.props.control.ActiveAppearance.ToString() + ' }'}
                            ${this.props.control.FocusAppearance.IsEmpty ? '' :  '&:focus { ' +  this.props.control.FocusAppearance.ToString() + ' }'}
                        `;

        if (renderer.UseFrameStyles) {

            if (this.props.renderAsAnimated) {
                return (
                    <motion.div view={this.props.control.constructor.name} className={_className} {...this.props.elementProps}>
                        {this.props.children}
                    </motion.div>
                );
            } else {
                return (
                    <div view={this.props.control.constructor.name} className={_className} {...this.props.elementProps}>
                        {this.props.children}
                    </div>
                );
            }
        } else {
            return (
                <Fragment>
                    {this.props.children}
                </Fragment>
            );
        }
    }
}