import { Control, TComponent } from "../Control";
import { XmlWriter } from "./XmlWriter";
import React, { createElement, Fragment } from "../../../../../preact/compat";

export abstract class XmlTransformer<T extends any/* TComponent */> extends React.Component {
    private Writer: XmlWriter;

    public constructor(props: any) {
        super(props);
        this.Writer = new XmlWriter();

        this.state = {
            // Set your state here
        }
        /* this.View = view;
        this.Object = obj; */
    }
    public WriteStartElement(name: string): void {
        this.Writer.WriteStartElement(name);
    }
    public WriteStartFragment(): void {
        this.Writer.WriteStartElement('Fragment');
    }
    public WriteEndElement(): void {
        this.Writer.WriteEndElement();
    }
    public WriteAttrVal(name: string, val: any): string {
        //const str: string = val;
        this.Writer.WriteAttrVal(name, val);
        return val;
    }
    public WriteStyleAttrVal(name: string, val: any): string {
        if (val != null) {
            //const str: string = val;
            this.Writer.WriteStyleAttrVal(name, val);
        }
        return val;
    }
    /*  public WriteIntAttrVal(name: string, val: int): string {
         const str: string = Convert.ToString(val);
         this.Writer.WriteAttrVal(name, str);
         return str;
     } */

    public WriteTextBody(text: string) {
        this.Writer.WriteTextBody(text);
    }

    public WriteControl(control: Control<any>) {
        this.Writer.WriteControl(control);
    }

    public WriteComponent(text: any) {
        this.Writer.WriteComponent(text);
    }
    public InvalidateCache() {

    }

    public abstract DecideCache(obj: T): void;
    public abstract GenerateElement(obj: T): boolean;
    public abstract GenerateAttributes(obj: T): void
    public abstract GenerateBody(obj: T): void;
    public abstract GenerateElementFinish(obj: T): void;

    private reset(): void {
        this.Writer = new XmlWriter();
    }
    public Render(result: any[], obj: T): any {
        this.reset();
        this.GenerateElement(obj);
        this.GenerateAttributes(obj);
        this.GenerateBody(obj);
        this.GenerateElementFinish(obj);
        result.push(this.Writer.RenderToNode());
    }
}