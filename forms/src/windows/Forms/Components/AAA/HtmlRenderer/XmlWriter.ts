import { ArgumentNullException } from "@tuval/core";
import { Control } from "../Control";
import { XmlElement } from "./XmlElement";

export class XmlWriter {
    public WriterElement: XmlElement;
    public /* virtual */  WriteStartElement(name: string): void {
        if (name == null) {
            throw new ArgumentNullException("name");
        }

        const writerElement: XmlElement = this.WriterElement;
        if (writerElement != null) {
            const xmlElement: XmlElement = XmlElement.CreateElement(name);
            writerElement.AppendChild(xmlElement);
            this.WriterElement = xmlElement;
        } else {
            this.WriterElement = XmlElement.CreateElement(name);
        }
    }
    public /* virtual */  WriteAttrVal(name: string, val: any): string {
        if (name != null && val != null) {

            const writerElement: XmlElement = this.WriterElement;
            if (writerElement != null) {
                writerElement.SetAttribute(name, val);
            }
            return val;
        }
    }
    public /* virtual */  WriteStyleAttrVal(name: string, val: any): string {
        if (name != null && val != null) {

            const writerElement: XmlElement = this.WriterElement;
            if (writerElement != null) {
                writerElement.SetStyleAttribute(name, val);
            }
            return val;
        }
    }

    public WriteTextBody(text: string) {
        const writerElement: XmlElement = this.WriterElement;
        writerElement.SetInnerText(text);
    }

    public WriteComponent(node:any) {
        const writerElement: XmlElement = this.WriterElement;
        writerElement.AppendChild(node);
    }

    public WriteControl(control:Control<any>) {
        const writerElement: XmlElement = this.WriterElement;
        writerElement.AppendChild(control.CreateMainElement());
    }

    public /* virtual */  WriteEndElement(): void {
        const writerElement: XmlElement = this.WriterElement;
        if (writerElement != null && writerElement.ParentNode != null) {
            this.WriterElement = writerElement.ParentNode as XmlElement;
        }
    }

    public RenderToNode(): any {
        if (this.WriterElement != null) {
            return this.WriterElement.RenderNode();
        }
    }
}