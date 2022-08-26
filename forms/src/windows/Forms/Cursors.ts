import { Cursor } from "./Cursor";


export class Cursors {
    public static AppStarting: Cursor;
    public static PanSouth: Cursor;
    public static PanSE: Cursor;
    public static PanNW: Cursor;
    public static PanSW: Cursor;
    public static PanNorth: Cursor;
    public static PanNE: Cursor;
    public static PanEast: Cursor;
    public static NoMoveVert: Cursor;
    public static NoMoveHoriz: Cursor;
    public static NoMove2D: Cursor;
    public static VSplit: Cursor = new Cursor('col-resize');
    public static HSplit: Cursor = new Cursor('row-resize');
    public static Help: Cursor;
    public static WaitCursor: Cursor;
    public static UpArrow: Cursor;
    public static SizeWE: Cursor = new Cursor('ew-resize');
    public static SizeNWSE: Cursor = new Cursor('nwse-resize');
    public static SizeNS: Cursor = new Cursor('ns-resize');
    public static SizeNESW: Cursor = new Cursor('nesw-resize');
    public static SizeAll: Cursor = new Cursor('move');
    public static No: Cursor = new Cursor('not-allowed');
    public static IBeam: Cursor = new Cursor('text');;
    public static Default: Cursor = new Cursor('default');
    public static Cross: Cursor;
    public static Arrow: Cursor;
    public static PanWest: Cursor;
    public static Hand: Cursor = new Cursor('pointer');
}