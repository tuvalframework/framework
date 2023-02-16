import { ByteArray, is } from "@tuval/core";
import * as MarkdownIt from "markdown-it";
import { FileUpload } from 'primereact';
import React, { Fragment } from "react";
import { UIFileUploadClass } from "./UIFileUploadClass";
import { fromUTF8Array } from "./utils";



export interface IControlProperties {
    control: UIFileUploadClass
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});



function UIFileUploadRenderer({ control }: IControlProperties) {

    let fileContentAsByte: ByteArray;
    let m_SelectedFileName: string = '';
    let m_SelectedFileExt: string = '';

    const uploadHandler = (obj: UIFileUploadClass, event) => {
        // this.fileUploadRef.clear()
        event.options.clear();

        var reader = new FileReader();
        const _this = this;
        reader.onload = function (e) {

            var arrayBuffer: any = this.result;
            _this.fileContentAsByte = new Uint8Array(arrayBuffer);
            //binaryString = String.fromCharCode.apply(null, array);

            //console.log(arrayBuffer);
            _this.m_SelectedFileName = _this.getFileName(event);
            _this.m_SelectedFileExt = _this.getFileNameExt(event);
            if (is.function(control.vp_OnFileReady)) {
                control.vp_OnFileReady({
                    GetFileContentAsString: () => fromUTF8Array(_this.fileContentAsByte),
                    fileName: _this.m_SelectedFileName,
                    fileExt: _this.m_SelectedFileExt,
                    fileAsByteArray: _this.fileContentAsByte,
                    file: event.files[0]
                });
            }

        }
        reader.readAsArrayBuffer(event.files[0]);
    }

    const contentStyle = {};
    contentStyle['width'] = '100%';
    contentStyle['height'] = '100%';

    const style = {};
    style['width'] = control.Appearance.Width;
    style['height'] = control.Appearance.Height;

    const chooseOptions = {};
    chooseOptions['style'] = { display: 'none' }

    return (
        <Fragment>
            <FileUpload name="demo[]" url="" style={style} contentStyle={contentStyle} onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={control.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => this.uploadHandler(control, e)} headerTemplate={this.headerTemplate} emptyTemplate={<div style={{ width: '100%', height: '100%' }} onClick={() => this.fileUploadRef.choose()}>
                    {
                        control.vp_Children.map(view =>view && view.render())
                    }
                </div>} />
            <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" chooseOptions={chooseOptions} name="demo[]" url="" onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={control.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => this.uploadHandler(control, e)} />
        </Fragment>
    )
}

export default UIFileUploadRenderer;