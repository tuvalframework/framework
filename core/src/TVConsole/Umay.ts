import { Console } from "../Console";
import { int, ByteArray } from '../float';
import { SubProcessCommandBase } from "./Commands/SubProcessCommandBase";
import { ConsoleBase } from "./ConsoleBase";
import { TextTVC } from "./TextTVC";
import { Dictionary } from '../Collections/Generic/Dictionary';
import { TBuffer } from '../IO/Buffer/TBuffer';

export class Umay extends ConsoleBase<TextTVC> {
    public constructor() {
        super({ silence: true });
    }
    public CreateTVC(canvas: HTMLCanvasElement, options: any): TextTVC {
        return new TextTVC(this.Canvas, options) as any;
    }

    public WaitServerSocketAccept(port: int): void {
        this.m_CurrentQueue.Enqueue(new class extends SubProcessCommandBase {
            private port: int = 0;
            public constructor(console: ConsoleBase<TextTVC>, port: int) {
                super(console);
                this.port;
            }

            public IsWaitable(): boolean {
                return true;
            }
            public GetReturnObject(): any {
                return {
                    type: 12,
                    waitThis: this,
                    callFunction: "accept",
                    waitFunction: "accept_wait",
                    args: []
                };
            }
        }(this, port));
    }
}

let socketCounter = 0;
const listeningSockets: Dictionary<int, ServerSocket> = new Dictionary();
const clientSockets: Dictionary<int, ClientSocket> = new Dictionary();
class Socket {
    public socketId: int = socketCounter++;
    public address: string = '';
    public port: int = 0;
    public constructor(address: string) {
        this.address = address;
    }
}
export class ClientSocket extends Socket {
    private connectResolve: any;
    private connectReject: any;

    private readResolve: any;
    private readReject: any;

    public constructor(address: string, port: int) {
        super(address);
        this.port = port;
        clientSockets.Add(this.socketId, this);
    }
    public Connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (listeningSockets.ContainsKey(this.port)) {
                this.connectResolve = resolve;
                this.connectReject = reject;

                const buffer = new TBuffer();
                buffer.writeByte(1); // reqType
                buffer.writeInt32(this.socketId);
                const listeningSocket = listeningSockets.Get(this.port);
                listeningSocket.Pipe(buffer.buffer);

            } else {
                reject('server not found.');
            }
        });

    }
    public Read(): Promise<ByteArray> {
        return new Promise((resolve, reject) => {
            this.readResolve = resolve;
            this.readReject = reject;
        });
    }

    public Write(data: ByteArray) {
        const buffer = new TBuffer();
        buffer.writeByte(2); // ClientWriteReq
        buffer.writeInt32(data.length);
        buffer.writeBytes(data);
        const listeningSocket = listeningSockets.Get(this.port);
        listeningSocket.Pipe(buffer.buffer);
    }

    private connectResponse(buffer: TBuffer): void {
        const connectAccepeted = buffer.readBoolean();
        if (connectAccepeted) {
            this.connectResolve();
        } else {
            this.connectReject('server not accepted.');
        }
    }

    private readDataRequest(buffer: TBuffer): void {
        const dataSize = buffer.readInt32();
        const data = buffer.readBytes(dataSize);
        if (this.readResolve) {
            this.readResolve(data);
        }
    }

    public Pipe(data: ArrayBuffer) {
        const buffer = new TBuffer(data);
        const responseType = buffer.readByte();
        switch (responseType) {
            case 1:
                this.connectResponse(buffer);
                break;
            case 2:
                this.readDataRequest(buffer);
                break;
        }
    }
}


export class ServerSocket extends Socket {
    public ConnectedClients: Dictionary<int, ClientSocket>;
    private listenCallback: Function = null as any;
    private acceptResolve: any;

    private readResolve: any;
    private readReject: any;

    public constructor(address: string, port: int) {
        super(address);
        this.port = port;
        this.ConnectedClients = new Dictionary();

    }

    public Listen(): void {
        listeningSockets.Add(this.port, this);
    }
    public Accept(): Promise<ClientSocket> {
        return new Promise((resolve, reject) => {
            this.acceptResolve = resolve;
        });
    }
    public Read(): Promise<ByteArray> {
        return new Promise((resolve, reject) => {
            this.readResolve = resolve;
            this.readReject = reject;
        });
    }

    private accpetReq(buffer: TBuffer) {
        const clientId = buffer.readInt32();
        const client = clientSockets.Get(clientId);/* new ClientSocket(this.address, this.port); */
        this.ConnectedClients.Add(client.socketId, client);

        const responseConnection = new TBuffer();
        responseConnection.writeByte(1);
        responseConnection.writeBoolean(true);
        client.Pipe(responseConnection.buffer);
        this.acceptResolve(client);
    }

    private readDataRequest(buffer: TBuffer): void {
        const dataSize = buffer.readInt32();
        const data = buffer.readBytes(dataSize);
        if (this.readResolve) {
            this.readResolve(data);
        }
    }
    public Pipe(data: ArrayBuffer) {
        const buffer = new TBuffer(data);
        const reqType = buffer.readByte();
        switch (reqType) {
            case 1:
                this.accpetReq(buffer);
                break;
            case 2: // Client Send data
                this.readDataRequest(buffer);
                break;
        }
    }

}

/*
class WSAData {
    public wVersion: int = 0;
    public wHighVersion: int = 0;
    public iMaxSockets: int = 10;
}
function WSAStartup(wVersionRequired: int, wsaData: WSAData): int {

} */

/* unction socket(address: string): Socket {
    return new ServerSocket(address);
}

function listen(listenSocket: Socket, callback: Function): void {
    listeningSockets.Add(listenSocket.port, new ListeningServerSocket(listenSocket.address, callback));
}

function accept(socket: ListeningServerSocket): ClientSocket {
    return socket.Accept();
}


// client functions
function recv(socket:ClientSocket, callback: (recvbuf:ByteArray, len:int, index:int)=> void) : void {

}

function send(socket:Socket, sendbuf:ByteArray, len:int, index:int) : void {

}

function connect(socket: Socket, callback: Function): void {
    if (listeningSockets.ContainsKey(socket.port)) {
        const buffer = new TBuffer();
        buffer.writeByte(1);
        const listeningSocket = listeningSockets.Get(socket.port);
        listeningSocket.Pipe(buffer);
    }
} */