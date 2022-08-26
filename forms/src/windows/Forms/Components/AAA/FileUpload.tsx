import React, { createElement, Fragment } from "../../../../preact/compat";
import { Teact } from '../Teact';
import { ClassInfo, Event, ByteArray, Encoding } from '@tuval/core';
import { InputText } from "../inputtext/TuInputText";
import { Control, Modes } from './Control';
import { ControlTypes } from "../ControlTypes";
import { FileUploadComponent } from '../fileupload/FileUpload';
import { EventHandler } from "../Delegates";
import { Property } from "./Reflection/PropertyDecorator";



@ClassInfo({
    fullName: ControlTypes.FileUpload,
    instanceof: [
        ControlTypes.FileUpload,
    ]
})
export class FileUpload extends Control<FileUpload> {
    private fileUploadRef: FileUploadComponent;

    @Property()
    public Url: string;

    public get FileReady(): Event<EventHandler>{
        return this.GetProperty('FileReady');
    }
    public set FileReady(value: Event<EventHandler>) {
        this.SetProperty('FileReady', value);
    }

    public get AllowedExtensions(): string{
        return this.GetProperty('AllowedExtensions');
    }
    public set AllowedExtensions(value: string) {
        this.SetProperty('AllowedExtensions', value);
    }


    public SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.FileReady = new Event();
        this.Url = '';
    }
    public SetupComponentDefaults() {
        super.SetupComponentDefaults();
        this.emptyTemplate = this.emptyTemplate.bind(this);
        this.uploadHandler = this.uploadHandler.bind(this);
    }
    public get Label(): string {
        return this.GetProperty('Label');
    }
    public set Label(value: string) {
        this.SetProperty('Label', value);
    }

    private emptyTemplate() {
        return (
            <div className="p-d-flex p-ai-center p-dir-col">
                {/*  <i className="pi pi-image p-mt-3 p-p-5" style={{ 'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i> */}
                <span style={{ 'fontSize': '1.2em', color: 'var(--text-color-secondary)' }} className="p-my-5">Drag and Drop SVG File Here</span>
            </div>
        )
    }

    private headerTemplate(options) {
        [];
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

    private fileContentAsByte: ByteArray;
    private uploadHandler(event) {
        this.fileUploadRef.clear()
        //console.log(event);

        var reader = new FileReader();
        const _this = this;
        reader.onload = function (e) {

            var arrayBuffer: any = this.result;
            _this.fileContentAsByte = new Uint8Array(arrayBuffer);
            //binaryString = String.fromCharCode.apply(null, array);

            //console.log(arrayBuffer);
           _this.m_SelectedFileName = _this.getFileName(event);
            _this.m_SelectedFileExt = _this.getFileNameExt(event);
            _this.FileReady(event.files[0]);
        }
        reader.readAsArrayBuffer(event.files[0]);
    }

    private m_SelectedFileName: string = '';
    public get SelectedFileName(): string {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.m_SelectedFileName;
        } else {
            return this.m_SelectedFileName;
        }
    }
    private m_SelectedFileExt: string = '';
    public get SelectedFileExt(): string {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.m_SelectedFileExt;
        } else {
            return this.m_SelectedFileExt;
        }
    }
    public GetFileContentAsString(): string {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.GetFileContentAsString();
        } else {
            return Encoding.UTF8.GetString(this.fileContentAsByte);
        }
    }

    public GetFileContentAsByteArray(): ByteArray {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            return this.__m_Component__.GetFileContentAsByteArray();
        } else {
            return this.fileContentAsByte;
        }
    }

    public SelectFile(): void {
        if (this.__Mode__ === Modes.Control && this.__m_Component__ != null) {
            this.__m_Component__.SelectFile();
        } else if (this.fileUploadRef != null) {
            this.fileUploadRef.choose();
        }
    }
    public CreateElements(): any {
        const chooseOptions = {};
        chooseOptions['style'] = { display: 'none' }
        return (
            <FileUploadComponent ref={(el) => this.fileUploadRef = el} chooseOptions={chooseOptions} mode="basic" name="demo[]" auto={true} url="" multiple accept={this.AllowedExtensions} maxFileSize={1024 * 1024 * 100}
               emptyTemplate={[]} headerTemplate={this.headerTemplate} customUpload uploadHandler={this.uploadHandler.bind(this)} />
        );
    }
}