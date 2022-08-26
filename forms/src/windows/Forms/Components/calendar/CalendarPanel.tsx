import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";
import { CSSTransition } from '../csstransition/CSSTransition';
import { Portal } from '../portal/Portal';

class CalendarPanelComponent extends React.Component {

    static defaultProps = {
        appendTo: null,
        style: null,
        className: null
    };

    renderElement() {
        return (
            <CSSTransition nodeRef={this.props.forwardRef} classNames="p-connected-overlay" in={this.props.in} timeout={{ enter: 120, exit: 100 }} options={this.props.transitionOptions}
                unmountOnExit onEnter={this.props.onEnter} onEntered={this.props.onEntered} onExit={this.props.onExit} onExited={this.props.onExited}>
                <div ref={this.props.forwardRef} className={this.props.className} style={this.props.style} onClick={this.props.onClick}>
                    {this.props.children}
                </div>
            </CSSTransition>
        );
    }

    render() {
        let element = this.renderElement();

        return this.props.inline ? element : <Portal element={element} appendTo={this.props.appendTo} />;
    }

}

export const CalendarPanel = React.forwardRef((props, ref) => <CalendarPanelComponent forwardRef={ref} {...props} />);