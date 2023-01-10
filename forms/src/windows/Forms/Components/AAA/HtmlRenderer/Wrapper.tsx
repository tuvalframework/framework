import { jss } from "../../../../../jss/jss";
import React, { Component, Fragment } from "../../../../../preact/compat";
import { Teact } from "../../Teact";
import { motion } from '../../../../../motion/render/dom/motion';
import { HtmlRenderer } from "../..";
import { createMotionProxy } from "../../../../../motion/render/dom/motion-proxy";
import { css } from '@emotion/css'
import { Tooltip } from "../../../../../UIKit/Components/tooltip/Tooltip";
import { classNames, is } from "@tuval/core";
import ObjectUtils from "../../../../../UIKit/Components/utils/ObjectUtils";


const TooltipWrapper: (props: any/* InputTextProps */) => any = React.memo(React.forwardRef((props: any, ref) => {
    const elementRef = React.useRef(ref);

    delete props.elementProps['ref'];
    return (
        <Fragment>
            <div ref={elementRef} view={props.control.constructor.name} className={props._className} {...props.elementProps} >
                {props.children}
            </div>
            <Tooltip target={elementRef} content={props.control.Tooltip} position={'top'}></Tooltip> 
        </Fragment>
    )
}))
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
                            ${this.props.control.HoverAppearance.IsEmpty ? '' : '&:hover { ' + this.props.control.HoverAppearance.ToString() + ' }'}
                            ${this.props.control.ActiveAppearance.IsEmpty ? '' : '&:active { ' + this.props.control.ActiveAppearance.ToString() + ' }'}
                            ${this.props.control.FocusAppearance.IsEmpty ? '' : '&:focus { ' + this.props.control.FocusAppearance.ToString() + ' }'}
                        `;

        if (renderer.UseFrameStyles) {

            if (this.props.renderAsAnimated) {
                return (
                    <motion.div view={this.props.control.constructor.name} className={_className} data-pr-tooltip={'sdfsdf'} {...this.props.elementProps}>
                        <Tooltip target={'.' + _className} mouseTrack mouseTrackLeft={10} />
                        {this.props.children}
                    </motion.div>
                );
            } else {
                return (
                    <TooltipWrapper {...this.props} _className={_className}></TooltipWrapper>
                    /*  <div view={this.props.control.constructor.name} className={_className} {...this.props.elementProps} >
                         <Tooltip target={'.tooltip-target'} content={this.props.control.Tooltip} />
                         {this.props.children}
                     </div> */
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