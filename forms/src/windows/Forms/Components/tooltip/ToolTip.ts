import { DomHandler } from "../DomHandler";
import { TooltipOptions } from "./ToolTipOptions";

import React, { createElement } from '../../../../preact/compat';
import { cloneElement } from "../../../../preact";

const css = require('./Tooltip.css');

DomHandler.addCssToDocument(css);

export function tip(props) {
    let appendTo = props.appendTo || document.body;

    let tooltipWrapper = document.createDocumentFragment();
    DomHandler.appendChild(tooltipWrapper, appendTo);

    props = {...props, ...props.options};

     let tooltipEl = React.createElement(Tooltip, props);
    React.render(tooltipEl, tooltipWrapper);

    let updateTooltip = (newProps) => {
        props = { ...props, ...newProps };
        React.render(cloneElement(tooltipEl, props), tooltipWrapper);
    };

    return {
        destroy: () => {
            React.unmountComponentAtNode(tooltipWrapper);
        },
        updateContent: (newContent) => {
            console.warn("The 'updateContent' method has been deprecated on Tooltip. Use update(newProps) method.");
            updateTooltip({ content: newContent });
        },
        update: (newProps) => {
            updateTooltip(newProps);
        }
    }
}

interface TooltipProps {
    target: HTMLElement,
    content: string,
    options:TooltipOptions
}


export class Tooltip  {

    private target: HTMLElement;
    private content: string;
    private options:TooltipOptions;
    private mouseEnterListener: Function = null as any;
    private mouseLeaveListener: Function = null as any;
    private clickListener: Function = null as any;
    private focusListener: Function = null as any;
    private blurListener: Function = null as any;
    private resizeListener: Function = null as any;
    private showTimeout: any;
    private hideTimeout: any;
    private container: HTMLElement = null as any;
    private tooltipText: HTMLElement = null as any;
    private tooltipStyleClass: string =  '';

    constructor(props:TooltipProps) {
        this.target = props.target;
        this.content = props.content;
        this.options = props.options || {};
        this.options.event = this.options.event || 'hover';
        this.options.position = this.options.position || 'right';

        this.bindEvents();
    }

    bindEvents() {
        if (this.options.event === 'hover') {
            this.mouseEnterListener = this.onMouseEnter.bind(this);
            this.mouseLeaveListener = this.onMouseLeave.bind(this);
            this.clickListener = this.onClick.bind(this);
            this.target.addEventListener('mouseenter', <any>this.mouseEnterListener);
            this.target.addEventListener('mouseleave', <any>this.mouseLeaveListener);
            this.target.addEventListener('click', <any>this.clickListener);
        }
        else if (this.options.event === 'focus') {
            this.focusListener = this.onFocus.bind(this);
            this.blurListener = this.onBlur.bind(this);
            this.target.addEventListener('focus', <any>this.focusListener);
            this.target.addEventListener('blur', <any>this.blurListener);
        }
    }

    unbindEvents() {
        if (this.options.event === 'hover') {
            this.target.removeEventListener('mouseenter', <any>this.mouseEnterListener);
            this.target.removeEventListener('mouseleave', <any>this.mouseLeaveListener);
            this.target.removeEventListener('click', <any>this.clickListener);
        }
        else if (this.options.event === 'focus') {
            this.target.removeEventListener('focus',<any>this.focusListener);
            this.target.removeEventListener('blur', <any>this.blurListener);
        }

        this.unbindDocumentResizeListener();
    }

    onMouseEnter() {
        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }

    onMouseLeave() {
        this.deactivate();
    }

    onFocus() {
        this.activate();
    }

    onBlur() {
        this.deactivate();
    }

    onClick() {
        this.deactivate();
    }

    activate() {
        this.clearHideTimeout();

        if (this.options.showDelay)
            this.showTimeout = setTimeout(() => { this.show() }, this.options.showDelay);
        else
            this.show();
    }

    deactivate() {
        this.clearShowTimeout();

        if (this.options.hideDelay)
            this.hideTimeout = setTimeout(() => { this.hide() }, this.options.hideDelay);
        else
            this.hide();
    }

    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }

    updateContent(content) {
        this.content = content;
    }

    show() {
        if (!this.content) {
            return;
        }

        this.create();
        this.align();
        DomHandler.fadeIn(this.container, 250);
        this.container.style.zIndex = <any>(++(<any>DomHandler).zindex);

        this.bindDocumentResizeListener();
    }

    hide() {
        this.remove();
    }

    create() {
        this.container = document.createElement('div');

        let tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'p-tooltip-arrow';
        this.container.appendChild(tooltipArrow);

        this.tooltipText = document.createElement('div');
        this.tooltipText.className = 'p-tooltip-text';

        //todo: JSX support
        this.tooltipText.innerHTML = this.content;

        this.container.appendChild(this.tooltipText);
        document.body.appendChild(this.container);

        this.container.style.display = 'inline-block';
    }

    remove() {
        if (this.container && this.container.parentElement) {
            document.body.removeChild(this.container);
        }

        this.unbindDocumentResizeListener();
        this.clearTimeouts();
        this.container = null as any;
    }

    align() {
        switch (this.options.position) {
            case 'top':
                this.alignTop();
                if (this.isOutOfBounds()) {
                    this.alignBottom();
                }
                break;

            case 'bottom':
                this.alignBottom();
                if (this.isOutOfBounds()) {
                    this.alignTop();
                }
                break;

            case 'left':
                this.alignLeft();
                if (this.isOutOfBounds()) {
                    this.alignRight();

                    if (this.isOutOfBounds()) {
                        this.alignTop();

                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;

            case 'right':
                this.alignRight();
                if (this.isOutOfBounds()) {
                    this.alignLeft();

                    if (this.isOutOfBounds()) {
                        this.alignTop();

                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;

            default:
                throw new Error('Invalid position:' + this.options.position);
        }
    }

    getHostOffset() {
        let offset = this.target.getBoundingClientRect();
        let targetLeft = offset.left + DomHandler.getWindowScrollLeft();
        let targetTop = offset.top + DomHandler.getWindowScrollTop();

        return { left: targetLeft, top: targetTop };
    }

    alignRight() {
        this.preAlign('right');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + DomHandler.getOuterWidth(this.target);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.target) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignLeft() {
        this.preAlign('left');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left - DomHandler.getOuterWidth(this.container);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.target) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignTop() {
        this.preAlign('top');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.target) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top - DomHandler.getOuterHeight(this.container);
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    alignBottom() {
        this.preAlign('bottom');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.target) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top + DomHandler.getOuterHeight(this.target);
        this.container.style.left = left + 'px';
        this.container.style.top = top + 'px';
    }

    preAlign(position) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';

        let defaultClassName = 'p-tooltip p-component p-tooltip-' + position;
        this.container.className = this.tooltipStyleClass ? defaultClassName + ' ' + this.tooltipStyleClass : defaultClassName;
    }

    isOutOfBounds() {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = DomHandler.getOuterWidth(this.container);
        let height = DomHandler.getOuterHeight(this.container);
        let viewport = DomHandler.getViewport();

        return (targetLeft + width > viewport.width) || (targetLeft < 0) || (targetTop < 0) || (targetTop + height > viewport.height);
    }

    bindDocumentResizeListener() {
        this.resizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', <any>this.resizeListener);
    }

    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', <any>this.resizeListener);
            this.resizeListener = null as any;
        }
    }

    onWindowResize() {
        this.hide();
    }

    destroy() {
        this.unbindEvents();
        this.remove();
        this.target = null as any;
    }
 }