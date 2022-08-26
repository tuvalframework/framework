export interface ICommand {
    CommandType;
    NextCommandType;
    NextCommandPointer;
    ExecuteCommand(drawingContext: CanvasRenderingContext2D);
}

export const IsDebug = false;