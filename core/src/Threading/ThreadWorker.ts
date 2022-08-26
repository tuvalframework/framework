import { EventProcessor } from "../Events/EventBusPreProcess";
import { Thread, ThreadEvents, IMessage } from "./Thread";
import { int } from "../float";
import { GEventBus } from "../Events/GEventBus";
import { Context } from "../Context/Context";
import { Allocator, SystemHeap, updateGlobalBufferAndViews } from "../IO/Internals/Memory";
import { TBuffer } from "../IO/Buffer/TBuffer";
import { IPC } from "./Messages";
import { Virtual } from "../Reflection/Decorators/ClassInfo";
import { ThreadArrayBuffer } from "./ThreadBuffer";
import { CultureInfo } from "../Globalization/CultureInfo";
import { is } from "../is";

const MFT_SET_HEAP = -2;
const MFT_LOG_HEAP = -3;

const MFT_SETTHREADHEAP = -4;
const MTT_SETWORKERHEAP = -5;

class ThreadEventProcessor extends EventProcessor {
    private m_Worker: ThreadWorker;
    public constructor(thread: ThreadWorker) {
        super();
        this.m_Worker = thread;
    }
    public fire(event: int, eventArgs: any) {
        const message: IMessage<int> = {
            Msg: event,
            params: eventArgs.params/* ,
            lParam: eventArgs.lParam */
            // Heap: (this.m_Worker as any).m_HeapBuffer
        };
        this.m_Worker.Worker.postMessage(message);
    }
}

export function ThreadWorkerObject<T extends { new(...args: any[]): {} }>(constructor: T) {
    /* const hobbit = new Hobbit()

    const { width, height, weight, armour, type} = hobbit

    return class extends constructor {
        width = width
        height = height
        weight = weight
        armour = armour
        type = type
    } */
    const globalObject = self;/* Context.Current.get('global') */;
    if (globalObject) {
        globalObject["ThreadWorker"] = constructor;
    }
}


const useSharedMemory = true;
export class ThreadWorker {
    private m_MessageCallbacks: Array<Function> = [];
    public Worker: Worker = self as any;
    private m_WriteHeap: ArrayBuffer = null as any;
    private m_MemoryManager: Allocator = null as any;
    private m_WriteBuffer: TBuffer = null as any;
    private m_ReadHeap: ArrayBuffer = null as any;
    private m_ReadBuffer: TBuffer = null as any;

    private m_CurrentUICulture: CultureInfo = null as any;
    public get CurrentUICulture(): CultureInfo {
        return this.m_CurrentUICulture;
    }

    public set CurrentUICulture(value: CultureInfo) {
        this.m_CurrentUICulture = value;
    }

    private m_CurrentCulture: CultureInfo = null as any;
    public get CurrentCulture(): CultureInfo {
        return this.m_CurrentCulture;
    }

    public set CurrentCulture(value: CultureInfo) {
        this.m_CurrentCulture = value;
    }

    private m_EventBus: GEventBus;
    constructor() {

        console.log('ThreadWorker contructor');
        this.m_EventBus = new GEventBus();
        const workerEventProcessor = new EventProcessor();
        this.m_EventBus.registerProcessor(Thread.WORKERID, workerEventProcessor);
        const threadEventProcessor = new ThreadEventProcessor(this);
        this.m_EventBus.registerProcessor(Thread.THREADID, threadEventProcessor);
        console.log('attachMessageParser giriyor');
        this.attachMessageParser();
        /* self.onmessage = (m: any) => {
            this.ThreadMsg(m.data.messageId, m.data.args);
        } */

        // this.fire(ThreadEvents.STARTED, { wParam: 0, lParam: 0 }); // buna gerek yok, thread oluştururrken çağırıyor.
        const memory = new ThreadArrayBuffer(1024 * 1024);

        this.m_WriteHeap = memory;
        if (useSharedMemory) {
            this.setupSharedMemory();
        } else {
            this.setupMemory();
        }

        /*  this.on(MFT_SET_HEAP, (heap: SharedArrayBuffer)=>{
             this.m_HeapBuffer = heap;
             console.log('----------Heap Ayarlandı.--------------');
         }); */
        this.on(MFT_LOG_HEAP, () => {
            //console.log(SystemHeap);
        });
        // debugger;
        this.m_MessageCallbacks = this.RetriveMessageCallbacks();

    }

    private RetriveMessageCallbacks(): Array<Function> {
        throw new Error('RetriveMessageCallbacks');
    }

    private setupSharedMemory() {

        //this.m_MemoryManager = new Allocator(this.m_WriteHeap as any);
        //this.m_WriteBuffer = new TBuffer(this.m_WriteHeap as any);
        updateGlobalBufferAndViews(this.m_WriteHeap as any);
        /*  console.log('Worker Heap');
         console.log(this.m_WriteHeap); */
        this.fire(IPC.SETREADHEAP, { wParam: this.m_WriteHeap, lParam: 0 });

        this.on(IPC.SETREADHEAP, (event) => {
            this.m_ReadHeap = event.wParam;
            this.m_ReadBuffer = new TBuffer(this.m_ReadHeap as any);
        });
    }
    private setupMemory() {
        updateGlobalBufferAndViews(this.m_WriteHeap as any);
    }

    public on(event: int, callback: Function) {
        this.m_EventBus.on(Thread.WORKERID, event, callback);
    }
    public fire(event: int, eventArgs: any) {
        this.m_EventBus.fire(Thread.THREADID, event, eventArgs);
    }
    private attachMessageParser() {
        this.Worker.onmessage = (event: MessageEvent) => {
            debugger;
            let { Msg, params }: IMessage<any> = event.data;
            if (params == null) {
                params = [];
            }
            //this.m_HeapBuffer = event.data.Heap;
            this.m_EventBus.fire(Thread.WORKERID, Msg  /* action yok */, { params: params });
            this.PreProcessMessage(Msg, ...params);
        }
        this.Worker.onerror = (event) => { console.error(event); }

        return this;
    }
    public SendMessage(message: int, ...params: any[]): void {
        this.fire(message, { params: params });
    }
    @Virtual
    public WorkerProc(msg: int, ...params: any[]) {
        if (this.m_MessageCallbacks && this.m_MessageCallbacks[msg] !== undefined) {
            const func = this.m_MessageCallbacks[msg].bind(this);
            const returnValue = func(...params);
            if (is.Promise(returnValue)) {
                returnValue.then(result => this.SendMessage(msg, result, 0));
            } else {
                this.SendMessage(msg, returnValue, 0);
            }
        }
    }

    @Virtual
    public PreProcessMessage(msg: int, ...params: any[]) {
        this.WorkerProc(msg, ...params);
    }

    public GetHashCode(): int {
        return 0;
    }
}