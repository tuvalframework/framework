import { CoreGraphicTypes } from './../../types';
import { ClassInfo, LONG, UMO } from "@tuval/core";
import { ICommand, IsDebug } from './ICommand';

@ClassInfo({
    fullName: CoreGraphicTypes.StartCommand,
    instanceof: [
        CoreGraphicTypes.StartCommand
    ]
})
export class StartCommand extends UMO implements ICommand {
    @LONG CommandType = 0;
    @LONG NextCommandType;
    @LONG NextCommandPointer;
    public ExecuteCommand(drawingContext: CanvasRenderingContext2D) {
        if (IsDebug) {
            console.log('StartCommand');
        }
    }
}