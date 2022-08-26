import { Teact } from "../Teact";
import React from '../../../../preact/compat';
import { DomHandler } from '../DomHandler';
import { classNames } from '@tuval/core';

export class ScrollableView extends React.Component {

     static defaultProps = {
        header: null,
        body: null,
        footer: null,
        columns: null,
        frozen: null,
        frozenWidth: null,
        frozenBody: null,
        virtualScroll: false,
        virtualRowHeight: null,
        rows: null,
        totalRecords: null,
        loading: false,
        tableStyle: null,
        tableClassName: null,
        onVirtualScroll: null
     }
    scrollHeaderBox: any;
    scrollFooterBox: any;
    scrollBody: any;
    virtualScroller: any;
    virtualScrollCallback: any;
    container: any;
    scrollHeader: any;
    scrollTable: any;
    loadingTable: any;
    scrollFooter: any;


    constructor(props) {
        super(props);
        this.onHeaderScroll = this.onHeaderScroll.bind(this);
        this.onBodyScroll = this.onBodyScroll.bind(this);
    }

    componentDidMount() {
        this.setScrollHeight();

        if (!this.props.frozen) {
            let scrollBarWidth = DomHandler.calculateScrollbarWidth();

            this.scrollHeaderBox.style.marginRight = scrollBarWidth + 'px';
            if (this.scrollFooterBox) {
                this.scrollFooterBox.style.marginRight = scrollBarWidth + 'px';
            }
        }
        else {
            this.scrollBody.style.paddingBottom = DomHandler.calculateScrollbarWidth() + 'px';
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.scrollHeight !== prevProps.scrollHeight) {
            this.setScrollHeight();
        }

        if (!this.props.frozen && this.props.virtualScroll) {
            this.virtualScroller.style.height = this.props.totalRecords * this.props.virtualRowHeight + 'px';
        }

        if (this.virtualScrollCallback && !this.props.loading) {
            this.virtualScrollCallback();
            this.virtualScrollCallback = null;
        }
    }

    setScrollHeight() {
        if(this.props.scrollHeight) {
            let frozenView = this.container.previousElementSibling;
            if(frozenView) {
                let frozenScrollBody = DomHandler.findSingle(frozenView, '.p-datatable-scrollable-body');
                this.scrollBody.style.maxHeight = frozenScrollBody.style.maxHeight;
            }
            else {
                if(this.props.scrollHeight.indexOf('%') !== -1) {
                    let datatableContainer = this.findDataTableContainer(this.container);
                    this.scrollBody.style.visibility = 'hidden';
                    this.scrollBody.style.height = '100px';         //temporary height to calculate static height
                    let containerHeight = DomHandler.getOuterHeight(datatableContainer);
                    let relativeHeight = DomHandler.getOuterHeight(datatableContainer.parentElement) * parseInt(this.props.scrollHeight, 10) / 100;
                    let staticHeight = containerHeight - 100;       //total height of headers, footers, paginators
                    let scrollBodyHeight = (relativeHeight - staticHeight);

                    if (this.props.frozen) {
                        scrollBodyHeight -= DomHandler.calculateScrollbarWidth();
                    }

                    this.scrollBody.style.height = 'auto';
                    this.scrollBody.style.maxHeight = scrollBodyHeight + 'px';
                    this.scrollBody.style.visibility = 'visible';
                }
                else {
                    this.scrollBody.style.maxHeight = this.props.scrollHeight;
                }
            }
        }
    }

    findDataTableContainer(element) {
        if(element) {
            let el = element;
            while(el && !DomHandler.hasClass(el, 'p-datatable')) {
                el = el.parentElement;
            }

            return el;
        }
        else {
            return null;
        }
    }

    onHeaderScroll() {
        this.scrollHeader.scrollLeft = 0;
    }

    onBodyScroll() {
        let frozenView = this.container.previousElementSibling;
        let frozenScrollBody;
        if(frozenView) {
            frozenScrollBody = DomHandler.findSingle(frozenView, '.p-datatable-scrollable-body');
        }

        this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
        if(this.scrollFooterBox) {
            this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
        }

        if(frozenScrollBody) {
            frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
        }

        if(this.props.virtualScroll) {
            let viewport = DomHandler.getClientHeight(this.scrollBody);
            let tableHeight = DomHandler.getOuterHeight(this.scrollTable);
            let pageHeight = this.props.virtualRowHeight * this.props.rows;
            let virtualTableHeight = DomHandler.getOuterHeight(this.virtualScroller);
            let pageCount = (virtualTableHeight / pageHeight)||1;
            let scrollBodyTop = this.scrollTable.style.top||'0';

            if(this.scrollBody.scrollTop + viewport > parseFloat(scrollBodyTop) + tableHeight || this.scrollBody.scrollTop < parseFloat(scrollBodyTop)) {
                if (this.loadingTable) {
                    this.loadingTable.style.display = 'table';
                    this.loadingTable.style.top = this.scrollBody.scrollTop + 'px';
                }

                let page = Math.floor((this.scrollBody.scrollTop * pageCount) / (this.scrollBody.scrollHeight)) + 1;
                if(this.props.onVirtualScroll) {
                    this.props.onVirtualScroll({
                        page: page
                    });

                    this.virtualScrollCallback = () => {
                        if (this.loadingTable) {
                            this.loadingTable.style.display = 'none';
                        }

                        this.scrollTable.style.top = ((page - 1) * pageHeight) + 'px';
                    }
                }
            }
        }
    }

    renderColGroup() {
        if(this.props.columns && this.props.columns.length) {
            return (
                <colgroup className="p-datatable-scrollable-colgroup">
                    {this.props.columns.map((col, i) => <col key={col.props.field + '_' + i} style={col.props.headerStyle || col.props.style} className={col.props.headerClassName || col.props.className}/>)}
                </colgroup>
            );
        }
        else {
            return null;
        }
    }

    renderLoadingTable(colGroup) {
        if (this.props.virtualScroll) {
            return (
                <table ref={el => this.loadingTable = el} style={{top:'0', display: 'none'}} className="p-datatable-scrollable-body-table p-datatable-loading-virtual-table p-datatable-virtual-table">
                    {colGroup}
                    {this.props.loadingBody}
                </table>
            )
        }
        else {
            return null;
        }
    }

    render() {
        let className = classNames('p-datatable-scrollable-view', {'p-datatable-frozen-view': this.props.frozen, 'p-datatable-unfrozen-view': !this.props.frozen && this.props.frozenWidth} as any);
        let tableBodyClassName = classNames('p-datatable-scrollable-body-table', this.props.tableClassName, {'p-datatable-virtual-table': this.props.virtualScroll} as any);
        let tableHeaderClassName = classNames('p-datatable-scrollable-header-table', this.props.tableClassName);
        let tableFooterClassName = classNames('p-datatable-scrollable-footer-table', this.props.tableClassName);
        let tableBodyStyle = Object.assign({top:'0'}, this.props.tableStyle);
        let width = this.props.columns ? (this.props.frozen ? this.props.frozenWidth : 'calc(100% - ' + this.props.frozenWidth + ')') : 0;
        let left = this.props.frozen ? null : this.props.frozenWidth;
        let colGroup = this.renderColGroup();
        let loadingTable = this.renderLoadingTable(colGroup);
        let scrollableBodyStyle = !this.props.frozen && this.props.scrollHeight ? { overflowY: 'scroll' } : null;

        return (
            <div className={className} style={{width: width, left: left}} ref={(el) => { this.container = el; }}>
                <div className="p-datatable-scrollable-header" ref={(el) => { this.scrollHeader= el; }} onScroll={this.onHeaderScroll}>
                    <div className="p-datatable-scrollable-header-box" ref={(el) => { this.scrollHeaderBox = el; }}>
                        <table className={tableHeaderClassName} style={this.props.tableStyle}>
                            {colGroup}
                            {this.props.header}
                            {this.props.frozenBody}
                        </table>
                    </div>
                </div>
                <div className="p-datatable-scrollable-body" ref={(el) => { this.scrollBody = el; }} style={scrollableBodyStyle} onScroll={this.onBodyScroll}>
                    <table ref={el => this.scrollTable = el} style={tableBodyStyle} className={tableBodyClassName}>
                        {colGroup}
                        {this.props.body}
                    </table>
                    {loadingTable}
                    <div className="p-datatable-virtual-scroller" ref={(el) => { this.virtualScroller = el; }}></div>
                </div>
                <div className="p-datatable-scrollable-footer" ref={(el) => { this.scrollFooter = el; }}>
                    <div className="p-datatable-scrollable-footer-box" ref={(el) => { this.scrollFooterBox = el; }}>
                         <table className={tableFooterClassName} style={this.props.tableStyle}>
                            {colGroup}
                            {this.props.footer}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
