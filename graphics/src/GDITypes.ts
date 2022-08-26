
export const GraphicTypes = {
    Bitmap:Symbol('Tuval.Graphics.Bitmap'),
    GdipEncoderParameter:Symbol('Tuval.Graphics.GdipEncoderParameter'),
    Region: Symbol('Tuval.Graphics.Region'),
    Image: Symbol('Tuval.Graphics.Image'),
    ImageList: Symbol('Tuval.Graphics.ImageList'),
    StringFormat:Symbol('Tuval.Graphics.StringFormat'),
    Font: Symbol('Tuval.Graphics.Font'),
    Graphics: Symbol('Tuval.Graphics.Graphics'),
    GraphicsBase: Symbol('Tuval.Graphics.GraphicsBase'),
    ColorMatrix:Symbol('Tuval.Graphics.ColorMatrix'),
    SolidBrush: Symbol('Tuval.Graphics.SolidBrush'),
    Brush: Symbol('Tuval.Graphics.Brush'),
    LinearGradientBrush: Symbol('Tuval.Graphics.LinearGradientBrush'),
    PathGradientBrush: Symbol('Tuval.Graphics.PathGradientBrush'),
    GraphicsPath: Symbol('GraphicsPath'),
    HatchBrush: Symbol('HatchBrush'),
    Icon: Symbol('Tuval.Graphics.Icon'),
    Pen: Symbol('Pen'),
    TextureBrush: Symbol('TextureBrush'),
    RadialGradientBrush: Symbol('RadialGradientBrush'),
    PaintEventArgs: Symbol('PaintEventArgs'),
    Imaging : {
        ImageAttributes: Symbol('ImageAttributes'),
        FrameDimension: Symbol('FrameDimension'),
    },
    geom: {
        Shape: Symbol('Shape'),
        Point2D: Symbol('Point2D'),
        Line2D: Symbol('Line2D'),
        Rectangle2D: Symbol('Rectangle2D'),
        AffineTransform: Symbol('AffineTransform'),
    },
    Application: Symbol('Application'),
    Tgx: {
        graphics: {
            Color: Symbol('Color'),
            Pixmap:Symbol('Pixmap'),
        },

        files: {
            FileHandle: Symbol('FileHandle'),
        },
        backend: {
            preloader: {
                Preloader: Symbol('Preloader'),
            }
        },
        utils: {
            ObjectMap: {
                Keys: Symbol('Entries'),
                Values: Symbol('Entries'),
                Entries: Symbol('Entries'),
                MapIterator: Symbol('MapIterator'),
                ObjectMap: Symbol('ObjectMap'),
                Entry: Symbol('Entry'),
            },
            IntArray: Symbol('IntArray'),
            Array: Symbol('Array'),
        },

    }
}