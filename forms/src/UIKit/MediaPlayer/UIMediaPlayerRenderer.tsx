import { foreach, StringBuilder, TString, is } from '@tuval/core';

import { ControlHtmlRenderer } from '../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { Teact } from '../../windows/Forms/Components/Teact';
import { MediaPlayerComponent } from '../../windows/Forms/Components/video';

import { UIMediaPlayerClass } from './UIMediaPlayerClass';

//console.log('AA_BB');
/* DomHandler.addCssToDocument(require('../Components/autocomplete/AutoComplete.css'));
DomHandler.addCssToDocument(require('../Components/autocomplete/Theme.css')); */

export class UIMediaPlayerRenderer extends ControlHtmlRenderer<UIMediaPlayerClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UIMediaPlayerClass, sb: StringBuilder): void {
        sb.AppendLine(`
         video {
            object-fit: fill !important;
         }
         .tuval-mediaplayer {
            background-repeat: no-repeat;
            /* background-attachment: fixed; */
            background-position: center;
        }

        .tuval-mediaplayer>.logo {
            -webkit-tap-highlight-color: transparent;
            -webkit-text-size-adjust: 100%;
            text-rendering: optimizeSpeed;
            font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Roboto", "Ubuntu", "Helvetica Neue", sans-serif;
            font-size: 1rem;
            line-height: 1.5;
            font-style: normal;
            font-weight: 400;
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            border: 0;
            vertical-align: baseline;
            touch-action: manipulation;
            display: block;
            position: absolute;
            top: 1.25rem;
            right: 1.25rem;
            z-index: 3;
            height: 32px;
        }
         `);

    }

    public GenerateElement(obj: UIMediaPlayerClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: UIMediaPlayerClass): void {
        const style = {};

        style['backgroundColor'] = 'black';
        style['height'] = obj.Appearance.Height;
        style['backgroundImage'] = TString.Format("url('{0}'", obj.vp_PreviewImage);


        this.WriteComponent(
            <div class='tuval-mediaplayer' style={style}>
                <a href="" class="logo">
                    <img src={obj.vp_Logo} style="height: 64px; width: auto;" /></a>
                <MediaPlayerComponent playing={obj.vp_Playing} controls={true} style={{ height: obj.Appearance.Height }} url={obj.vp_Url} light={true}
                    onProgress={(value) => is.function(obj.vp_OnProgress) ? obj.vp_OnProgress(value) : void 0}
                    onEnded={(value) => is.function(obj.vp_OnEnded) ? obj.vp_OnEnded(value) : void 0} />
            </div>
        )
    }
}