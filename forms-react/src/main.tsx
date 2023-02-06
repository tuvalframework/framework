
import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from './Form';
import { Label } from './Label';
import { MyController } from './MyController';
import { CssHelper } from './utils/CssHelper';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import 'monday-ui-react-core/dist/main.css';
import { Convert } from '@tuval/core';

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
  const root = ReactDOM.createRoot(
    window.document.body
  );
  const element = (<MyController></MyController>);
  root.render(element);
}