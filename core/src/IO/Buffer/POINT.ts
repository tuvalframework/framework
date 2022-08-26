import { ClassInfo } from "../../Reflection/Decorators/ClassInfo";
import { System } from "../../SystemTypes";
import { HWND } from "../Internals/DataTypes/HWND";
import { INT } from "../Internals/DataTypes/INT";
import { GUID, LONG } from "../Internals/DataTypes/LONG";
import { STRING } from "../Internals/DataTypes/STRING";
import { STRUCT } from "../Internals/DataTypes/STRUCT";
import { UMP } from "./TStruct";
let size = 0;

/* type LONG = number; // 4 Bytes
type PVOID = LONG;
type HANDLE = PVOID; */

@ClassInfo({
    fullName: System.Types.UMP.POINT,
    instanceof: [
        System.Types.UMP.POINT,
    ]
})
export class POINT extends UMP {
    @LONG X;
    @LONG Y;
}


export class RECT extends UMP {
    @LONG X;
    @LONG Y;
    @LONG Width;
    @LONG Height;
}

@ClassInfo({
    fullName: System.Types.UMP.GdipEncoderParameter,
    instanceof: [
        System.Types.UMP.GdipEncoderParameter,
    ]
})
export  class GdipEncoderParameter extends UMP{
     @GUID guid;
     @LONG numberOfValues;
     @LONG type;
     @LONG value;
}

/* export class MINMAXINFO extends UMP {
    @LONG test;
    @STRUCT(POINT) ptReserved;
    @LONG test2;
    @STRUCT(POINT) ptMaxSize;
    @STRING(10) test3;
    @STRING(5) test4;
    @STRUCT(POINT) ptMaxPosition;
    @STRUCT(POINT) ptMinTrackSize;
    @STRUCT(POINT) ptMaxTrackSize;
    @STRING(10) test5;
}

@ClassInfo({
    fullName: System.Types.UMP.RECT,
    instanceof: [
        System.Types.UMP.RECT,
    ]
})
export class RECT_ extends UMP {
    @STRUCT(POINT) top;
    @LONG Width;
    @LONG Height;
    @STRING(10) name;
    @STRUCT(MINMAXINFO) minmaxinfo;
}

export class WINDOWPOS extends UMP {
    @HWND hwnd;
    @HWND hwndInsertAfter;
    @INT x;
    @INT y;
    @INT cx;
    @INT cy;
    @STRUCT(POINT) point;
    @INT flags;
}

export enum Coomands  {
    DrawLine = 0
} */
