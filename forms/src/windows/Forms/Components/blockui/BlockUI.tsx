import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { DomHandler } from '../DomHandler';
import { ObjectUtils } from '../ObjectUtils';
import { Portal } from '../portal/Portal';
import { Teact } from "../Teact";
import { ZIndexUtils } from '../utils/ZIndexUtils';

DomHandler.addCssToDocument(require('./BlockUI.css'));
export class BlockUI extends React.Component {

    static defaultProps = {
        id: null,
        blocked: false,
        fullScreen: false,
        baseZIndex: 0,
        autoZIndex: true,
        style: null,
        className: null,
        template: null,
        onBlocked: null,
        onUnblocked: null
    };
    mask: any;
    container: any;

    constructor(props) {
        super(props);

        this.state = {
            visible: props.blocked
        };

        this.block = this.block.bind(this);
        this.unblock = this.unblock.bind(this);
        this.onPortalMounted = this.onPortalMounted.bind(this);
    }

    block() {
        this.setState({ visible: true });
    }

    unblock() {
        DomHandler.addClass(this.mask, 'p-blockui-leave');
        this.mask.addEventListener('transitionend', () => {
            ZIndexUtils.clear(this.mask);
            this.setState({ visible: false }, () => {
                this.props.fullScreen && DomHandler.removeClass(document.body, 'p-overflow-hidden');
                this.props.onUnblocked && this.props.onUnblocked();
            });
        });
    }

    onPortalMounted() {
        if (this.props.fullScreen) {
            DomHandler.addClass(document.body, 'p-overflow-hidden');
            (document as any).activeElement.blur();
        }

        if (this.mask) {
            setTimeout(() => {
                DomHandler.addClass(this.mask, 'p-component-overlay');
            }, 1);
        }

        if (this.props.autoZIndex) {
            ZIndexUtils.set(this.props.fullScreen ? 'modal' : 'overlay', this.mask, this.props.baseZIndex);
        }

        this.props.onBlocked && this.props.onBlocked();
    }

    renderMask() {
        if (this.state.visible) {
            const className = classNames('p-blockui', {
                'p-blockui-document': this.props.fullScreen
            } as any, this.props.className);
            const content = this.props.template ? ObjectUtils.getJSXElement(this.props.template, this.props) : null;
            const mask = (
                <div ref={(el) => this.mask = el} className={className} style={this.props.style}>
                    {content}
                </div>
            );

            return (
                <Portal element={mask} appendTo={this.props.fullScreen ? document.body : 'self'} onMounted={this.onPortalMounted} />
            );
        }

        return null;
    }

    componentDidMount() {
        if (this.state.visible) {
            this.block();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.blocked !== this.props.blocked) {
            this.props.blocked ? this.block() : this.unblock();
        }
    }

    componentWillUnmount() {
        if (this.props.fullScreen) {
            DomHandler.removeClass(document.body, 'p-overflow-hidden');
        }

        ZIndexUtils.clear(this.mask);
    }

    render() {
        const mask = this.renderMask();

        return (
            <div ref={(el) => this.container = el} id={this.props.id} className="p-blockui-container">
                {this.props.children}
                {mask}
            </div>
        );
    }
}