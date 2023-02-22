import { ByteArray, is } from "@tuval/core";
import * as MarkdownIt from "markdown-it";
import { FileUpload } from 'primereact';
import React, { Fragment, useRef } from "react";
import { UIFileUploadClass } from "./UIFileUploadClass";
import { fromUTF8Array } from "./utils";



export interface IControlProperties {
    control: UIFileUploadClass
}


 function getFileName(event) {

    if (!event || !event.files || event.files.length === 0) {
        return;
    }

    const name = event.files[0].name;
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    return fileName;
}
function getFileNameExt(event) {

    if (!event || !event.files || event.files.length === 0) {
        return;
    }

    const name = event.files[0].name;
    const lastDot = name.lastIndexOf('.');

    const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    return ext;

}


function UIFileUploadRenderer({ control }: IControlProperties) {
    const fileUploadRef = useRef(null);
    let fileContentAsByte: ByteArray;
    let m_SelectedFileName: string = '';
    let m_SelectedFileExt: string = '';

    const uploadHandler = (obj: UIFileUploadClass, event) => {
        

        event.options.clear();

        var reader = new FileReader();
        reader.onload = function (e) {

            var arrayBuffer: any = this.result;
            fileContentAsByte = new Uint8Array(arrayBuffer);
            //binaryString = String.fromCharCode.apply(null, array);

            //console.log(arrayBuffer);
            m_SelectedFileName = getFileName(event);
            m_SelectedFileExt = getFileNameExt(event);
            if (is.function(control.vp_OnFileReady)) {
                control.vp_OnFileReady({
                    GetFileContentAsString: () => fromUTF8Array(fileContentAsByte),
                    fileName: m_SelectedFileName,
                    fileExt: m_SelectedFileExt,
                    fileAsByteArray: fileContentAsByte,
                    file: event.files[0]
                });
            }

        }
        reader.readAsArrayBuffer(event.files[0]);
    }

    const contentStyle = {};
    contentStyle['width'] = '100%';
    contentStyle['height'] = '100%';

   /*  const style = {};
    style['width'] = control.Appearance.Width;
    style['height'] = control.Appearance.Height; */

    const chooseOptions = {};
    chooseOptions['style'] = { display: 'none' }

    const headerTemplate = (options) => {
        [];
    }

    
    return (
        <Fragment>
            <FileUpload name="demo[]" url=""  contentStyle={contentStyle} onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={control.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => uploadHandler(control, e)} headerTemplate={headerTemplate} emptyTemplate={<div style={{ width: '100%', height: '100%' }} onClick={() => fileUploadRef.current.getInput().click()}>
                    {
                        control.vp_Children.map(view =>view && view.render())
                    }
                </div>} />
            <FileUpload ref={fileUploadRef} mode="basic" chooseOptions={chooseOptions} name="demo[]" url="" onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={control.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => uploadHandler(control, e)} />
        </Fragment>
    )
}

export default UIFileUploadRenderer;