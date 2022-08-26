import { TCompress } from './../../Compress/TCompress';
//import { TimerBinder } from './PreProcessors/TimerBinder';
import { TickerPreProcessors } from './PreProcessors/TickerPreProcesser';
import { KeyboardObject } from './KeyboardObject';
import { GlobalObject } from "./GlobalObject";
import { MouseObject } from "./Mouse";
import { InputObject } from "./InputObject";
import { EventBusObject } from './EventBusObject';
import { KeyboardPreProcessors } from './PreProcessors/KeyboardPreProcessors';
import { RouterBinder } from './PreProcessors/RouterBinder';
import { EnvorimentObject } from './EnvorimentObject';
import { TMath } from '../../Math/TMath';
import { TString } from '../../Extensions';
import { Context } from '../Context';

export const CoreModule: any = {
    /* __init__: [
        "eventBus",
        "global",
        "mouse",
        "input",
        "keyboardPP",
        "tickerPP",
        "timerPP",
        "routerPP"
    ], */
    "eventBus": ["type", EventBusObject],
    "global": ["type", GlobalObject],
    "mouse": ["type", MouseObject],
    "input": ["type", InputObject],
    "keyboard": ["type", KeyboardObject],

    "tickerPP": ["type", TickerPreProcessors],
    //"timerPP": ["type", TimerBinder],
    "routerPP": ["type", RouterBinder],
    "envoriment": ["type", EnvorimentObject],
    "TMath": ["talue", TMath],
    "TString": ["talue", TString],
    "TCompress": ["talue", TCompress]
}

CoreModule.keyboardPP = ["type", KeyboardPreProcessors];

Context.Current.addModules([CoreModule]);
