import { ICommand } from './Commands/ICommand';
import { Exception, free } from "@tuval/core";
import { CGCommandContext2D } from "./CGCommandContext";
import { Commands } from "./Commands/Commands";



export class CommandContextPilot {
    private m_Context: CGCommandContext2D = null as any;
    constructor(context: CGCommandContext2D) {
        this.m_Context = context;
    }
    public Reset(canvasContext: CanvasRenderingContext2D) {
       // console.log('ressssserrrt');
        (this.m_Context as any).m_AddressTable.forEach((address: number) => {
            try {
                free(address);
            }catch {
                console.log('Adres serbest bırakılamadı. ' + address );
            }
        });
        (this.m_Context as any).m_AddressTable = [];
        (this.m_Context as any).IsOpened = false;
        (this.m_Context as any).IsClosed = false;
        (this.m_Context as any).m_StartPointer = 0;
        (this.m_Context as any).m_LastCommand = null as any
        /*    const rect = new CGRectangle(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
           canvasContext.clearRect(rect.X, rect.Y, rect.Width, rect.Height); */
    }

    public Drive(canvasContext: CanvasRenderingContext2D) {
        if (!this.m_Context.IsOpened) {
            throw new Exception(' Command context must be closed before drive. Use End method.');
        } else if (!this.m_Context.IsClosed) {
            (this.m_Context as any).forceToEnd();
        }

        const startPtr = this.m_Context.GetStartPointer();
        let currentCommand: ICommand = new Commands[0](startPtr);
        currentCommand.ExecuteCommand(canvasContext);
        while (currentCommand.CommandType !== 1 && currentCommand.NextCommandPointer !== 0) {
            currentCommand = new Commands[currentCommand.NextCommandType](currentCommand.NextCommandPointer);
            currentCommand.ExecuteCommand(canvasContext);
        }
    }
}