import { foreach, is, List } from "@tuval/core";
import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from "../../Teact";


export class XmlElement {
    private ElementName: string;
    private props: any = {};
    public ParentNode: XmlElement;
    public Children: List<XmlElement>;
    private innerText: string;
    public constructor(name: string) {
        this.ElementName = name;
        this.Children = new List();
    }
    public SetAttribute(attrName: string, value: any) {
        this.props[attrName] = value;
    }
    public SetStyleAttribute(attrName: string, value: any) {
        if (this.props['style'] == null) {
            this.props['style'] = {};
        }
        this.props['style'][attrName] = value;
    }
    public SetInnerText(text: string) {
        this.innerText = text;
    }
    public AppendChild(child: XmlElement): void {
        child.ParentNode = this;
        this.Children.Add(child);
    }
    public RenderNode(): any {
        const result: any[] = [];
        foreach(this.Children, (node: XmlElement) => {
            if (node instanceof XmlElement) {
                result.push(node.RenderNode());
            } else {
                result.push(node);
            }
        });
        if (result.length === 0 && !is.nullOrEmpty(this.innerText)) {
            return Teact.createElement(this.ElementName, this.props, this.innerText);
        } else {
            if (this.ElementName === 'Fragment') {
                return Teact.createElement(Fragment, this.props, result);
            } else {
                return Teact.createElement(this.ElementName, this.props, result);
            }
        }

    }
    public static CreateElement(name: string): XmlElement {
        return new XmlElement(name);
    }
}