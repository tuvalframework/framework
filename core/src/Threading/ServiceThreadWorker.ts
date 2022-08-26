import { Context } from "../Context/Context";
import { EventProcessor } from "../Events/EventBusPreProcess";
import { GEventBus } from "../Events/GEventBus";
import { int } from "../float";
import { TBuffer } from "../IO/Buffer/TBuffer";
import { Allocator, SystemHeap, updateGlobalBufferAndViews } from "../IO/Internals/Memory";
import { Dictionary } from './../Collections/Generic/Dictionary';
import { IPC } from "./Messages";
import { IMessage, Thread, ThreadEvents } from "./Thread";
import { ThreadArrayBuffer } from "./ThreadBuffer";
import { Message } from './Decorators/Message.Decorator';
import { Virtual } from "../Reflection/Decorators/ClassInfo";

const MFT_SET_HEAP = -2;
const MFT_LOG_HEAP = -3;

const MFT_SETTHREADHEAP = -4;
const MTT_SETWORKERHEAP = -5;

const ISC_SETPORT = 900;

export interface IServiceMessage<T> {
    Msg: int;
    clientId: string;
    wParam: T;
    lParam: T
    //Heap: ArrayBuffer
}

class ServiceThreadEventProcessor extends EventProcessor {
    private m_Worker: ServiceThreadWorker;
    public constructor(thread: ServiceThreadWorker) {
        super();
        this.m_Worker = thread;
    }
    public fire(event: int, eventArgs: any) {
        const message: IMessage<int> = {
            Msg: event,
            params: eventArgs.params,
           /*  lParam: eventArgs.lParam */
            // Heap: (this.m_Worker as any).m_HeapBuffer
        };
        this.m_Worker.Worker.postMessage(message);
    }
}

export function ServiceThreadWorkerObject<T extends { new(...args: any[]): {} }>(constructor: T) {
    /* const hobbit = new Hobbit()

    const { width, height, weight, armour, type} = hobbit

    return class extends constructor {
        width = width
        height = height
        weight = weight
        armour = armour
        type = type
    } */
    const globalObject = Context.Current.get('global');
    if (globalObject) {
        globalObject["ThreadWorker"] = constructor;
    }
}


const useSharedMemory = true;
export class ServiceThreadWorker {
    public Clients: Dictionary<string, MessagePort> = new Dictionary();
    private m_MessageCallbacks: Array<Function> = [];
    public Worker: Worker = self as any;
    private m_WriteHeap: ArrayBuffer = null as any;
    private m_MemoryManager: Allocator = null as any;
    private m_WriteBuffer: TBuffer = null as any;
    private m_ReadHeap: ArrayBuffer = null as any;
    private m_ReadBuffer: TBuffer = null as any;

    private m_EventBus: GEventBus;
    constructor() {
        this.m_EventBus = new GEventBus();
        const workerEventProcessor = new EventProcessor();
        this.m_EventBus.registerProcessor(Thread.WORKERID, workerEventProcessor);
        const serviceThreadEventProcessor = new ServiceThreadEventProcessor(this);
        this.m_EventBus.registerProcessor(Thread.THREADID, serviceThreadEventProcessor);
        this.attachMessageParser();
        /* self.onmessage = (m: any) => {
            this.ThreadMsg(m.data.messageId, m.data.args);
        } */
        //this.fire(ThreadEvents.STARTED, { wParam: 0, lParam: 0 });
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
        /* console.log('Worker Heap');
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
            const message: IMessage<any> = event.data;
            //this.m_HeapBuffer = event.data.Heap;

            this.m_EventBus.fire(Thread.WORKERID, message.Msg  /* action yok */, { params: message.params });
            this.PreProcessMessage(message.Msg, ...message.params/* , message.lParam */);
        }
        this.Worker.onerror = (event) => { console.error(event); }

        return this;
    }
    private attachPortOnMessage(port: MessagePort) {
        port.onmessage = (event: MessageEvent) => {
            const message: IServiceMessage<any> = event.data;
            //this.m_HeapBuffer = event.data.Heap;

            this.m_EventBus.fire(Thread.WORKERID, message.Msg  /* action yok */, { clientId: message.clientId, wParam: message.wParam, lParam: message.lParam });
            this.PreProcessPortMessage(message.Msg, message.clientId, message.wParam, message.lParam);
        }
        port.onmessageerror = (event) => { console.error(event); }

        return this;
    }
    public SendMessage(message: int, wParam: int, lParam: int): void {
        this.fire(message, { wParam: wParam, lParam: lParam });
    }

    public SendMessageToClient(message: int, clientId: string, ...params:any[]): void {
        const msg: IMessage<int> = {
            Msg: message,
            params: params,
            /* lParam: lParam */
            // Heap: (this.m_Worker as any).m_HeapBuffer
        };
        const port = this.Clients.Get(clientId);
        port.postMessage(msg);
    }

    @Virtual
    public WorkerProc(msg: int, ...params:any[]) {
        if (this.m_MessageCallbacks[msg] !== undefined) {
            this.m_MessageCallbacks[msg].apply(this, ...params);
        }
    }
    @Message(ISC_SETPORT)
    public Isc_SetPort(port: MessagePort, clientId: string) {
        this.Clients.Add(clientId, port);
        this.attachPortOnMessage(port);
    }

    @Virtual
    public PreProcessMessage(msg: int, ...params: any[]) {
        this.WorkerProc(msg,...params);
    }
    @Virtual
    public PreProcessPortMessage(msg: int, clientId: string, wParam: number, lParam: number) {
        this.ClientProc(msg, clientId, wParam, lParam);
    }
    @Virtual
    public ClientProc(msg: int, clientId: string, wParam: number, lParam: number) {
        if (this.m_MessageCallbacks[msg] !== undefined) {
            this.m_MessageCallbacks[msg].call(this, clientId, wParam, lParam);
        }
    }
}