import { TVC } from './TVC';
import { IConsoleCommand } from "./Commands/IConsoleCommand";
import { InputConsoleCommand } from "./Commands/InputConsoleCommand";
import { LocateConsoleCommand } from "./Commands/LocateConsoleCommand";
import { PrintConsoleCommand } from "./Commands/PrintConsoleCommand";
import { TConsoleManifest } from "./TCOnsoleManifest";
import { CentreConsoleCommand } from './Commands/CentreConsoleCommand';
import { ClsConsoleCommand } from './Commands/ClsConsoleCommand';
import { ZoneConsoleCommand } from './Commands/ZoneConsoleCommand';
import { SetPaletteConsoleCommand } from './Commands/SetPaletteConsoleCommand';
import { SetPenConsoleCommand } from './Commands/SetPenConsoleCommand';
import { SetPaperConsoleCommand } from './Commands/SetPaperColorConsoleCommand';
import { SetInkConsoleCommand } from "./Commands/SetInkConsoleCommand";
import { DrawBarConsoleCommand } from './Commands/DrawBarConsoleCommand';
import { ByteArray, float, int } from '../float';
import { Queue } from '../Collections/Generic/Queue';
import { Dictionary } from '../Collections/Generic/Dictionary';
import { TString } from '../Text/TString';
import { InverseConsoleCommand } from './Commands/InverseConsoleCommand';
import { Encoding } from '../Encoding/Encoding';
import { Override, Virtual } from '../Reflection';
import { Convert } from '../convert';
import { SetCursorConsoleCommand } from './Commands/SetCursorConsoleCommand';
import { is } from '../is';
import { Screen } from './Screen';
import { EndLoop, LoopQueue, StartLooConsoleCommand } from './Commands/StartLoopConsoleCommand';
import { Stack } from '../Collections/Generic/Stack';
import { WaitConsoleCommand } from './Commands/WaitConsoleCommand';
import { lazy, LazyValue } from '../LazyValue';
import { TaskConsoleCommand } from './Commands/TaskConsoleCommand';
import { WaitNextFrameConsoleCommand } from './Commands/WaitNextFrameConsoleCommand';
import { ExitLoopConsoleCommand } from './Commands/ExitLoopConsoleCommand';
import { ConsoleBase } from './ConsoleBase';
import { TextTVC } from './TextTVC';
import { DepConsoleCommand } from './Commands/DepConsoleCommand';
import { WaitPromiseConsoleCommand } from './Commands/WaitPromiseConsoleCommand';

/// #if WEB
/* const f1 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.eot"), "application/vnd.ms-fontobject");
const f2 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.woff2"), "font/woff2");
const f3 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.woff"), "font/woff");
const f4 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.ttf"), "font/ttf");
const f5 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.svg"), "image/svg+xml"); */
/// #endif

declare var FontFace;
const fonts = {};
//fonts['Special Elite'] = new FontFace('Special Elite', 'local("Special Elite Regular"), local("SpecialElite-Regular"),url("./fonts/google/special-elite-v10-latin-regular.eot?#iefix") format("embedded-opentype"),url("./fonts/google/special-elite-v10-latin-regular.woff2") format("woff2"),url("./fonts/google/special-elite-v10-latin-regular.woff") format("woff"),url("./fonts/google/special-elite-v10-latin-regular.ttf") format("truetype"),url("./fonts/google/special-elite-v10-latin-regular.svg#SpecialElite") format("svg")', { style: 'normal', weight: 400 });
// fonts['Roboto'] = new FontFace('Roboto', "local('Roboto Thin'), local('Roboto-Thin'),url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-100.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-100.woff') format('woff')", { style: 'normal', weight: 100 });
// fonts['Roboto1'] = new FontFace('Roboto', "local('Roboto Thin Italic'), local('Roboto-ThinItalic'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-100italic.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-100italic.woff') format('woff')", { style: 'italic', weight: 100 });
// fonts['Roboto2'] = new FontFace('Roboto', "local('Roboto Light'), local('Roboto-Light'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-300.woff2') format('woff2'),url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-300.woff') format('woff')", { style: 'normal', weight: 300 });
// fonts['Roboto3'] = new FontFace('Roboto', "local('Roboto Light Italic'), local('Roboto-LightItalic'),url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-300italic.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-300italic.woff') format('woff')", { style: 'italic', weight: 300 });
// fonts['Roboto4'] = new FontFace('Roboto', "local('Roboto-Regular'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-regular.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-regular.woff') format('woff')", { style: 'normal', weight: 400 });
// fonts['Roboto5'] = new FontFace('Roboto', "local('Roboto Medium'), local('Roboto-Medium'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-500.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-500.woff') format('woff')", { style: 'normal', weight: 500 });
// fonts['Roboto6'] = new FontFace('Roboto', "local('Roboto Medium Italic'), local('Roboto-MediumItalic'),url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-500italic.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-500italic.woff') format('woff')", { style: 'italic', weight: 500 });
// fonts['Roboto7'] = new FontFace('Roboto', "local('Roboto Italic'), local('Roboto-Italic'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-italic.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-italic.woff') format('woff')", { style: 'italic', weight: 400 });
// fonts['Roboto8'] = new FontFace('Roboto', "local('Roboto Bold Italic'), local('Roboto-BoldItalic'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-700italic.woff2') format('woff2'),url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-700italic.woff') format('woff')", { style: 'italic', weight: 700 });
// fonts['Roboto9'] = new FontFace('Roboto', "local('Roboto Black'), local('Roboto-Black'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-900.woff2') format('woff2'), url('./fonts/google/roboto-v20-latin-ext_greek-ext_greek_vietnamese_latin_cyrillic_cyrillic-ext-900.woff') format('woff')", { style: 'normal', weight: 900 });
//
//fonts['IBM_Plex_Mono'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Thin'), local('IBMPlexMono-Thin'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 100 });
//fonts['IBM_Plex_Mono1'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Thin Italic'), local('IBMPlexMono-ThinItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100italic.eot?#iefix') format('embedded-opentype'),url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-100italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 100 });
//fonts['IBM_Plex_Mono2'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono ExtraLight'), local('IBMPlexMono-ExtraLight'),url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200.eot?#iefix') format('embedded-opentype'),url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 200 });
//fonts['IBM_Plex_Mono4'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono ExtraLight Italic'), local('IBMPlexMono-ExtraLightItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-200italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 200 });
//fonts['IBM_Plex_Mono5'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Light'), local('IBMPlexMono-Light'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 300 });
//fonts['IBM_Plex_Mono6'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Light Italic'), local('IBMPlexMono-LightItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-300italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 300 });

/// #if WEB
//fonts['IBM_Plex_Mono_Normal_400'] = new FontFace('IBM Plex Mono', `local('IBM Plex Mono'), local('IBMPlexMono'), url('${f1}?#iefix') format('embedded-opentype'), url('${f2}') format('woff2'), url('${f3}') format('woff'), url('${f4}') format('truetype'), url('${f5}#IBMPlexMono') format('svg')`, { style: 'normal', weight: 400 });
/// #endif

//fonts['IBM_Plex_Mono8'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Italic'), local('IBMPlexMono-Italic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 400 });
//fonts['IBM_Plex_Mono9'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Medium'), local('IBMPlexMono-Medium'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 500 });
//fonts['IBM_Plex_Mono10'] = new FontFace('IBM Plex Mono', " local('IBM Plex Mono Medium Italic'), local('IBMPlexMono-MediumItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 500 });
//fonts['IBM_Plex_Mono10'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono SemiBold'), local('IBMPlexMono-SemiBold'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 600 });
//fonts['IBM_Plex_Mono11'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Bold'), local('IBMPlexMono-Bold'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 700 });
//fonts['IBM_Plex_Mono12'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono SemiBold Italic'), local('IBMPlexMono-SemiBoldItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 600 });
//fonts['IBM_Plex_Mono13'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Bold Italic'), local('IBMPlexMono-BoldItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 700 });


export class TextConsole<T extends TextTVC> extends ConsoleBase<T> {

    @Virtual
    public CreateTVC(canvas: HTMLCanvasElement, options: any): T {
        return new TextTVC(this.Canvas, options) as any;
    }


    public Write();
    public Write(value: any);
    public Write(str: string, ...args: any[]);
    public Write(str: LazyValue<string>, ...args: any[]);
    public Write(...args: any[]) {
        if (args.length === 0) {
            const value: any = lazy("\n");
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, false, value, null as any));
        } else if (args.length === 1) {
            const value: LazyValue<any> = lazy(args[0]);
            // const text = TString.ToString(value);
            // const splited = text.split('\n');
            // for (let i = 0; i < splited.length; i++) {
            if (args[0] === '\n') {
                this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, true, lazy(''), null as any));
            } else {
                this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, false, value, null as any));
            }
            // }
        } else if (args.length > 1 && typeof args[0] === 'string') {
            const str: LazyValue<string> = lazy(args[0]);
            const _args: any[] = args.slice(1, arguments.length);
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, false, str, _args));
        } else if (args.length > 1 && is.lazy<string>(args[0])) {
            const str: LazyValue<string> = args[0];
            const _args: any[] = args.slice(1, arguments.length);
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, false, str, _args));
        }
    }

    public WriteLine();
    public WriteLine(value: any);
    public WriteLine(str: string, ...args: any[]);
    public WriteLine(str: LazyValue<string>, ...args: any[]);
    public WriteLine(...args: any[]) {
        if (args.length === 0) {
            const value: any = lazy("\n");
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, true, value, null as any));
        } else if (args.length === 1) {
            const value: LazyValue<any> = is.lazy(args[0]) ? args[0] : lazy(args[0]);
            // const text = TString.ToString(value);
            // const splited = text.split('\n');
            // for (let i = 0; i < splited.length; i++) {
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, true, value, null as any));
            // }
        } else if (args.length > 1 && typeof args[0] === 'string') {
            const str: LazyValue<string> = lazy(args[0]);
            const _args: any[] = args.slice(1, arguments.length);
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, true, str, _args));
        } else if (args.length > 1 && is.lazy<string>(args[0])) {
            const str: LazyValue<string> = args[0];
            const _args: any[] = args.slice(1, arguments.length);
            this.m_CurrentQueue.Enqueue(new PrintConsoleCommand(this, true, str, _args));
        }
    }

    public WriteHex(b: ByteArray) {
        const self = this;
        function hex(d) {
            let array;
            if (Object(d).buffer instanceof ArrayBuffer) {
                array = new Uint8Array(d.buffer);
            } else if (typeof d === 'string') {
                array = Encoding.UTF8.GetBytes(d); // new(TextEncoder('utf-8')).encode(d);
            } else {
                array = new Uint8ClampedArray(d);
            }
            for (let i = 0; i < array.length; i++) {
                if (i % 16 === 0) {
                    printLineNumber((i as any).toString(16).padStart(6, 0) + '  ');
                } else {
                    printLineNumber(' ');
                }

                printValue(array[i].toString(16).padStart(2, 0));
                /*  if ((i === array.length - 1 || i % 16 === 15)) {
                     printSpace(' '.repeat((15 - i % 16) * 3));
                 } */

                if ((((i % 16) + 1) === 16) || (((array.length - i) < 16) && ((i % 16) + 1 === ((array.length % 16))))) {
                    printValue(' '.repeat((16 - (i % 16)) * 3));
                    const tempArray: any[] = Array.from(array).splice(i - i % 16, 16);
                    let tempValue = '';
                    for (let k = 0; k < tempArray.length; k++) {
                        tempValue += (tempArray[k] > 31 && tempArray[k] < 127 || tempArray[k] > 159 ? String.fromCharCode(tempArray[k]) : '.');
                    }
                    tempValue += '  ';

                    printText(tempValue);
                }

            }
        }

        function printLineNumber(text) {
            self.Write(text);
        }

        function printValue(text) {
            self.Write(text.toUpperCase());
        }

        function printSpace(text) {
            console.log(text);
        }

        function printText(text) {
            self.Inverse(true);
            self.WriteLine(text);
            self.Inverse(false);
        }

        hex(b);
    }

    public ReadLine(text: string, callback?: Function): void {
        //return new Promise<string>((resolve, reject) => {
        this.m_CurrentQueue.Enqueue(new InputConsoleCommand(this, text, (input) => {
            if (is.function(callback)) {
                callback(input);
            }
        }));
        // });
    }
    public Locate(x: int, y: int): this {
        this.m_CurrentQueue.Enqueue(new LocateConsoleCommand(this, x, y));
        return this;
    }
    public Center(text: string):this {
        this.m_CurrentQueue.Enqueue(new CentreConsoleCommand(this, text));
        this.WriteLine('');
        return this;
    }
    public Clear(color?: int): this {
        this.m_CurrentQueue.Enqueue(new ClsConsoleCommand(this, color));
        return this;
    }
    public Region(text: string, callback: Function) {
        this.m_CurrentQueue.Enqueue(new ZoneConsoleCommand(this, text, callback));
    }
    public SetPalette(colors: Array<int>) {
        this.m_CurrentQueue.Enqueue(new SetPaletteConsoleCommand(this, colors));
    }
    public Pen(color: int): this {
        this.m_CurrentQueue.Enqueue(new SetPenConsoleCommand(this, color));
        return this;
    }
    public Paper(color: int): this {
         this.m_CurrentQueue.Enqueue(new SetPaperConsoleCommand(this, color));
         return this;
    }
    public Ink(color: int): this {
        this.m_CurrentQueue.Enqueue(new SetInkConsoleCommand(this, color));
        return this;
    }
    public DrawBar(x: int, y: int, width: int, height: int) {
        this.m_CurrentQueue.Enqueue(new DrawBarConsoleCommand(this, x, y, width, height));
    }
    public Inverse(turnOn: boolean) {
        this.m_CurrentQueue.Enqueue(new InverseConsoleCommand(this, turnOn));
    }
    public SetCursor(on: boolean): void {
        this.m_CurrentQueue.Enqueue(new SetCursorConsoleCommand(this, on));
    }


    public Dep(isDep: boolean) {
        if (isDep) {
            this.m_CurrentQueue.Enqueue(new DepConsoleCommand(this));
        } else {
            this.tvc.ReleaseDep();
        }
    }


}

//export const TVConsole = new TConsole();