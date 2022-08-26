import React, { createElement, Fragment } from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { Ripple } from '../ripple/Ripple';
import { Teact } from '../Teact';
import { classNames, TString, int } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';
import { CSSTransition } from '../csstransition/CSSTransition';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ResizeSensor } from '../../../../ResizeSensor';
import { Portal } from '../portal/Portal';

/**
 * p-dialog-header a ondblclick eklendi, çift tıklama ile maximize oluyor.
 */
const css = require('./Form.css');
DomHandler.addCssToDocument(css);

DomHandler.addCssToDocument(require('./FormCustom.css'));

export class Dialog extends React.Component {

    static defaultProps = {
        id: null,
        header: null,
        footer: null,
        visible: false,
        position: 'center',
        draggable: true,
        resizable: true,
        modal: true,
        isActive: true, // eklendi
        onHide: null,
        onShow: null,
        contentStyle: null,
        contentClassName: null,
        closeOnEscape: true,
        dismissableMask: false,
        rtl: false,
        closable: true,
        style: null,
        maskStyle: null, // eklendi
        className: null,
        maskClassName: null,
        showHeader: true,
        headerColor: null,
        headerPadding: null,
        headerSubStyle: null,
        headerHeight: null,
        headerTitleColor: null,
        headerTitleAlign: null,
        headerTitleFontSize: null,
        contentPadding: null,
        appendTo: null,
        baseZIndex: 0,
        maximizable: false,
        topMaximizable: false,
        blockScroll: false,
        icons: null,
        ariaCloseIconLabel: 'Close',
        focusOnShow: true,
        minX: 0,
        minY: 0,
        keepInViewport: false,
        maximized: false,
        topMaximized: false,
        breakpoints: null,
        onMaximize: null,
        onTopMaximize: null,
        onDragStart: null,
        onDrag: null,
        onDragEnd: null,
        onResizeStart: null,
        onResize: null,
        onResizeEnd: null,
        onContentResize: null,
        onClick: null //eklendi.
    }
    id: any;
    attributeSelector: string;
    dialogRef: any;
    mask: any;
    dragging: boolean = false;
    lastPageX: any;
    lastPageY: any;
    resizing: boolean = false;
    documentDragListener: any;
    documentDragEndListener: any;
    documentResizeListener: any;
    documentResizeEndListener: any;
    documentKeyDownListener: any;
    styleElement: any;
    closeElement: any;
    headerEl: any;
    headerSubEl: any;
    footerElement: any;
    contentEl: HTMLElement = null as any;

    constructor(props) {
        super(props);
        this.state = {
            maskVisible: props.visible,
            visible: false
        };

        if (!this.props.onMaximize) {
            this.state.maximized = props.maximized;
        }

        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
        this.toggleTopMaximize = this.toggleTopMaximize.bind(this);
        this.toggleMaximize = this.toggleMaximize.bind(this);
        this.toggleMinimize = this.toggleMinimize.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onResizeStart = this.onResizeStart.bind(this);
        this.onMaskClick = this.onMaskClick.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.onEntered = this.onEntered.bind(this);
        this.onExited = this.onExited.bind(this);

        this.id = this.props.id || UniqueComponentId();
        this.attributeSelector = UniqueComponentId();
        this.dialogRef = React.createRef();
    }

    onClick(event) {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
    onClose(event) {
        this.props.onHide();
        event.preventDefault();
    }

    focus() {
        let activeElement = document.activeElement;
        let isActiveElementInDialog = activeElement && this.dialogRef && this.dialogRef.current.contains(activeElement);
        if (!isActiveElementInDialog && this.props.closable && this.props.showHeader) {
            this.closeElement.focus();
        }
    }

    onMaskClick(event) {
        if (this.props.dismissableMask && this.props.modal && this.mask === event.target) {
            this.onClose(event);
        }
    }

    private lastWidth: int = 0;
    private lastHeight: int = 0;

    toggleTopMaximize(event) {
        this.toggleMaximize(event);
        if (this.props.topMaximizable === false) { // eklendi.
            return;
        }
        let topMaximized = !this.topMaximized;


        if (this.props.onTopMaximize) {
            this.props.onTopMaximize({
                originalEvent: event,
                topMaximized
            });
        }
        else {
            this.setState({
                topMaximized
            }, this.changeScrollOnMaximizable);
        }

        if (event != null) {
            event.preventDefault();
        }
    }

    toggleMaximize(event) {
        if (this.props.maximizable === false) { // eklendi.
            return;
        }
        let maximized = !this.maximized;


        if (this.props.onMaximize) {
            this.props.onMaximize({
                originalEvent: event,
                maximized
            });
        }
        else {
            this.setState({
                maximized
            }, this.changeScrollOnMaximizable);
        }
        if (event != null) {
            event.preventDefault();
        }
    }

    toggleMinimize(event) {
        if (this.props.minimizable === false) { // eklendi.
            return;
        }
        let minimized = !this.minimized;

        if (this.props.onMinimize) {
            this.props.onMinimize({
                originalEvent: event,
                minimized
            });
        }
        else {
            this.setState({
                minimized
            }, this.changeScrollOnMaximizable);

            /*  if (maximized) {
                 if (this.props.onResizeEnd) { // eklendi.


                     var body = document.body,
                         html = document.documentElement;

                     var height = Math.max(body.scrollHeight, body.offsetHeight,
                         html.clientHeight, html.scrollHeight, html.offsetHeight);
                         console.log(height);
                     this.props.onResizeEnd({}, parseFloat(DomHandler.getOuterWidth(document)), height - 140, parseFloat(this.contentEl.style.width), parseFloat(this.contentEl.style.height)); // eklendi.
                 }
             } */

        }

        event.preventDefault();
    }

    onDragStart(event) {
        if (DomHandler.hasClass(event.target, 'p-dialog-header-icon') || DomHandler.hasClass(event.target.parentElement, 'p-dialog-header-icon')) {
            return;
        }

        if (this.props.draggable) {
            this.dragging = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            this.dialogEl.style.margin = '0';

            DomHandler.addClass(document.body, 'p-unselectable-text');

            if (this.props.onDragStart) {
                this.props.onDragStart(event);
            }
        }
    }

    onDrag(event) {
        if (this.dragging) {
            let width = DomHandler.getOuterWidth(this.dialogEl);
            let height = DomHandler.getOuterHeight(this.dialogEl);
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let offset = DomHandler.getOffset(this.dialogEl);
            let leftPos = offset.left - DomHandler.getWindowScrollLeft() + deltaX;
            let topPos = offset.top - DomHandler.getWindowScrollTop() + deltaY;
            let viewport = DomHandler.getViewport();

            this.dialogEl.style.position = 'fixed';
            this.dialogEl.style.opacity = '0.5'; // eklendi.
            this.contentEl.style.display = 'none';
            if (this.headerSubEl != null && this.headerSubEl.style != null) {
                this.headerSubEl.style.opacity = '0';
            }

            if (this.props.keepInViewport) {
                if (leftPos >= this.props.minX && (leftPos + width) < viewport.width) {
                    this.lastPageX = event.pageX;
                    this.dialogEl.style.left = leftPos + 'px';
                }

                if (topPos >= this.props.minY && (topPos + height) < viewport.height) {
                    this.lastPageY = event.pageY;
                    this.dialogEl.style.top = topPos + 'px';
                }
            }
            else {
                this.lastPageX = event.pageX;
                this.dialogEl.style.left = leftPos + 'px';
                this.lastPageY = event.pageY;
                this.dialogEl.style.top = topPos + 'px';
            }

            if (this.props.onDrag) {
                this.props.onDrag(event);
            }
        }
    }

    onDragEnd(event) {
        if (this.dragging) {
            this.dragging = false;
            DomHandler.removeClass(document.body, 'p-unselectable-text');
            this.dialogEl.style.opacity = '1'; // eklendi.
            this.contentEl.style.display = 'block'; // eklendi.
            this.headerSubEl.style.opacity = '1'; // eklendi.
            if (this.props.onDragEnd) {
                this.props.onDragEnd(event);
            }
        }
    }

    onResizeStart(event) {
        if (this.props.resizable) {
            this.resizing = true;
            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;
            DomHandler.addClass(document.body, 'p-unselectable-text');

            if (this.props.onResizeStart) {
                this.props.onResizeStart(event);
            }
        }
    }

    onResize(event) {
        if (this.resizing) {
            let deltaX = event.pageX - this.lastPageX;
            let deltaY = event.pageY - this.lastPageY;
            let width = DomHandler.getOuterWidth(this.dialogEl);
            let height = DomHandler.getOuterHeight(this.dialogEl);
            let contentWidth = DomHandler.getOuterWidth(this.contentEl); // eklendi.
            let contentHeight = DomHandler.getOuterHeight(this.contentEl);
            let newWidth = width + deltaX;
            let newHeight = height + deltaY;
            let minWidth = this.dialogEl.style.minWidth;
            let minHeight = this.dialogEl.style.minHeight;
            let offset = DomHandler.getOffset(this.dialogEl);
            let viewport = DomHandler.getViewport();
            let hasBeenDragged = !parseInt(this.dialogEl.style.top) || !parseInt(this.dialogEl.style.left);

            if (hasBeenDragged) {
                newWidth += deltaX;
                newHeight += deltaY;
            }

            if ((!minWidth || newWidth > parseInt(minWidth)) && (offset.left + newWidth) < viewport.width) {
                this.dialogEl.style.width = newWidth + 'px';
            }

            if ((!minHeight || newHeight > parseInt(minHeight)) && (offset.top + newHeight) < viewport.height) {
                (this.contentEl as any).style.height = contentHeight + newHeight - height + 'px';
                this.dialogEl.style.height = newHeight + 'px';
            }

            this.lastPageX = event.pageX;
            this.lastPageY = event.pageY;

            if (this.props.onResize) {
                this.props.onResize(event, parseFloat(this.dialogEl.style.width), parseFloat(this.dialogEl.style.height), parseFloat(this.contentEl.style.width), parseFloat(this.contentEl.style.height)); // eklendi.
            }
        }
    }
    onResizeEnd(event) {
        if (this.resizing) {
            this.resizing = false;
            DomHandler.removeClass(document.body, 'p-unselectable-text');

            if (this.props.onResizeEnd) {
                //this.props.onResizeEnd(event);
                this.props.onResizeEnd(event, parseFloat(this.dialogEl.style.width), parseFloat(this.dialogEl.style.height), parseFloat(this.contentEl.style.width), parseFloat(this.contentEl.style.height)); // eklendi.
            }
        }
    }

    resetPosition() {
        this.dialogEl.style.position = '';
        this.dialogEl.style.left = '';
        this.dialogEl.style.top = '';
        this.dialogEl.style.margin = '';
    }

    getPositionClass() {
        const positions = ['center', 'left', 'right', 'top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'];
        const pos = positions.find(item => item === this.props.position || item.replace('-', '') === this.props.position);

        return pos ? `p-dialog-${pos}` : '';
    }

    get zIndex() {
        return this.props.baseZIndex + DomHandler.generateZIndex();
    }

    get topMaximized() {
        return this.props.onTopMaximize ? this.props.topMaximized : this.state.topMaximized;
    }

    get maximized() {
        return this.props.onMaximize ? this.props.maximized : this.state.maximized;
    }
    get minimized() {
        return this.props.onMinimize ? this.props.minimized : this.state.minimized;
    }

    get dialogEl() {
        return this.dialogRef.current;
    }

    onEnter() {
        this.dialogEl.setAttribute(this.attributeSelector, '');
    }

    onEntered() {
        if (this.props.onShow) {
            this.props.onShow();
        }

        if (this.props.focusOnShow) {
            this.focus();
        }

        this.enableDocumentSettings();
    }

    onExited() {
        this.dragging = false;
        this.setState({ maskVisible: false }, () => {
            DomHandler.revertZIndex();
        });
        this.disableDocumentSettings();
    }

    enableDocumentSettings() {
        this.bindGlobalListeners();

        if (this.props.blockScroll || (this.props.maximizable && this.maximized)) {
            DomHandler.addClass(document.body, 'p-overflow-hidden');
        }
    }

    disableDocumentSettings() {
        this.unbindGlobalListeners();

        if (this.props.modal) {
            let hasBlockScroll = (document as any).tuvalDialogParams && (document as any).tuvalDialogParams.some(param => param.hasBlockScroll);
            if (!hasBlockScroll) {
                DomHandler.removeClass(document.body, 'p-overflow-hidden');
            }
        }
        else if (this.props.blockScroll || (this.props.maximizable && this.maximized)) {
            DomHandler.removeClass(document.body, 'p-overflow-hidden');
        }
    }

    bindGlobalListeners() {
        if (this.props.draggable) {
            this.bindDocumentDragListener();
        }

        if (this.props.resizable) {
            this.bindDocumentResizeListeners();
        }

        if (this.props.closeOnEscape && this.props.closable) {
            this.bindDocumentKeyDownListener();
        }
    }

    unbindGlobalListeners() {
        this.unbindDocumentDragListener();
        this.unbindDocumentResizeListeners();
        this.unbindDocumentKeyDownListener();
    }

    bindDocumentDragListener() {
        this.documentDragListener = this.onDrag.bind(this);
        this.documentDragEndListener = this.onDragEnd.bind(this);
        window.document.addEventListener('mousemove', this.documentDragListener);
        window.document.addEventListener('mouseup', this.documentDragEndListener);
    }

    unbindDocumentDragListener() {
        if (this.documentDragListener && this.documentDragEndListener) {
            window.document.removeEventListener('mousemove', this.documentDragListener);
            window.document.removeEventListener('mouseup', this.documentDragEndListener);
            this.documentDragListener = null as any;
            this.documentDragEndListener = null as any;
        }
    }

    bindDocumentResizeListeners() {
        this.documentResizeListener = this.onResize.bind(this);
        this.documentResizeEndListener = this.onResizeEnd.bind(this);
        window.document.addEventListener('mousemove', this.documentResizeListener);
        window.document.addEventListener('mouseup', this.documentResizeEndListener);
    }

    unbindDocumentResizeListeners() {
        if (this.documentResizeListener && this.documentResizeEndListener) {
            window.document.removeEventListener('mousemove', this.documentResizeListener);
            window.document.removeEventListener('mouseup', this.documentResizeEndListener);
            this.documentResizeListener = null as any;
            this.documentResizeEndListener = null as any;
        }
    }

    bindDocumentKeyDownListener() {
        this.documentKeyDownListener = (event) => {
            let currentTarget = event.currentTarget;

            if (currentTarget && currentTarget.tuvalDialogParams) {
                let params = currentTarget.tuvalDialogParams;
                let paramLength = params.length;
                let dialogId = params[paramLength - 1].id;

                if (dialogId === this.id) {
                    let dialog = document.getElementById(dialogId);

                    if (event.which === 27) {
                        this.onClose(event);
                        event.stopImmediatePropagation();

                        params.splice(paramLength - 1, 1);
                    }
                    else if (event.which === 9) {
                        event.preventDefault();
                        let focusableElements = DomHandler.getFocusableElements(dialog);
                        if (focusableElements && focusableElements.length > 0) {
                            if (!document.activeElement) {
                                focusableElements[0].focus();
                            }
                            else {
                                let focusedIndex = focusableElements.indexOf(document.activeElement);
                                if (event.shiftKey) {
                                    if (focusedIndex === -1 || focusedIndex === 0)
                                        focusableElements[focusableElements.length - 1].focus();
                                    else
                                        focusableElements[focusedIndex - 1].focus();
                                }
                                else {
                                    if (focusedIndex === -1 || focusedIndex === (focusableElements.length - 1))
                                        focusableElements[0].focus();
                                    else
                                        focusableElements[focusedIndex + 1].focus();
                                }
                            }
                        }
                    }
                }
            }
        };

        let newParam = { id: this.id, hasBlockScroll: this.props.blockScroll };
        (document as any).tuvalDialogParams = (document as any).tuvalDialogParams ? [...(document as any).tuvalDialogParams, newParam] : [newParam];

        document.addEventListener('keydown', this.documentKeyDownListener);
    }

    unbindDocumentKeyDownListener() {
        if (this.documentKeyDownListener) {
            document.removeEventListener('keydown', this.documentKeyDownListener);
            (document as any).tuvalDialogParams = (document as any).tuvalDialogParams && (document as any).tuvalDialogParams.filter(param => param.id !== this.id);
            this.documentKeyDownListener = null as any;
        }
    }

    createStyle() {
        if (!this.styleElement) {
            this.styleElement = document.createElement('style');
            document.head.appendChild(this.styleElement);

            let innerHTML = '';
            for (let breakpoint in this.props.breakpoints) {
                innerHTML += `
                    @media screen and (max-width: ${breakpoint}) {
                        .p-dialog[${this.attributeSelector}] {
                            width: ${this.props.breakpoints[breakpoint]} !important;
                        }
                    }
                `
            }

            this.styleElement.innerHTML = innerHTML;
        }
    }

    componentDidMount() {
        if (this.props.visible) {
            this.setState({ visible: true }, () => {
                this.mask.style.zIndex = String(this.zIndex);
            });
        }

        if (this.props.breakpoints) {
            this.createStyle();
        }
    }


    componentDidUpdate(prevProps) {
        if (this.props.visible && !this.state.maskVisible) {
            this.setState({ maskVisible: true }, () => {
                this.mask.style.zIndex = String(this.zIndex);
            });
        }

        if (this.props.visible !== this.state.visible && this.state.maskVisible) {
            this.setState({
                visible: this.props.visible
            });
        }

        if (prevProps.maximized !== this.props.maximized && this.props.onMaximize) {
            this.changeScrollOnMaximizable();
        }
    }

    changeScrollOnMaximizable() {
        if (!this.props.blockScroll) {
            let funcName = this.maximized ? 'addClass' : 'removeClass';
            DomHandler[funcName](document.body, 'p-overflow-hidden');
        }
    }

    componentWillUnmount() {
        this.disableDocumentSettings();

        if (this.styleElement) {
            document.head.removeChild(this.styleElement);
            this.styleElement = null;
        }

        DomHandler.revertZIndex();
    }

    renderCloseIcon() {
        if (this.props.closable) {
            return (
                <button ref={(el) => this.closeElement = el} type="button" className="p-dialog-header-icon p-dialog-header-close p-link" aria-label={this.props.ariaCloseIconLabel} onClick={this.onClose}>
                    <span className="p-dialog-header-close-icon pi pi-times"></span>
                    <Ripple />
                </button>
            );
        }

        return null;
    }

    renderTopMaximizeIcon() {
        //const iconClassName = classNames('p-dialog-header-top-maximize-icon pi', { 'pi-window-maximize': !this.topMaximized, 'pi-window-minimize': this.topMaximized } as any);
        const maximizeClassName = classNames({ 'x-tool-top-maximize': !this.topMaximized, 'x-tool-top-restore': this.topMaximized } as any);
        if (this.props.maximizable) {
            return (
                <div className={maximizeClassName} onClick={this.toggleTopMaximize}></div>
            );
        }

        return null;
    }

    renderMaximizeIcon() {
        const iconClassName = classNames('p-dialog-header-maximize-icon pi', { 'pi-window-maximize': !this.maximized, 'pi-window-minimize': this.maximized } as any);
        const maximizeClassName = classNames({ 'x-tool-maximize': !this.maximized, 'x-tool-restore': this.maximized } as any);
        if (this.props.maximizable) {
            return (
                <div className={maximizeClassName} onClick={this.toggleMaximize}></div>
            );
        }

        return null;
    }

    renderMinimizeIcon() {
        if (this.props.minimizable) {
            return (
                <div className='x-tool-minimize' onClick={this.toggleMinimize}></div>
            );
        }

        return null;
    }

    renderHeader() {
        if (this.props.showHeader) {
            const closeIcon = this.renderCloseIcon();
            const topMaximizeIcon = this.renderTopMaximizeIcon();
            const maximizeIcon = this.renderMaximizeIcon();
            const minimizeIcon = this.renderMinimizeIcon();
            const icons = ObjectUtils.getJSXElement(this.props.icons, this.props);
            const header = ObjectUtils.getJSXElement(this.props.header, this.props);

            const titleIconStyle = {};
            titleIconStyle['marginRight'] = '10px';
            if (this.props.titleIcon) {
                titleIconStyle['backgroundImage'] = TString.Format("url('{0}')", this.props.titleIcon);
            }

            const headerStyle = {};
            if (this.props.headerColor != null) {
                headerStyle['borderTop'] = '0px';
                headerStyle['backgroundImage'] = "url('')";
                headerStyle['backgroundColor'] = this.props.headerColor;
            }
            if (this.props.headerPadding != null) {
                headerStyle['padding'] = this.props.headerPadding;
            }

            if (this.props.headerHeight != null) {
                headerStyle['height'] = this.props.headerHeight;
            }

            const headerTitleStyle = {};
            if (this.props.headerTitleColor != null) {
                headerTitleStyle['color'] = this.props.headerTitleColor;
            }
            if (this.props.headerTitleAlign != null) {
                headerTitleStyle['textAlign'] = this.props.headerTitleAlign;
            }
            if (this.props.headerTitleFontSize != null) {
                headerTitleStyle['fontSize'] = this.props.headerTitleFontSize;
            }


            //eklendi
            const headerClassName = classNames('p-dialog-header', { 'deactive': !this.props.isActive } as any);
            return (
                <div ref={el => this.headerEl = el} className={headerClassName} style={headerStyle} onMouseDown={this.onDragStart} ondblclick={this.toggleMaximize}>
                    <div ref={el => this.headerSubEl = el} style={this.props.headerSubStyle}>
                        <span id={this.id + '_header_icon'} className="p-dialog-title-icon" style={titleIconStyle}></span>
                        <span id={this.id + '_header'} className="p-dialog-title" style={headerTitleStyle}>{header}</span>
                    </div>
                    <div style="display:flex;flex-grow: 1"></div>
                    <div className="p-dialog-header-icons">
                        {/* {icons} */}
                        {minimizeIcon}
                        {maximizeIcon}
                        {topMaximizeIcon}
                        {closeIcon}
                    </div>
                </div>
            );
        }

        return null;
    }

    renderContent() {
        let contentClassName = classNames('p-dialog-content', this.props.contentClassName)

        return (
            <div id={this.id + '_content'} ref={el => {
                this.contentEl = el;
                if (el != null) {
                    setTimeout(() => {
                        new ResizeSensor(el, (size) => {
                            const a = size.width;
                            if (this.props.onContentResize) {
                                this.props.onContentResize(size.width, size.height);
                            }
                            if (this.minimized && size.width < 100) { //minimize olurken saklıyoruz. // eklendi.
                                this.dialogEl.className = 'p-dialog-hide';
                            }
                        });
                    }, 200);
                }
            }} className={contentClassName}
                style={this.props.contentStyle}>
                {this.props.children}
            </div>
        );
    }

    renderFooter() {
        const footer = ObjectUtils.getJSXElement(this.props.footer, this.props);

        return footer && <div ref={el => this.footerElement = el} className="p-dialog-footer">{footer}</div>
    }

    renderResizer() {
        if (this.props.resizable) {
            return <div className="p-resizable-handle" style={{ zIndex: 90 }} onMouseDown={this.onResizeStart}></div>
        }

        return null;
    }

    renderElement() {
        const className = classNames('p-dialog p-component p-dialog-borderless', this.props.className, {
            'p-dialog-rtl': this.props.rtl,
            'p-dialog-maximized': this.maximized && !this.topMaximized,
            'p-dialog-top-maximized': this.topMaximized,
            'p-dialog-minimized': this.minimized // eklendi.
        } as any);

        const maskClassName = classNames('p-dialog-mask', {
            'p-component-overlay': this.props.modal,
            'p-dialog-visible': this.state.maskVisible,
            'p-dialog-draggable': this.props.draggable,
            'p-dialog-resizable': this.props.resizable,
        } as any, this.props.maskClassName, this.getPositionClass());

        const header = this.renderHeader();
        const content = this.renderContent();
        const footerLine = ObjectUtils.getJSXElement(this.props.footer, this.props) && (<div class='p-dialog-footer-line'></div>);
        const footer = this.renderFooter();
        const resizer = this.renderResizer();

        let transitionTimeout = {
            enter: this.props.position === 'center' ? 150 : 300,
            exit: this.props.position === 'center' ? 150 : 300
        };

        return (
            <div ref={(el) => this.mask = el} className={maskClassName} onClick={this.onMaskClick} style={this.props.maskStyle}>
                <CSSTransition nodeRef={this.dialogRef} classNames="p-dialog" timeout={transitionTimeout} in={this.state.visible} unmountOnExit
                    onEnter={this.onEnter} onEntered={this.onEntered} onExited={this.onExited}>
                    <div ref={this.dialogRef} id={this.id} className={className} style={this.props.style} onClick={this.onClick}
                        role="dialog" aria-labelledby={this.id + '_header'} aria-describedby={this.id + '_content'} aria-modal={this.props.modal}>
                        {header}
                        {content}
                        {footerLine}
                        {footer}
                        {resizer}
                    </div>
                </CSSTransition>
            </div>
        );
    }

    render() {
        if (this.state.maskVisible) {
            const element = this.renderElement();

            return <Portal element={element} appendTo={this.props.appendTo} visible />;
        }

        return null;
    }
}