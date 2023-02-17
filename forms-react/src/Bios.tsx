import { UIController } from "./UIController";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { LayoutController } from "./LayoutController";
import { Convert } from "@tuval/core";

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




export function StartBios(biosController: any) {
  //loadFonts();
//  if (biosController) {
    const root = ReactDOM.createRoot(window.document.body).render(
      <BrowserRouter>
        {React.createElement(biosController)}
      </BrowserRouter>
    );
/*   } else {
    const root = ReactDOM.createRoot(window.document.body).render(
      <BrowserRouter>
        <LayoutController />
      </BrowserRouter>
    );
  } */
}