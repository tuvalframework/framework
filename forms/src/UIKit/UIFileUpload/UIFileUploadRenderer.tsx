import { ByteArray, foreach, is, StringBuilder, Encoding } from '@tuval/core';
import { Fragment } from "../../preact";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { FileUpload } from "../Components/fileupload/FileUpload";
import { Steps } from "../Components/steps/Steps";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { UIFileUploadClass } from "./UIFileUploadClass";

function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff))
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function fromUTF8Array(data) { // array of bytes
    var str = '',
        i;

    for (i = 0; i < data.length; i++) {
        var value = data[i];

        if (value < 0x80) {
            str += String.fromCharCode(value);
        } else if (value > 0xBF && value < 0xE0) {
            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
            i += 1;
        } else if (value > 0xDF && value < 0xF0) {
            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
            i += 2;
        } else {
            // surrogate pair
            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
            i += 3;
        }
    }

    return str;
}

export class UIFileUploadRenderer extends ControlHtmlRenderer<UIFileUploadClass> {
    shadowDom: any;
    protected menu: any;
    fileUploadRef: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UIFileUploadClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/fileupload/FileUpload.css'));
        sb.AppendLine(require('../Components/fileupload/Thema.css'));
    }

    public GenerateElement(obj: UIFileUploadClass): boolean {
        this.WriteStartFragment();
        return true;
    }


    protected OnShadowDomDidMount(ref: any, obj: UIFileUploadClass): void {
        this.shadowDom = ref;
    }

    /*    protected OnShadowDomWillMount(ref: any, obj: UIContextMenuClass): void {
          const prevMenu = document.getElementById('mu_context_menu');
          if (prevMenu) {
             prevMenu.remove();
          }
       } */

    private headerTemplate(options) {
        [];
    }
    private fileContentAsByte: ByteArray;
    private m_SelectedFileName: string = '';
    private m_SelectedFileExt: string = '';

    private getFileName(event) {

        if (!event || !event.files || event.files.length === 0) {
            return;
        }

        const name = event.files[0].name;
        const lastDot = name.lastIndexOf('.');

        const fileName = name.substring(0, lastDot);
        const ext = name.substring(lastDot + 1);

        return fileName;
    }
    private getFileNameExt(event) {

        if (!event || !event.files || event.files.length === 0) {
            return;
        }

        const name = event.files[0].name;
        const lastDot = name.lastIndexOf('.');

        const fileName = name.substring(0, lastDot);
        const ext = name.substring(lastDot + 1);

        return ext;

    }

    private uploadHandler(obj: UIFileUploadClass, event) {
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
            if (is.function(obj.FileReady)) {
                obj.FileReady({
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

    public GenerateBody(obj: UIFileUploadClass): void {
        const contentStyle = {};
        contentStyle['width'] = '100%';
        contentStyle['height'] = '100%';

        const style = {};
        style['width'] = obj.Appearance.Width;
        style['height'] = obj.Appearance.Height;

        const chooseOptions = {};
        chooseOptions['style'] = { display: 'none' }

        this.WriteComponent(
            <FileUpload name="demo[]" url="" style={style} contentStyle={contentStyle} onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={obj.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => this.uploadHandler(obj, e)} headerTemplate={this.headerTemplate} emptyTemplate={<div style={{ width: '100%', height: '100%' }} onclick={() => this.fileUploadRef.choose()}> {this.CreateControls(obj)} </div>} />
        );

        this.WriteComponent(
            <FileUpload ref={(el) => this.fileUploadRef = el} mode="basic" chooseOptions={chooseOptions} name="demo[]" url="" onUpload={() => console.log('Uploaded')} auto={true} customUpload accept={obj.vp_AllowedExtensions} maxFileSize={1024 * 1024 * 100}
                uploadHandler={(e) => this.uploadHandler(obj, e)} />
        );
    }

    protected CreateControls(obj: UIFileUploadClass): any[] {
        const vNodes: any[] = [];

        if ((obj as any).SubViews != null) {
            foreach(obj.GetViews(), (root: IRenderable) => {
                const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
                if (view != null) {
                    vNodes.push(view.Render());
                }
            });
        }

        return vNodes;
    }
}