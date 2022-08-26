import { AddCurveToPointCommand } from './AddCurveToPointCommand';
import { AddArcToPointCommand } from "./AddArcToPointCommand";
import { AddLineToPointCommand } from "./AddLineToPointCommand";
import { BeginPathCommand } from "./BeginPathCommand";
import { ClearRectCommand } from "./ClearRectCommand";
import { ClosePathCommand } from "./ClosePathCommand";
import { DrawPathCommand } from "./DrawPathCommand";
import { EndCommand } from "./EndCommand";
import { EOFillPathCommand } from "./EOFillPathCommand";
import {  MoveToCommand } from "./MoveToCommand";
import { RestoreStateCommand } from "./RestoreStateCommand";
import { RotateCommand } from "./RotateCommand";
import { SaveStateCommand } from "./SaveStateCommand";
import { ScaleCommand } from "./ScaleCommand";
import { SetFillColorCommand } from "./SetFillColorCommand";
import { SetLineCapCommand } from "./SetLineCapCommand";
import { SetLineDashCommand } from "./SetLineDashCommand";
import { SetLineWidthCommand } from "./SetLineWidthCommand";
import { SetShadowWithColorCommand } from "./SetShadowWithColorCommand";
import { SetStrokeColor } from "./SetStrokeColor";
import { StartCommand } from "./StartCommand";
import { TransformCommand } from "./TransformCommand";
import { TranslateCommand } from "./TranslateCommand";

export const Commands: any[] = [
    StartCommand, //0
    EndCommand, //1
    ClearRectCommand, //2
    ScaleCommand, //3
    TranslateCommand, //4
    RotateCommand, //5
    TransformCommand, //6
    SaveStateCommand, //7
    RestoreStateCommand, //8
    SetLineWidthCommand, //9
    SetLineCapCommand, //10
    BeginPathCommand, //11
    MoveToCommand, //12
    AddLineToPointCommand, //13
    SetShadowWithColorCommand, //14
    SetStrokeColor, //15
    SetLineDashCommand, //16
    DrawPathCommand, //17
    SetFillColorCommand, //18
    AddArcToPointCommand, //19
    ClosePathCommand, //20
    EOFillPathCommand, //21
    AddCurveToPointCommand //22
]