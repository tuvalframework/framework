import { QualityMode } from "../QualityMode";

    export enum CompositingQuality {
        Invalid = QualityMode.Invalid,
        Default = QualityMode.Default,
        HighSpeed = QualityMode.Low,
        HighQuality = QualityMode.High,
        GammaCorrected,
        AssumeLinear
    }
