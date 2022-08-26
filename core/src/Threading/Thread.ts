import { Event } from './../Event'
import { EventBus } from '../Events/EventBus'
import { TString } from '../Text/TString'
import { Http } from '../Net/httpDo'
import { GEventBus } from '../Events/GEventBus'
import { int } from '../float'
import { EventProcessor } from '../Events/EventBusPreProcess'
import { TStorage } from '../Storage/TStorage'
import { parseClassName } from '../Context/Annotation'
import { Delegate } from '../Delegate'
import { Virtual } from '../Reflection/Decorators/ClassInfo'
import { TBuffer } from '../IO/Buffer/TBuffer'
import { IPC } from './Messages'
import { url } from 'inspector'
import { ThreadArrayBuffer } from './ThreadBuffer'
import { ThreadWorker } from './ThreadWorker'
import { is } from '../is'
import { CultureInfo } from '../Globalization/CultureInfo'
import { Allocator, updateGlobalBufferAndViewsEx } from '../IO/Internals/Memory'

type WPARAM = number
type LPARAM = number
type LRESULT = number
export enum ThreadEvents {
  LOADED = 0,
  STARTED = 1
}

const MTW_FORCE_TO_START = -1
const MTW_SET_HEAP = -2
const MTW_LOG_HEAP = -3

const ISC_SETSERVICE = 901

//const MTW_SETTHREADHEAP = -4;
const MFW_SETWORKERHEAP = -5

const useSharedMemory = true

export interface IMessage<T> {
  Msg: int
  params: any[]
  //Heap: ArrayBuffer
}

class WorkerEventProcessor extends EventProcessor {
  private m_Thread: Thread
  public constructor(thread: Thread) {
    super()
    this.m_Thread = thread
  }
  public fire(event: int, args: any) {
    const message: IMessage<int> = {
      Msg: event,
      params: args.params
      //lParam: args.lParam
      //Heap: (this.m_Thread as any).m_HeapBuffer
    }
    /* if (typeof message?.StrParam?.buffer !== 'undefined') {
            this.m_Thread.Worker.postMessage(message, [message.args.buffer]);
        } else { */
    this.m_Thread.Worker.postMessage(message /* ,[(this.m_Thread as any).m_HeapBuffer] */)
    //}
  }
}

export class ThreadEventDelegate extends Delegate<() => void> { }

export class Thread {
  public static urls: string[]
  public static readonly THREADID: int = 0
  public static readonly WORKERID: int = 1
  public static get CurrentThread(): ThreadWorker {
    if (is.workerContext()) {
      return Thread['m_CurrentThread']
    } else {
      //throw new Error('CurrentThread can use only in Worker COntext');
      if (Thread['m_CurrentThread'] === undefined) {
        Thread['m_CurrentThread'] = {
          GetHashCode: function (): int {
            return 0
          }
        } as any
      }
      return Thread['m_CurrentThread']
    }
  }
  public static set CurrentThread(value: ThreadWorker) {
    if (is.workerContext()) {
      Thread['m_CurrentThread'] = value
    } else {
      //throw new Error('CurrentThread can use only in Worker COntext');
      Thread['m_CurrentThread'] = value
    }
  }

  public static readonly TM_LOADING: int = 0
  private m_WorkerUrl: string = TString.Empty
  private m_WorkerScript: string = TString.Empty
  private m_WorkerBlobUrl: string = TString.Empty
  private m_Worker: Worker = undefined as any
  private m_Loading: boolean = false
  private m_Loaded: boolean = false
  private m_EventBus: GEventBus
  private m_WriteHeap: ArrayBuffer = null as any
  private m_MemoryManager: Allocator = null as any
  private m_WriteBuffer: TBuffer = null as any

  protected m_ReadHeap: ArrayBuffer = null as any
  protected m_ReadBuffer: TBuffer = null as any

  public OnThreadLoadingEvent: Event<ThreadEventDelegate> = new Event()
  public OnThreadLoadedEvent: Event<ThreadEventDelegate> = new Event()
  public OnThreadStatingEvent: Event<ThreadEventDelegate> = new Event()
  public OnThreadStartedEvent: Event<ThreadEventDelegate> = new Event()

  public get EventBus(): GEventBus {
    return this.m_EventBus
  }
  public get Worker(): Worker {
    return this.m_Worker
  }
  public constructor(workerUrl: string, private workerObjectStr?: string) {
    this.m_WorkerUrl = workerUrl
    this.m_EventBus = new GEventBus()
    const threadEventProcessor = new EventProcessor()
    this.m_EventBus.registerProcessor(Thread.THREADID, threadEventProcessor)
    const workerEventProcessor = new WorkerEventProcessor(this)
    this.m_EventBus.registerProcessor(Thread.WORKERID, workerEventProcessor)

    const memory = new ThreadArrayBuffer(1024 * 1024)
    this.m_WriteHeap = memory

    this.setupSharedMemory()

    this.OnThreadLoadingEvent.add(new ThreadEventDelegate(this.OnThreadLoading.bind(this)))
    this.OnThreadLoadedEvent.add(new ThreadEventDelegate(this.OnThreadLoaded.bind(this)))
    this.OnThreadStatingEvent.add(new ThreadEventDelegate(this.OnThreadStarting.bind(this)))
    this.OnThreadStartedEvent.add(new ThreadEventDelegate(this.OnThreadStarted.bind(this)))

    /* TStorage.SaveFile('tuval-core-wp.js', 'tuval-core-wp').then(() => {
            console.log('tuval-core-wp is cached.');
        }); */
  }
  private setupSharedMemory() {
    //this.m_MemoryManager = new Allocator(this.m_WriteHeap);
    //this.m_WriteBuffer = new TBuffer(this.m_WriteHeap);
  }
  private createWorker() {
    this.m_Worker = new Worker(this.m_WorkerBlobUrl)
    this.attachMessageParser()
    return this
  }
  public on(event: int, callback: Function) {
    this.m_EventBus.on(Thread.THREADID, event, callback)
  }
  public fire(event: int, eventArgs: any) {
    this.m_EventBus.fire(Thread.WORKERID, event, eventArgs)
  }
  private initDeps(): Promise<Array<string>> {
    if (Thread.urls !== undefined) {
      return new Promise((resolve, reject) => {
        resolve(Thread.urls)
      })
    } else {
      return Promise.all([
        TStorage.GetFile('tuval-core-wp')/* ,
        TStorage.GetFile('tuval-core-graphics-wp'),
        TStorage.GetFile('tuval-graphics-wp') */
      ])
    }
  }

  // Kullanıcı tarafından çağrılır.
  public start() {
    if (!this.m_Loaded) {
      this.load().then(() => {
        this.OnThreadStatingEvent()
        this.SendMessage(IPC.FORCETOWORKERSTART, 0, 0)
        // Start olduktan sonra belleği ayarlıyoruz.
        //this.fire(MTW_SET_HEAP, this.m_WriteHeap);
        if (useSharedMemory) {
          this.fire(IPC.SETREADHEAP, { wParam: this.m_WriteHeap, lParam: 0 })
        }
      })
    } else {
      this.OnThreadStatingEvent()
      this.SendMessage(IPC.FORCETOWORKERSTART, 0, 0)
      // Start olduktan sonra belleği ayarlıyoruz.
      //this.fire(MTW_SET_HEAP, this.m_WriteHeap);
      if (useSharedMemory) {
        this.fire(IPC.SETREADHEAP, { wParam: this.m_WriteHeap, lParam: 0 })
      }
    }
  }
  public SendMessage(message: int, ...params: any[]/* wParam: int, lParam: int */): void {
    this.fire(message, { params: params })
  }
  public PostMessage(message: int, wParam: any, lParam: any, transferArr: any[]): void {
    this.m_Worker.postMessage(
      {
        Msg: message,
        wParam: wParam,
        lParam: lParam
      },
      transferArr
    )
  }
  public RegisterService(serviceName: string, port: MessagePort) {
    this.PostMessage(ISC_SETSERVICE, serviceName, port, [port])
  }
  public load(): Promise<Thread> {
    return new Promise((resolve, reject) => {
      if (this.m_Loading || this.m_Loaded) {
        return self
      }
      this.m_Loading = true
      this.m_EventBus.fire(Thread.THREADID, Thread.TM_LOADING, { wParam: this })
      this.OnThreadLoadingEvent()

      const onScriptLoaded = () => {
        this.initDeps().then((urls: string[]) => {
          Thread.urls = urls
          let blob: Blob
          let scriptContents: string = TString.Empty

          let imports = ''
          let urlLinks = ''
          urls.forEach(url => {
            urlLinks += `'${url}',`
          })
          imports += ` debugger;
          importScripts(${urlLinks});
                    `
          if (this.workerObjectStr != null) {
            const className = parseClassName(this.workerObjectStr)
            scriptContents = `
                            ${imports}
                            ${this.workerObjectStr}
                            const classInstance = new ${className}();
                            classInstance.start();
                        `
          } else {
            /*  scriptContents = `
                          ${imports}
                          ${this.m_WorkerScript}
                          self.postMessage({
                             action: 1,
                             args: { x: 100, y: 400 }
                         });
                          `; */

            scriptContents = `
                        ${imports}
                        (function() {
                        const _Assembly = {
                        start : function () {

                            ${this.m_WorkerScript}

                            //----------------------------------------------
                            //Resource Section
                            tuval$core.Assembly.Resources = [{
                                culture: 'tr-TR',
                                resources: [{
                                name: 'DateStrings',
                                resources: [
                                    {
                                    key:'Hello',
                                    value:'test'
                                    }
                                ]
                                }]
                            }];

                                const globalObject = self;/* tuval$core.Context.Current.get('global') */
                                if (globalObject) {
                                    if (globalObject["ThreadWorker"]) {
                                        //console.log('--------------Test------------------');
                                        globalObject["ThreadWorker"].prototype.RetriveMessageCallbacks = () => {
                                            return tuval$core.Reflect.getMetadata("messageCallbacks", globalObject["ThreadWorker"]);
                                        };
                                        //console.log(Reflect.getMetadata("messageCallbacks", globalObject["ThreadWorker"]));
                                        tuval$core.Thread.CurrentThread =  new globalObject["ThreadWorker"]();
                                    }
                                }
                            }
                        }

                        self.postMessage({
                            Msg: 0 // Loaded Message
                        });

                        const ISC_SETSERVICE = 901;

                        //waiting start message
                        self.onmessage = function (e) {
                           // console.log(e);
                            if (e.data.Msg === -1) {
                              //  console.log('start çağrıldı.');
                                _Assembly.start();
                                self.postMessage({
                                    Msg: 1 // Loaded Message
                                });
                            }

                            if (e.data.Msg === ISC_SETSERVICE) {
                                //debugger;
                                const serviceName = e.data.wParam;
                                const port = e.data.lParam;
                                if (tuval$core.Thread['Services'] == null) {
                                    tuval$core.Thread['Services'] = new tuval$core.Dictionary();
                                }
                                const a = tuval$core.Thread['Services'];
                                if (!a.ContainsKey(serviceName)) {
                                    a.Add(serviceName, port);
                                }
                            }
                        };


                    })();

                         `
          }

          //scriptContents = WebWorker._workerScriptWrapper.replace(/\{\{main-function\}\}/g, scriptContents);

          blob = new window.Blob([scriptContents], { type: 'text/javascript' })
          this.m_WorkerBlobUrl = window.URL.createObjectURL(blob)
          this.createWorker()
          this.m_Loading = false
          this.m_Loaded = true
          this.OnThreadLoadedEvent() // Web worker has been loaded.
          // Yüklendiği için burada start olunca web worker tarafından gönderilen mesajı yakalamak için bir event tanımlıyoruz.
          this.on(ThreadEvents.STARTED, () => {
            this.OnThreadStartedEvent()
          })
          resolve(this)
        })
      }

      if (this.m_WorkerUrl === null) {
        // Script already available
        onScriptLoaded()
      } else {
        Http.JS(this.m_WorkerUrl).then(response => {
          this.m_WorkerScript = response
          onScriptLoaded()
        })
        // Ajax request
        /*  $.ajax({
                     "async": true,
                     "url": workerUrl,
                     "dataType": 'text',
                     "crossDomain": true,
                     "success": function (responseText) {
                         self._workerScript = responseText;
                         onScriptLoaded();
                     },
                     "error": function () {
                         self.throwError(Error.WORKER_DID_NOT_LOAD, arguments);
                     }
                 }); */
      }

      return this
    })
  }

  private attachMessageParser() {
    this.m_Worker.onmessage = (event: MessageEvent) => {
      let { Msg, params }: IMessage<any> = event.data;
      if (params == null) {
        params = [];
      }

      //on eventlerinin çalışması için kendi içinde gönderiliyor.
      this.m_EventBus.fire(Thread.THREADID, Msg, {
        params: params,
        //lParam: message.lParam
      })
      this.PreProcessMessage(Msg, ...params/* , message.lParam */);
    }
    this.m_Worker.onerror = event => {
      console.error(event)
    }

    return this
  }

  @Virtual
  public ThreadProc<T, K>(msg: int, ...params: any[]) {
    switch (msg) {
      case IPC.SETREADHEAP:
        this.IpcSetReadHeap(params as any)
        break
      default:
        return
    }
  }

  @Virtual
  public PreProcessMessage<T, K>(msg: int, ...params: T[]) {
    this.ThreadProc(msg, ...params);
  }

  @Virtual
  public OnThreadLoading(): void { }

  @Virtual
  public OnThreadLoaded(): void { }

  @Virtual
  public OnThreadStarting(): void { }

  @Virtual
  public OnThreadStarted(): void { }

  @Virtual
  public IpcSetReadHeap(arrayBuffer: any /* SharedArrayBuffer */): void {
    //console.log('---------------------------IpcSetReadHeap----------------');
    //console.log(arrayBuffer);
    this.m_ReadHeap = arrayBuffer
    //this.m_ReadBuffer = new TBuffer(this.m_ReadHeap);
    updateGlobalBufferAndViewsEx(arrayBuffer)
  }
  public static GetDomainID(): int {
    return 0
  }
}
