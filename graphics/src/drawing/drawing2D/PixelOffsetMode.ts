import { QualityMode } from "../QualityMode";

    export enum PixelOffsetMode {
        Invalid = QualityMode.Invalid,
        Default = QualityMode.Default,
        HighSpeed = QualityMode.Low,
        HighQuality = QualityMode.High,
        None,
        Half // offset by -0.5, -0.5 for fast anti-alias perf
    }
