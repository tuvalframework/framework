import { int } from '@tuval/core';
import { TabPanel, TabView } from '../tabview/TabView';
import { Teact } from '../Teact';
import { ControlHtmlRenderer } from './HtmlRenderer/ControlHtmlRenderer';
import { TTabControl, TTabPage } from './TTabControl';


export class TTabControlRenderer extends ControlHtmlRenderer<TTabControl> {
    private LastActiveIndex: int = -1;

    private createTabPages(obj: TTabControl): any {

        return obj.TabPages.ToArray().map((tab: TTabPage) => {
            return (<TabPanel header={tab.Text} closable={tab.Closable}>
                {tab.CreateControls()}
            </TabPanel>)
        });

    }

    public GenerateBody(obj: TTabControl): void {
        const result = (<div class='tvl-tabcontrol' style={this.GetStyleObject()} >
            <TabView
                closable={obj.Closable}
                onCloseClick={e => { obj.ActiveIndex = e - 1; obj.TabPages.RemoveAt(e); }
                }
                activeIndex={obj.ActiveIndex}
                onTabChange={(e) => {
                    obj.ActiveIndex = e.index;
                    obj.SelectedIndexChanged(e.index);
                    const activeTab: TTabPage = obj.TabPages.Get(e.index);
                    if (activeTab != null) {
                        activeTab.OnActivate();
                    }
                }}
                renderActiveOnly={false}
                showHeader={obj.ShowHeader}
                contentStyle={{ height: obj.Height + 'px' }}>
                {this.createTabPages(obj)}
            </TabView>
        </div>);
        this.WriteComponent(result);
    }

    protected OnComponentDidUpdate(obj: TTabControl): void {
        if (this.LastActiveIndex !== obj.ActiveIndex) {
            const tabPage = obj.TabPages.Get(obj.ActiveIndex);
            tabPage.OnActivate();
            this.LastActiveIndex = obj.ActiveIndex;
        }
    }

}