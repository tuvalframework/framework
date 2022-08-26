import { foreach, Event, Delegate } from '@tuval/core';
import { Control } from "../Control";
import { ControlCollection } from "../ControlCollection";
import { Teact } from '../../Teact';
import { DomHandler } from "../../DomHandler";
import { Property } from '../Reflection/PropertyDecorator';

DomHandler.addCssToDocument(require('./DropArea.css'));

export class DropEventArgs {
    public sender: any;
    public nativeEvent: DragEvent;
    public constructor(sender: any, nativeEvent: DragEvent) {
        this.sender = sender;
        this.nativeEvent = nativeEvent;
    }
}

export class DragEnterEventHandler extends Delegate<(e: DragEvent) => void> { };
export class DragLeaveEventHandler extends Delegate<(e: DragEvent) => void> { };
export class DragOverEventHandler extends Delegate<(e: DragEvent) => void> { };
export class DropEventHandler extends Delegate<(e: DropEventArgs) => void> { };

export class DropArea extends Control<DropArea> {

    @Property()
    public AllowDrop: boolean;

    @Property()
    public Controls: ControlCollection;

    @Property()
    public DragEnter: Event<DragEnterEventHandler>;

    @Property()
    public DragLeave: Event<DragLeaveEventHandler>;

    @Property()
    public DragOver: Event<DragOverEventHandler>;

    @Property()
    public Drop: Event<DropEventHandler>;

    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
        this.DragEnter = new Event();
        this.DragLeave = new Event();
        this.DragOver = new Event();
        this.Drop = new Event();
        this.AllowDrop = true;
        this.Width = -1;
    }

    private CreateControls(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }

    public CreateElements(): any {
        /* const style = {};
        if (this.Padding !== Padding.Empty) {
            style['padding'] = this.Padding.All + 'px';
        } */
        return (
            <div className={'tuval-drop-area flex align-items-center justify-content-center'} style={{ height: this.Height + 'px' }}
                onDrop={e => this.handleDrop(new DropEventArgs(this, e))}
                onDragOver={e => this.handleDragOver(e)}
                onDragEnter={e => this.handleDragEnter(e)}
                onDragLeave={e => this.handleDragLeave(e)}
            >
                <p style='margin:0px;'>{this.Text}</p>
                {this.CreateControls()}
            </div>
        );
    }

    private handleDragEnter(e) {
         e.preventDefault();
        e.stopPropagation();
        this.DragEnter(e);

    }

    private handleDragLeave(e) {
         e.preventDefault();
        e.stopPropagation();
        this.DragLeave(e);
    }

    private handleDragOver(e) {
         e.preventDefault();
        e.stopPropagation();

        e.dataTransfer.dropEffect = 'copy';
        this.DragOver(e);

    }

    private handleDrop(e: DropEventArgs) {
       /*  e.nativeEvent.preventDefault();
        e.nativeEvent.stopPropagation(); */
        if (!this.AllowDrop) {
            e.nativeEvent.returnValue = false;
            return false;
        } else {
            this.Drop(e);
        }
    }

    protected GetStyleObject(): any {
        const style = super.GetStyleObject();
        if (this.Width > -1) {
            style['width'] = this.Width + 'px';
        }
        style['height'] = this.Height + 'px';
        return style;
    }
}