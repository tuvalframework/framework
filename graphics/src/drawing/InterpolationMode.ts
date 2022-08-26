import { QualityMode } from "./QualityMode";

export enum InterpolationMode {
    Invalid = QualityMode.Invalid,
    Default = QualityMode.Default,
    Low = QualityMode.Low,
    High = QualityMode.High,
    Bilinear,
    Bicubic,
    NearestNeighbor,
    HighQualityBilinear,
    HighQualityBicubic
}