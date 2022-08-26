import { Context } from '../Context';
import { Thread } from './Thread';

//export * from './Timer';
export * from './ThreadExceptionEventArgs';
export * from './ThreadExceptionEventHandler';
export * from './Thread';
export * from './ThreadWorker';
export * from './ServiceThreadWorker';
export * from './Messages';
export * from './Decorators/Message.Decorator';
export * from './defer';
export * from './tasks_/Parallel';
export * from '../Diagnostics/Stopwatch';
export * from './SynchronizationContext';

export const ThreadingModule = {
    /* __init__: ['eventBus',
        'global',
        'mouse',
        'input',
        'keyboardPP',
        'tickerPP',
        'timerPP',
        'routerPP'
    ], */
    Thread: ['value', Thread],
}

Context.Current.addModules([ThreadingModule]);