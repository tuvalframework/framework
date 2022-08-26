import { Ticker } from '../../../Events/Ticker';
import { EventBusPreProcesser } from "../../../Events/EventBusPreProcess";
import { Keyboard } from "../../../Keyboard/Keyboard";
import { EventBusObject } from "../EventBusObject";
import { Dictionary } from '../../../Collections';
import { int } from '../../../float';
import { is } from '../../../is';

export class TickerPreProcessors extends EventBusPreProcesser {
    private tickers: Dictionary<int, Ticker> = new Dictionary();
    public constructor(eventBus: EventBusObject) {
        super();
        eventBus.registerPreProcesser('ticker', this);
    }
    public process(eventText: string, callback: Function) {
        const tickerNo = parseInt(eventText);
        if (this.tickers.ContainsKey(tickerNo)) {
            const ticker = this.tickers.Get(tickerNo);
            ticker.on('tick', callback);
        } else {
            const ticker = new Ticker('system.ticker.' + tickerNo);
            ticker.framerate = tickerNo;
            ticker.timingMode = Ticker.RAF_SYNCHED;
            ticker.on('tick', callback);
            this.tickers.Add(tickerNo, ticker);
        }
    }
}