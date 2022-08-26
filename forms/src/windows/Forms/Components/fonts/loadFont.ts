import { DomHandler } from "../DomHandler";
import { Convert } from '@tuval/core';


declare var FontFace;

const a = require("./fonts/primeicons.eot");
const f1 = Convert.ToBlobUrl(a, "application/vnd.ms-fontobject");
const f3 = Convert.ToBlobUrl(require("./fonts/primeicons.woff"), "font/woff");
const f4 = Convert.ToBlobUrl(require("./fonts/primeicons.ttf"), "font/ttf");

const tuvalicons_ttf = Convert.ToBlobUrl(require("./fonts/tuvalicons.ttf"), "font/ttf");
const tuvalicons = Convert.ToBlobUrl(require("./fonts/tuvalicons.woff"), "font/woff");

const fonts = {};
fonts['primeicons'] = new FontFace('primeicons', `local('primeicons'), local('primeicons'), url('${f1}?#iefix') format('embedded-opentype'), url('${f3}') format('woff'), url('${f4}') format('truetype')`, { style: 'normal', weight: 400 });
fonts['tuvalicons'] = new FontFace('tuvalicons', `local('tuvalicons'), local('tuvalicons'), url('${tuvalicons}') format('woff'), url('${tuvalicons_ttf}') format('truetype')`, { style: 'normal', weight: 400 });


const css: string = require('./primeicons.css');
DomHandler.addCssToDocument(css);
DomHandler.addCssToDocument(require('./tuvalicons.css'));

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


loadFonts();

//const theme: string = require('./base_theme.css');


//const main: string = require('./main.css');
//const commonCss: string = require('../common/common.css');
//const flex: string = require('./primeflex.css');


//DomHandler.addCssToDocument(theme);


//DomHandler.addCssToDocument(commonCss);

//DomHandler.addCssToDocument(main);
//DomHandler.addCssToDocument(flex);

//export const ControlsCss = require('./bootstrap_controls.css');
//DomHandler.addCssToDocument(ControlsCss);
console.log('font loaded.');

