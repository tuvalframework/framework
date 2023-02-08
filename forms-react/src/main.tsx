
import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/global.scss';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';

import 'primeflex/primeflex.css';

import { Convert } from '@tuval/core';
import 'monday-ui-react-core/dist/main.css';
import { LayoutController } from './LayoutController';

import {
  BrowserRouter, createBrowserRouter, Link
} from "react-router-dom";

declare var FontFace;

//const a = require("./fonts/primeicons.eot");
const f1 = Convert.ToBlobUrl(require("primeicons/fonts/primeicons.eot"), "application/vnd.ms-fontobject");
const f3 = Convert.ToBlobUrl(require("primeicons/fonts/primeicons.woff"), "font/woff");
const f4 = Convert.ToBlobUrl(require("primeicons/fonts/primeicons.woff2"), "font/woff2");

const fonts = {};
fonts['primeicons'] = new FontFace('primeicons', `local('primeicons'), local('primeicons'), url('${f1}?#iefix') format('embedded-opentype'), url('${f3}') format('woff'), url('${f4}') format('truetype')`, { style: 'normal', weight: 400 });


function loadFonts(): void {
  for (var font in fonts) {
    if (fonts.hasOwnProperty(font)) {
      const junction_font = fonts[font];
      const resolve = (() => {
        const _font = font;
        return (loaded_face) => {
          (document as any).fonts.add(loaded_face);
        }
      })();

      const reject = (() => {
        const _font = font;
        return (error) => {
          console.log('Error on load ' + _font + ' : ' + error);

        }
      })();

      junction_font.load().then(resolve).catch(reject);
    }
  }
}




export function StartApp() {
  loadFonts();

  const root = ReactDOM.createRoot(window.document.body).render(
    <BrowserRouter>
      <LayoutController />
    </BrowserRouter>
  );



  /*   const element = (<Application name="testapp" controller={MyController}></Application>);
    root.render(element);*/
}