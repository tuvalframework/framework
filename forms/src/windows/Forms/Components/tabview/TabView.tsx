import { Ripple } from '../ripple/Ripple';
import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { classNames } from '@tuval/core';
import { ObjectUtils } from '../ObjectUtils';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ButtonComponent } from '../button/TuButtonElement';

const css = require('./TabView.css');
DomHandler.addCssToDocument(css);

export class TabPanel extends React.Component {

    static defaultProps = {
        showHeader: true,
        header: null,
        headerTemplate: null,
        leftIcon: null,
        rightIcon: null,
        disabled: false,
        headerStyle: null,
        headerClassName: null,
        contentStyle: null,
        contentClassName: null
    }
}

export class TabView extends React.Component {

    static defaultProps = {
        id: null,
        activeIndex: 0,
        style: null,
        className: null,
        renderActiveOnly: true,
        closable: false,
        onTabChange: null
    }
    inkbar: any;
    nav: any;

    constructor(props) {
        super(props);
        let state: any = {
            id: props.id
        };

        if (!this.props.onTabChange) {
            state = {
                ...state,
                activeIndex: props.activeIndex
            };
        }

        this.state = state;
    }

    getActiveIndex() {
        return this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex;
    }

    isSelected(index) {
        return (index === this.getActiveIndex());
    }

    onTabHeaderClick(event, tab, index) {
        if (!tab.props.disabled) {
            if (this.props.onTabChange) {
                this.props.onTabChange({ originalEvent: event, index: index });
            }
            else {
                this.setState({
                    activeIndex: index
                });
            }
        }

        event.preventDefault();
    }

    onCloseClick(event, index) {
        if (this.props.onCloseClick != null) {
            this.props.onCloseClick(index);
            event.stopPropagation();
            event.preventDefault();
        }
    }

    updateInkBar() {
        const activeIndex = this.getActiveIndex();
        const tabHeader = this[`tab_${activeIndex}`];

        this.inkbar.style.width = DomHandler.getWidth(tabHeader) + 'px';
        this.inkbar.style.left = DomHandler.getOffset(tabHeader).left - DomHandler.getOffset(this.nav).left + 'px';
    }

    componentDidMount() {
        if (!this.state.id) {
            this.setState({ id: UniqueComponentId() });
        }

        this.updateInkBar();
    }

    componentDidUpdate() {
        this.updateInkBar();
    }

    renderTabHeader(tab, index) {
        const selected = this.isSelected(index);
        const className = classNames('p-unselectable-text', { 'p-tabview-selected p-highlight': selected, 'p-disabled': tab.props.disabled } as any, tab.props.headerClassName);
        const id = this.state.id + '_header_' + index;
        const ariaControls = this.state.id + '_content_' + index;
        const tabIndex = tab.props.disabled ? null : 0;
        const leftIconElement = tab.props.leftIcon && <i className={tab.props.leftIcon}></i>;
        const titleElement = <span className="p-tabview-title">{tab.props.header}</span>;
        const rightIconElement = tab.props.rightIcon && <i className={tab.props.rightIcon} ></i>;
        const closeable = tab.props.closable && <span style={{ paddingLeft: '5px' }} onClick={e => this.onCloseClick(e, index)}><i className="pi pi-times"></i></span>
        let content = (
            /* eslint-disable */
            <a role="tab" className="p-tabview-nav-link" onClick={(event) => this.onTabHeaderClick(event, tab, index)} id={id}
                aria-controls={ariaControls} aria-selected={selected} tabIndex={tabIndex}>
                {leftIconElement}
                {titleElement}
                {rightIconElement}
                {closeable}
            </a>
            /* eslint-enable */
        );

        if (tab.props.headerTemplate) {
            const defaultContentOptions = {
                className: 'p-tabview-nav-link',
                titleClassName: 'p-tabview-title',
                onClick: (event) => this.onTabHeaderClick(event, tab, index),
                leftIconElement,
                titleElement,
                rightIconElement,
                element: content,
                props: this.props,
                index,
                selected,
                ariaControls
            };

            content = ObjectUtils.getJSXElement(tab.props.headerTemplate, defaultContentOptions);
        }

        return (
            <li ref={(el) => this[`tab_${index}`] = el} className={className} style={tab.props.headerStyle} role="presentation">
                {content}
            </li>
        );
    }

    renderTabHeaders() {
        return (
            React.Children.map(this.props.children, (tab, index) => {
                return this.renderTabHeader(tab, index);
            })
        );
    }

    renderNavigator() {
        const headers = this.renderTabHeaders();
        let style = {};

        if (!this.props.showHeader) { // yeni eklendi.
            style['display'] = 'none';
        }

        return (
            <ul ref={(el) => this.nav = el} className="p-tabview-nav" role="tablist" style={style}>
                {headers}
                <li ref={(el) => this.inkbar = el} className="p-tabview-ink-bar"></li>
            </ul>
        );
    }

    renderContent() {
        const contents = React.Children.map(this.props.children, (tab, index) => {
            if (!this.props.renderActiveOnly || this.isSelected(index)) {
                return this.createContent(tab, index);
            }
        })

        return (
            <div className="p-tabview-panels">
                {contents}
            </div>
        );
    }

    createContent(tab, index) {
        const selected = this.isSelected(index);
        const className = classNames(tab.props.contentClassName, 'p-tabview-panel', { 'p-hidden': !selected } as any);
        const id = this.state.id + '_content_' + index;
        const ariaLabelledBy = this.state.id + '_header_' + index;

        return (
            <div id={id} aria-labelledby={ariaLabelledBy} aria-hidden={!selected} className={className}
                style={tab.props.contentStyle} role="tabpanel">
                {!this.props.renderActiveOnly ? tab.props.children : (selected && tab.props.children)}
            </div>
        );
    }

    render() {
        const className = classNames('p-tabview p-component', this.props.className);
        const navigator = this.renderNavigator();
        const content = this.renderContent();

        return (
            <div id={this.props.id} className={className} style={this.props.style}>
                {navigator}
                {content}
            </div>
        );
    }
}
