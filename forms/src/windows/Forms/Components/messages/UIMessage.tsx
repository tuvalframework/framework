import React, { createElement, Fragment, Portal } from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { Ripple } from '../ripple/Ripple';
import { Teact } from '../Teact';
import { classNames, TString } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';
import { CSSTransition } from '../csstransition/CSSTransition';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { TransitionGroup } from '../csstransition/TransitionGroup';

class UIMessageComponent extends React.Component {

    static defaultProps = {
        message: null,
        onClose: null,
        onClick: null
    }
    timeout: any;

    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        if (!this.props.message.sticky) {
            this.timeout = setTimeout(() => {
                this.onClose(null);
            }, this.props.message.life || 3000);
        }
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    onClose(event) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        if (this.props.onClose) {
            this.props.onClose(this.props.message);
        }

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.message);
        }
    }

    renderCloseIcon() {
        if (this.props.message.closable !== false) {
            return (
                <button type="button" className="p-message-close p-link" onClick={this.onClose}>
                    <i className="p-message-close-icon pi pi-times"></i>
                    <Ripple />
                </button>
            );
        }

        return null;
    }

    renderMessage() {
        if (this.props.message) {
            const { severity, content, summary, detail } = this.props.message;
            const icon = classNames('p-message-icon pi ', {
                'pi-info-circle': severity === 'info',
                'pi-check': severity === 'success',
                'pi-exclamation-triangle': severity === 'warn',
                'pi-times-circle': severity === 'error'
            } as any);

            return content || (
                <Fragment>
                    <span className={icon}></span>
                    <span className="p-message-summary">{summary}</span>
                    <span className="p-message-detail">{detail}</span>
                </Fragment>
            );
        }

        return null;
    }

    render() {
        const severity = this.props.message.severity;
        let className = 'p-message p-component p-message-' + severity;
        let closeIcon = this.renderCloseIcon();
        let message = this.renderMessage();

        return (
            <div ref={this.props.forwardRef} className={className} onClick={this.onClick}>
                <div className="p-message-wrapper">
                    {message}
                    {closeIcon}
                </div>
            </div>
        );
    }
}

export const UIMessage = React.forwardRef((props, ref) => <UIMessageComponent forwardRef={ref} {...props} />);