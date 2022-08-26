import { classNames } from '@tuval/core';
import React, { createElement, createRef } from '../../../../preact/compat';
import { UniqueComponentId } from '../../../../UniqueComponentId';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";
import { CSSTransition } from '../csstransition/CSSTransition';
import { DomHandler } from '../DomHandler';

const css = require('./Accordion.css');
DomHandler.addCssToDocument(css);

export class AccordionComponentTab extends React.Component {
    static defaultProps = {
        header: null,
        disabled: false,
        headerStyle: null,
        headerClassName: null,
        headerTemplate: null,
        contentStyle: null,
        contentClassName: null
    }
}

export class AccordionComponent extends React.Component {

    static defaultProps = {
        id: null,
        activeIndex: null,
        className: null,
        style: null,
        multiple: false,
        expandIcon: 'pi pi-chevron-right',
        collapseIcon: 'pi pi-chevron-down',
        transitionOptions: null,
        onTabOpen: null,
        onTabClose: null,
        onTabChange: null
    }
    private contentWrappers: any[];
    private container: any;

    constructor(props) {
        super(props);
        let state: any = {
            id: this.props.id
        };

        if (!this.props.onTabChange) {
            state = {
                ...state,
                activeIndex: props.activeIndex
            };
        }

        this.state = state;
        this.contentWrappers = [];
    }

    onTabHeaderClick(event, tab, index) {
        if (!tab.props.disabled) {
            const selected = this.isSelected(index);
            let newActiveIndex = null;

            if (this.props.multiple) {
                let indexes = (this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex) || [];
                if (selected)
                    indexes = indexes.filter(i => i !== index);
                else
                    indexes = [...indexes, index];

                newActiveIndex = indexes;
            }
            else {
                newActiveIndex = selected ? null : index;
            }

            let callback = selected ? this.props.onTabClose : this.props.onTabOpen;
            if (callback) {
                callback({ originalEvent: event, index: index });
            }

            if (this.props.onTabChange) {
                this.props.onTabChange({
                    originalEvent: event,
                    index: newActiveIndex
                })
            }
            else {
                this.setState({
                    activeIndex: newActiveIndex
                });
            }
        }

        event.preventDefault();
    }

    isSelected(index) {
        const activeIndex = this.props.onTabChange ? this.props.activeIndex : this.state.activeIndex;

        return this.props.multiple ? (activeIndex && activeIndex.indexOf(index) >= 0) : activeIndex === index;
    }

    componentDidMount() {
        if (!this.state.id) {
            this.setState({ id: UniqueComponentId() });
        }
    }

    renderTabHeader(tab, selected, index) {
        const tabHeaderClass = classNames('p-accordion-header', { 'p-highlight': selected, 'p-disabled': tab.props.disabled } as any, tab.props.headerClassName);
        const iconClassName = classNames('p-accordion-toggle-icon', { [`${this.props.expandIcon}`]: !selected, [`${this.props.collapseIcon}`]: selected } as any);
        const id = this.state.id + '_header_' + index;
        const ariaControls = this.state.id + '_content_' + index;
        const tabIndex = tab.props.disabled ? -1 : null;
        const header = tab.props.headerTemplate ? ObjectUtils.getJSXElement(tab.props.headerTemplate, tab.props) : <span className="p-accordion-header-text">{tab.props.header}</span>;

        return (
            <div className={tabHeaderClass} style={tab.props.headerStyle}>
                <a href={'#' + ariaControls} id={id} className="p-accordion-header-link" aria-controls={ariaControls} role="tab" aria-expanded={selected} onClick={(event) => this.onTabHeaderClick(event, tab, index)} tabIndex={tabIndex}>
                    <span className={iconClassName}></span>
                    {header}
                </a>
            </div>
        );
    }

    renderTabContent(tab, selected, index) {
        const className = classNames('p-toggleable-content', tab.props.contentClassName);
        const id = this.state.id + '_content_' + index;
        const toggleableContentRef = React.createRef();

        return (
            <CSSTransition nodeRef={toggleableContentRef} classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={selected} unmountOnExit options={this.props.transitionOptions}>
                <div ref={toggleableContentRef} id={id} className={className} style={tab.props.contentStyle} role="region" aria-labelledby={this.state.id + '_header_' + index}>
                    <div className="p-accordion-content">
                        {tab.props.children}
                    </div>
                </div>
            </CSSTransition>
        );
    }

    renderTab(tab, index) {
        const selected = this.isSelected(index);
        const tabHeader = this.renderTabHeader(tab, selected, index);
        const tabContent = this.renderTabContent(tab, selected, index);
        const tabClassName = classNames('p-accordion-tab', {
            'p-accordion-tab-active': selected
        } as any);

        return (
            <div key={tab.props.header} className={tabClassName}>
                {tabHeader}
                {tabContent}
            </div>
        );
    }

    renderTabs() {
        return (
            React.Children.map(this.props.children, (tab, index) => {
                if (tab && tab.type === AccordionComponentTab) {
                    return this.renderTab(tab, index);
                }
            })
        )
    }

    render() {
        const className = classNames('p-accordion p-component', this.props.className);
        const tabs = this.renderTabs();

        return (
            <div ref={(el) => this.container = el} id={this.state.id} className={className} style={this.props.style}>
                {tabs}
            </div>
        );
    }
}