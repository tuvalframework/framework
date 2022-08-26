import { TVC } from './TVC';
import { IConsoleCommand } from "./Commands/IConsoleCommand";
import { InputConsoleCommand } from "./Commands/InputConsoleCommand";
import { TConsoleManifest } from "./TCOnsoleManifest";
import { ZoneConsoleCommand } from './Commands/ZoneConsoleCommand';
import { float, int } from '../float';
import { Queue } from '../Collections/Generic/Queue';
import { Dictionary } from '../Collections/Generic/Dictionary';
import { CanvasModule } from '../Modulation';
import { Override } from '../Reflection';
import { Convert } from '../convert';
import { Screen } from './Screen';
import { EndLoop, LoopQueue, StartLooConsoleCommand } from './Commands/StartLoopConsoleCommand';
import { Stack } from '../Collections/Generic/Stack';
import { TaskConsoleCommand } from './Commands/TaskConsoleCommand';
import { WaitConsoleCommand } from './Commands/WaitConsoleCommand';
import { WaitPromiseConsoleCommand } from './Commands/WaitPromiseConsoleCommand';
import { WaitNextFrameConsoleCommand } from './Commands/WaitNextFrameConsoleCommand';
import { ExitLoopConsoleCommand, ResetLoopConsoleCommand } from './Commands/ExitLoopConsoleCommand';
import { WaitKeyCommand } from './Commands/WaitKeyCommand';
import { Encoding } from '../Encoding/Encoding';
import { is } from '../is';


export interface IConsoleOptions {
    silence?: boolean;
    width?: int;
    height?: int;
    fullscreen?: boolean,
    parent?: any
}

/// #if WEB
const f1 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.eot"), "application/vnd.ms-fontobject");
const f2 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.woff2"), "font/woff2");
const f3 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.woff"), "font/woff");
const f4 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.ttf"), "font/ttf");
const f5 = Convert.ToBlobUrl(require("../../fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-regular.svg"), "image/svg+xml");
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
fonts['IBM_Plex_Mono_Normal_400'] = new FontFace('IBM Plex Mono', `local('IBM Plex Mono'), local('IBMPlexMono'), url('${f1}?#iefix') format('embedded-opentype'), url('${f2}') format('woff2'), url('${f3}') format('woff'), url('${f4}') format('truetype'), url('${f5}#IBMPlexMono') format('svg')`, { style: 'normal', weight: 400 });
/// #endif


//fonts['IBM_Plex_Mono8'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Italic'), local('IBMPlexMono-Italic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 400 });
//fonts['IBM_Plex_Mono9'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Medium'), local('IBMPlexMono-Medium'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 500 });
//fonts['IBM_Plex_Mono10'] = new FontFace('IBM Plex Mono', " local('IBM Plex Mono Medium Italic'), local('IBMPlexMono-MediumItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-500italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 500 });
//fonts['IBM_Plex_Mono10'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono SemiBold'), local('IBMPlexMono-SemiBold'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 600 });
//fonts['IBM_Plex_Mono11'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Bold'), local('IBMPlexMono-Bold'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700.svg#IBMPlexMono') format('svg')", { style: 'normal', weight: 700 });
//fonts['IBM_Plex_Mono12'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono SemiBold Italic'), local('IBMPlexMono-SemiBoldItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-600italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 600 });
//fonts['IBM_Plex_Mono13'] = new FontFace('IBM Plex Mono', "local('IBM Plex Mono Bold Italic'), local('IBMPlexMono-BoldItalic'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.eot?#iefix') format('embedded-opentype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.woff2') format('woff2'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.woff') format('woff'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.ttf') format('truetype'), url('./fonts/google/ibm-plex-mono-v5-latin-ext_cyrillic_latin_cyrillic-ext-700italic.svg#IBMPlexMono') format('svg')", { style: 'italic', weight: 700 });
class TextTVC extends TVC<Screen> {
    @Override
    public CreateScreen(args: any, tags: any): Screen {
        if (!is.NodeEnvironment()) {
            return new Screen(this, args, tags);
        }
        return null as any;
    }
}

export abstract class ConsoleBase<T extends TVC> extends CanvasModule {
    private root: any;
    private parent: any;
    private contextName: string = undefined as any;
    private manifest: typeof TConsoleManifest;
    public tvc: T = undefined as any;
    private vars: any = undefined as any;
    private procParam$: string = undefined as any;
    private procParam: int = undefined as any;
    private blocks: Function[] = undefined as any;
    public m_MainQueue: Queue<IConsoleCommand>;
    public m_CurrentQueue: Queue<IConsoleCommand>;
    public m_LoopQueue: LoopQueue;
    public m_QueueStack: Stack<any> = null as any;
    public m_ReturnStack: Stack<any> = null as any;
    private m_LastCommand: IConsoleCommand = null as any;
    public Zones: Dictionary<int, ZoneConsoleCommand> = null as any;
    private parentElement: any;
    public constructor(options: IConsoleOptions) {
        super(options?.width ? options?.width : TConsoleManifest.display.width,
            options?.height ? options?.height : TConsoleManifest.display.height,
            options?.silence ? true : false,
            options?.fullscreen != null ? options?.fullscreen : true,
            options?.parent);

        this.parentElement = options?.parent;
        this.m_MainQueue = new Queue();
        this.m_CurrentQueue = this.m_MainQueue;
        this.m_LoopQueue = new LoopQueue();
        this.m_ReturnStack = new Stack();
        this.m_QueueStack = new Stack();
        this.root = this;
        this.parent = this;
        this.contextName = 'application';
        TConsoleManifest.display.width = options?.width ? options?.width : TConsoleManifest.display.width;
        TConsoleManifest.display.height = options?.height ? options?.height : TConsoleManifest.display.height;

        this.manifest = TConsoleManifest;

        this.Zones = new Dictionary();

        // window.addEventListener("load", () => {
        //const pros = this.getFontPromises();

        /// #if WEB

        let navData: any = window.performance.getEntriesByType("navigation");
        if (navData.length > 0 && navData[0].loadEventEnd > 0) {
            this.Run();
        } else {
            window.addEventListener("load", () => {
                this.Run();
            });
        }

        /// #endif
    }

    public abstract CreateTVC(canvas: HTMLCanvasElement, options: any): T;

    @Override
    public PreRun(): void {
        this.loadFonts();
    }
    @Override
    public CallMain(...args: any[]) {
        const options = {
            manifest: this.manifest,
            localTags: JSON.parse(Encoding.UTF8.GetString(Convert.FromBase64String('e30='))),
            globalTags: JSON.parse(Encoding.UTF8.GetString(Convert.FromBase64String('e30='))),
            developerMode: false,
            gotoDirectMode: false,
            parent: this.parentElement
        };
        this.tvc = this.CreateTVC(this.Canvas, options);
        this.vars = (typeof args == 'undefined' ? {} : args);
        this.procParam$ = '';
        this.procParam = 0;
        this.blocks = [];
        this.initBlocks();
        this.tvc.run(this, 0, args);
            /* (window as any) */globalThis.application = this;
    }

    public Kill() {
        this.tvc.stop();
        this.tvc = undefined as any;
    }

    private loadFonts(): void {
        for (var font in fonts) {
            if (fonts.hasOwnProperty(font)) {
                const junction_font = fonts[font];
                this.AddRunDependency(font);

                const resolve = (() => {
                    const _font = font;
                    return (loaded_face) => {
                        (document as any).fonts.add(loaded_face);
                        this.RemoveRunDependency(_font);
                    }
                })();

                const reject = (() => {
                    const _font = font;
                    return (error) => {
                        console.log('Error on load ' + _font + ' : ' + error);
                        this.RemoveRunDependency(_font);
                    }
                })();

                junction_font.load().then(resolve).catch(reject);
            }
        }
    }

    private getFontPromises(): Promise<void>[] {
        const promises: Promise<void>[] = [];
        for (var font in fonts) {
            if (fonts.hasOwnProperty(font)) {
                promises.push(new Promise((resolve, reject) => {
                    const junction_font = fonts[font];
                    junction_font.load().then(function (loaded_face) {
                        (document as any).fonts.add(loaded_face);
                        resolve();
                        //document.body.style.fontFamily = '"Junction Regular", Arial';
                    }).catch(function (error) {
                        // error occurred
                        console.log(error);
                        resolve();
                        //reject();
                    });
                }));
            }
        }
        return promises;
    }
    private m_MouseDown: boolean = false;
    private m_LastZone: ZoneConsoleCommand = null as any;
    private checkZones(tvc: TVC) {
        if (tvc.currentScreen != null) {
            const zoneId = tvc.fp2Int(tvc.currentScreen.hZone2({ x: tvc.xMouse, y: tvc.yMouse }));
            if (zoneId > 0) {
                if (tvc.mouseButtons !== 0) { // down
                    this.m_MouseDown = true;
                } else if (this.m_MouseDown) { // click
                    this.m_MouseDown = false;
                    this.m_LastZone = this.Zones.Get(zoneId);

                    //this.m_ProcessingZoneEvent = true;
                    this.m_LastZone.OnMouseMove('click');
                } else { // move
                    this.m_LastZone = this.Zones.Get(zoneId);
                    this.m_LastZone.OnMouseMove('move');
                }
            } else if (this.m_LastZone != null) {
                this.m_LastZone.OnMouseMove('leave');
                this.m_LastZone = null as any;
            }
        }
    }
    private initBlocks(): void {
        /* this.blocks[0] = (tvc, vars) => {
            // From source: C:/Users/john/Documents/My TVC Applications/Console/Console.tvc
            tvc.sourcePos = "0:0:0";
            //tvc.currentScreen.currentTextWindow.print("Hello World!", true);
            // Do  // Start the second program loop the Do..Loop
            tvc.sourcePos = "0:2:0";
        }; */
        this.blocks[0] = (tvc, vars) => {
            if (this.tvc.pause) {
                return {
                    type: 1,
                    label: 0
                };
            }

            if (this.m_CurrentQueue.Count > 0) {
                this.m_LastCommand = this.m_CurrentQueue.Dequeue();
                if (this.m_LastCommand.IsWaitable()) {
                    (this as any).position = 1; // waiti karşılamaya gönderiyoruz ayarlıyoruz.
                    this.m_ReturnStack.Push({ // karşılayacak bloga nereye geri döneceğini söylüyoruz.
                        type: 1,
                        label: 0
                    });
                }
                if (this.m_LastCommand.IsSubProcess()) {
                    const commandQueue = this.m_LastCommand.GetSubProcessQueue();
                    this.m_QueueStack.Push(this.m_CurrentQueue);
                    this.m_CurrentQueue = commandQueue;
                }
                /* if (this.m_LastCommand instanceof InputConsoleCommand) {
                    this.m_QueueStack.Push(this.m_CurrentQueue);
                    this.m_ReturnStack.Push({
                        type: 1,
                        label: 0
                    });
                } else if (this.m_LastCommand instanceof WaitConsoleCommand) {
                    this.m_ReturnStack.Push({
                        type: 1,
                        label: 0
                    });
                } */
                this.m_LastCommand.Execute(this);
                const retObj = this.m_LastCommand.GetReturnObject();
                if (retObj != null) {
                    return retObj;
                }
            } else {
                if (this.m_QueueStack.Count > 0) {
                    this.m_CurrentQueue = this.m_QueueStack.Pop();
                } else {
                    this.m_CurrentQueue = this.m_MainQueue;
                }
            }

            //Check Zones
            this.checkZones(tvc);

            return {
                type: 1,
                label: 0
            };

        };
        this.blocks[1] = (tvc, vars) => { // input işleme
            if (this.m_LastCommand instanceof InputConsoleCommand) {
                if (this.m_LastCommand.Callback != null) {

                    this.m_LastCommand.Callback(vars['inputVar$']);
                }
            }
            // Loop
            tvc.sourcePos = "0:4:0";
            const returnObject = this.m_ReturnStack.Pop();
            return returnObject;
        };

        this.blocks[10] = (tvc, vars) => { // loop işleme
            // Input "How old are you?";age$
            if (this.m_CurrentQueue.Count > 0) {
                this.m_LastCommand = this.m_CurrentQueue.Dequeue();
                if (this.m_LastCommand.IsWaitable()) {
                    (this as any).position = 1; // waiti karşılamaya gönderiyoruz ayarlıyoruz.
                    this.m_ReturnStack.Push({ // karşılayacak bloga nereye geri döneceğini söylüyoruz.
                        type: 1,
                        label: 0
                    });
                }
                if (this.m_LastCommand.IsSubProcess()) {
                    const commandQueue = this.m_LastCommand.GetSubProcessQueue();
                    this.m_QueueStack.Push(this.m_CurrentQueue);
                    this.m_CurrentQueue = commandQueue;
                }
                this.m_LastCommand.Execute(this);
                const retObj = this.m_LastCommand.GetReturnObject();
                if (retObj != null) {
                    return retObj;
                }
            } else {
                if (this.m_QueueStack.Count > 0) {
                    this.m_CurrentQueue = this.m_QueueStack.Pop();
                }
            }
            return {
                type: 1,
                label: 10
            };
        };

        this.blocks[2] = (tvc, vars) => {
            return {
                type: 0
            }
        };
        this.blocks[3] = (tvc, vars) => {
            return {
                type: 0
            }
        };
    }
    public Task(callback: Function): void {
        this.m_CurrentQueue.Enqueue(new TaskConsoleCommand(this, callback));
    }

    public StartLoop() {
        this.m_CurrentQueue.Enqueue(new StartLooConsoleCommand(this));
    }
    public EndLoop(): void {
        this.m_CurrentQueue.Enqueue(new EndLoop(this));
    }

    public Wait(timeout: float): void {
        this.m_CurrentQueue.Enqueue(new WaitConsoleCommand(this, timeout));
    }
    public WaitP(promise: Promise<any>, callback: Function): void {
        this.m_CurrentQueue.Enqueue(new WaitPromiseConsoleCommand(this, promise, callback));
    }


    public WaitNextFrame(): void {
        this.m_CurrentQueue.Enqueue(new WaitNextFrameConsoleCommand(this));
    }
    public ExitLoop(): void {
        this.m_CurrentQueue.Enqueue(new ExitLoopConsoleCommand(this));
    }
    public ResetLoop(): void {
        this.m_CurrentQueue.Enqueue(new ResetLoopConsoleCommand(this));
    }

    public WaitKey(): void {
        this.m_CurrentQueue.Enqueue(new WaitKeyCommand(this));
    }

    //-----------------Keyboard-----------------------------
    public get Inkey(): string {
        return this.tvc.inkey$()
    }
    public get KeyCode(): int {
        return this.tvc.fp2Int(this.tvc.getScanCode());
    }
    public get KeyStatus(): int {
        return this.tvc.fp2Int(this.tvc.getKeyShift());
    }
    public KeyState(keyCode: int): boolean {
        return this.tvc.getKeyState(keyCode) !== 0;
    }
    //------------------------------------------------------
    public get Timer(): int {
        return this.tvc.getTimer();
    }
}