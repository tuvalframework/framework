export enum Status {
    Ok = 0,
    GenericError = 1,
    InvalidParameter = 2,
    OutOfMemory = 3,
    ObjectBusy = 4,
    InsufficientBuffer = 5,
    NotImplemented = 6,
    Win32Error = 7,
    WrongState = 8,
    Aborted = 9,
    FileNotFound = 10,
    ValueOverflow = 11,
    AccessDenied = 12,
    UnknownImageFormat = 13,
    FontFamilyNotFound = 14,
    FontStyleNotFound = 15,
    NotTrueTypeFont = 16,
    UnsupportedGdiplusVersion = 17,
    GdiplusNotInitialized = 18,
    PropertyNotFound = 19,
    PropertyNotSupported = 20,
    ProfileNotFound = 21,
    NativeImageNotFound = 22,
    NativeContext2DNotFound = 23,
}

export enum BrushType {
    BrushTypeSolidColor = 0,
    BrushTypeHatchFill = 1,
    BrushTypeTextureFill = 2,
    BrushTypePathGradient = 3,
    BrushTypeLinearGradient = 4
}

export enum ImageType {
    Unknown = 0,
    Bitmap = 1,
    Metafile = 2
}

export enum GetSysColorIndex {
    COLOR_SCROLLBAR = 0,
    COLOR_BACKGROUND = 1,
    COLOR_ACTIVECAPTION = 2,
    COLOR_INACTIVECAPTION = 3,
    COLOR_MENU = 4,
    COLOR_WINDOW = 5,
    COLOR_WINDOWFRAME = 6,
    COLOR_MENUTEXT = 7,
    COLOR_WINDOWTEXT = 8,
    COLOR_CAPTIONTEXT = 9,
    COLOR_ACTIVEBORDER = 10,
    COLOR_INACTIVEBORDER = 11,
    COLOR_APPWORKSPACE = 12,
    COLOR_HIGHLIGHT = 13,
    COLOR_HIGHLIGHTTEXT = 14,
    COLOR_BTNFACE = 15,
    COLOR_BTNSHADOW = 16,
    COLOR_GRAYTEXT = 17,
    COLOR_BTNTEXT = 18,
    COLOR_INACTIVECAPTIONTEXT = 19,
    COLOR_BTNHIGHLIGHT = 20,
    COLOR_3DDKSHADOW = 21,
    COLOR_3DLIGHT = 22,
    COLOR_INFOTEXT = 23,
    COLOR_INFOBK = 24,

    COLOR_HOTLIGHT = 26,
    COLOR_GRADIENTACTIVECAPTION = 27,
    COLOR_GRADIENTINACTIVECAPTION = 28,
    COLOR_MENUHIGHLIGHT = 29,
    COLOR_MENUBAR = 30,

    COLOR_DESKTOP = 1,
    COLOR_3DFACE = 16,
    COLOR_3DSHADOW = 16,
    COLOR_3DHIGHLIGHT = 20,
    COLOR_3DHILIGHT = 20,
    COLOR_BTNHILIGHT = 20,

    COLOR_MAXVALUE = 30,/* Maximum value */
}