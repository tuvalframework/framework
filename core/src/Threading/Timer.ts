/* import { Subject } from "rxjs-compat/Subject";
import 'rxjs-compat/add/operator/switchMap';
import 'rxjs-compat/add/operator/do';
import 'rxjs-compat/add/observable/interval';
import { Observable } from "rxjs-compat/Observable";
import { Type } from "../reflection_/Type";
import { Subscription } from "rxjs-compat/Subscription";
import { DisposableBase } from "../disposable_/DisposableBase";
import { is } from "../is";

export type TimerCallBack = (state: any) => void;
export class Timer extends DisposableBase {
    private subject: Subject<number>;
    private subscription: Subscription;
    constructor(callback: TimerCallBack, state?: any) {
        super();
        this.subject = new Subject<number>();
        this.subscription = this.subject
            .switchMap(period => Observable.interval(period))
            .do(() => {
                if (is.function(callback)) {
                    callback(state);
                }
            })
            .subscribe();
    }

    public change(dueTime: number, period: number): void {
        this.subject.next(period);
    }

    protected _onDispose(): void {
        this.subscription.unsubscribe();
    }
} */