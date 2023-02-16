import { UIView } from '../UIView/UIView';
import TextRenderer from './UIFileUploadRenderer';
import { Renderer } from '../../RendererDecorator';
import React from "react";
import UIViewRenderer from '../UIView/UIViewRenderer';
import { ViewProperty } from '../UIView/ViewProperty';
import { ByteArray } from '@tuval/core';
import UIFileUploadRenderer from './UIFileUploadRenderer';


export interface IUploadFileReady {
    GetFileContentAsString(): string;
    fileName: string;
    fileExt: string;
    fileAsByteArray: ByteArray,
    file: any;
}

export class UIFileUploadClass extends UIView {

    @ViewProperty()
    public vp_OnFileReady: (value: IUploadFileReady) => void;

    public onFileReady(value: (param: IUploadFileReady) => void): this {
        this.vp_OnFileReady = value;
        return this;
    }




    @ViewProperty() vp_AllowedExtensions: string;
    public allowedExtensions(value: string): this {
        this.vp_AllowedExtensions = value;
        return this;
    }

       /** @internal */
       @ViewProperty() vp_Children: UIView[];
       public children(...value: UIView[]): this {
           this.vp_Children = value;
           return this;
       }
   

    public constructor() {
        super();

        
    }

  

    public render() {
        return (<UIViewRenderer wrap={true} control={this} renderer={UIFileUploadRenderer}></UIViewRenderer>)
    }
}
