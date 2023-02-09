
import { clone, StringBuilder } from '@tuval/core';
import { UIViewClass } from './UIViewClass';


export function Skin(styleName: string) {
    return function (target: any, key: string) {
        const eventDescriptor: Object = {
            set: function (newValue: Function): void {
                this.StylePropertyBag[styleName] = newValue;
                this.isModified = true;
                this.IsEmpty = false;
                // this.myOptions['Use' + key] = true;
                if (this.control != null) {
                    this.control.ForceUpdate();
                }
            },
            get: function () {
                return this.StylePropertyBag[styleName];
            },
            enumerable: true,
            configurable: true
        };

        Object.defineProperty(target, key, eventDescriptor);
    }
}


export enum BorderAppearanceStyle {
    None = 'none',	//Specifies no border. This is default
    Hidden = 'hidden',	// The same as "none", except in border conflict resolution for table elements
    Dotted = 'dotted',	// Specifies a dotted border
    Dashed = 'dashed', 	// Specifies a dashed border
    Solid = 'solid',	// Specifies a solid border
    Double = 'double',	// Specifies a double border
    Groove = 'groove',	// Specifies a 3D grooved border. The effect depends on the border-color value
    Ridge = 'ridge',	// Specifies a 3D ridged border. The effect depends on the border-color value
    Inset = 'inset',	// Specifies a 3D inset border. The effect depends on the border-color value
    Outset = 'outset',	// Specifies a 3D outset border. The effect depends on the border-color value
    Initial = 'initial',	// Sets this property to its default value. Read about initial
    Inherit = 'inherit',	// Inherits this property from its parent element.
}
export class AppearanceObject {
    public IsEmpty: boolean = true;
    public isModified: boolean = false;
    private control: UIViewClass;
    public StylePropertyBag = {};

    /**
     * Specifies the alignment of flexible container's items within the flex container.
     */
    @Skin('align-content')
    public AlignContent: string;

    /**
     * Specifies the default alignment for items within the flex container.
     */
    @Skin('align-items')
    public AlignItems: string;

    /**
     * Specifies the alignment for selected items within the flex container.
     */
    @Skin('align-self')
    public AlignSelf: string;

    /**
     * Specifies the keyframe-based animations.
     */
    @Skin('animation')
    public Animation: string;

    /**
     * Specifies when the animation will start.
     */
    @Skin('animation-delay')
    public AnimationDelay: string;

    /**
     * Specifies whether the animation should play in reverse on alternate cycles or not.
     */
    @Skin('animation-direction')
    public AnimationDirection: string;

    /**
     * Specifies the number of seconds or milliseconds an animation should take to complete one cycle.
     */
    @Skin('animation-duration')
    public AnimationDuration: string;

    /**
     * Specifies how a CSS animation should apply styles to its target before and after it is executing.
     */
    @Skin('animation-fill-mode')
    public AnimationFillMode: string;

    /**
     * Specifies the number of times an animation cycle should be played before stopping.
     */
    @Skin('animation-iteration-count')
    public AnimationIterationCount: string;

    /**
     * Specifies the name of @keyframes defined animations that should be applied to the selected element.
     */
    @Skin('animation-name')
    public AnimationName: string;

    /**
     * Specifies whether the animation is running or paused.
     */
    @Skin('animation-play-state')
    public AnimationPlayState: string;

    /**
     * Specifies how a CSS animation should progress over the duration of each cycle.
     */
    @Skin('animation-timing-function')
    public AnimationTimingFunction: string;

    /**
     * Specifies whether or not the "back" side of a transformed element is visible when facing the user.
     */
    @Skin('backface-visibility')
    public BackfaceVisibility: string;

    /**
     * Defines a variety of background properties within one declaration.
     */
    @Skin('background')
    public Background: string;

    /**
     * Specify whether the background image is fixed in the viewport or scrolls.
     */
    @Skin('background-attachment')
    public BackgroundAttachment: string;

    /**
     * Specifies the painting area of the background.
     */
    @Skin('background-clip')
    public BackgroundClip: string;

    /**
     * Defines an element's background color.
     */
    @Skin('background-color')
    public BackgroundColor: string;

    /**
     * Defines an element's background image.
     */
    @Skin('background-image')
    public BackgroundImage: string;

    /**
     * Specifies the positioning area of the background images.
     */
    @Skin('background-origin')
    public BackgroundOrigin: string;

    /**
     * Defines the origin of a background image.
     */
    @Skin('background-position')
    public BackgroundPosition: string;


    /**
     * Specify whether/how the background image is tiled.
     */
    @Skin('background-repeat')
    public BackgroundRepeat: string;

    /**
     * Specifies the size of the background images.
     */
    @Skin('background-size')
    public BackgroundSize: string;

    /**
     * Sets the width, style, and color for all four sides of an element's border.
     */
    @Skin('border')
    public Border: string;

    /**
     * Sets the width, style, and color of the bottom border of an element.
     */
    @Skin('border-bottom')
    public BorderBottom: string;


    /**
     * Sets the color of the bottom border of an element.
     */
    @Skin('border-bottom-color')
    public BorderBottomColor: string;


    /**
     * Defines the shape of the bottom-left border corner of an element.
     */
    @Skin('border-bottom-left-radius')
    public BorderBottomLeftRadius: string;


    /**
     * Defines the shape of the bottom-right border corner of an element.
     */
    @Skin('border-bottom-right-radius')
    public BorderBottomRightRadius: string;

    /**
     * Sets the style of the bottom border of an element.
     */
    @Skin('border-bottom-style')
    public BorderBottomStyle: string;

    /**
     * Sets the width of the bottom border of an element.
     */
    @Skin('border-bottom-width')
    public BorderBottomWidth: string;

    /**
     * Specifies whether table cell borders are connected or separated.
     */
    @Skin('border-collapse')
    public BorderCollapse: string;

    /**
     * Sets the color of the border on all the four sides of an element.
     */
    @Skin('border-color')
    public BorderColor: string;

    /**
     * Specifies how an image is to be used in place of the border styles.
     */
    @Skin('border-image')
    public BorderImage: string;

    /**
     * Specifies the amount by which the border image area extends beyond the border box.
     */
    @Skin('border-image-outset')
    public BorderImageOutset: string;

    /**
     * Specifies whether the image-border should be repeated, rounded or stretched.
     */
    @Skin('border-image-repeat')
    public BorderImageRepeat: string;

    /**
     * Specifies the inward offsets of the image-border.
     */
    @Skin('border-image-slice')
    public BorderImageSlice: string;


    /**
     * Specifies the location of the image to be used as a border.
     */
    @Skin('border-image-source')
    public BorderImageSource: string;

    /**
     * 	Specifies the width of the image-border.
     */
    @Skin('border-image-width')
    public BorderImageWidth: string;

    /**
     * Sets the width, style, and color of the left border of an element.
     */
    @Skin('border-left')
    public BorderLeft: string;

    /**
     * Sets the color of the left border of an element.
     */
    @Skin('border-left-color')
    public BorderLeftColor: string;

    /**
     * Sets the style of the left border of an element.
     */
    @Skin('border-left-style')
    public BorderLeftStyle: string;

    /**
     * Sets the width of the left border of an element.
     */
    @Skin('border-left-width')
    public BorderLeftWidth: string;

    /**
     * Defines the shape of the border corners of an element.
     */
    @Skin('border-radius')
    public BorderRadius: string;

    /**
     * Sets the width, style, and color of the right border of an element.
     */
    @Skin('border-right')
    public BorderRight: string;

    /**
     * Sets the color of the right border of an element.
     */
    @Skin('border-right-color')
    public BorderRightColor: string;

    /**
     * Sets the style of the right border of an element.
     */
    @Skin('border-right-style')
    public BorderRightStyle: string;

    /**
     * Sets the width of the right border of an element.
     */
    @Skin('border-right-width')
    public BorderRightWidth: string;

    /**
     * Sets the spacing between the borders of adjacent table cells.
     */
    @Skin('border-spacing')
    public BorderSpacing: string;

    /**
     * Sets the style of the border on all the four sides of an element.
     */
    @Skin('border-style')
    public BorderStyle: string;

    /**
     * Sets the width, style, and color of the top border of an element.
     */
    @Skin('border-top')
    public BorderTop: string;

    /**
     * Sets the color of the top border of an element.
     */
    @Skin('border-top-color')
    public BorderTopColor: string;

    /**
     * Defines the shape of the top-left border corner of an element.
     */
    @Skin('border-top-left-radius')
    public BorderTopLeftRadius: string;

    /**
     * Defines the shape of the top-right border corner of an element.
     */
    @Skin('border-top-right-radius')
    public BorderTopRightRadius: string;

    /**
     * Sets the style of the top border of an element.
     */
    @Skin('border-top-style')
    public BorderTopStyle: string;

    /**
     * Sets the width of the top border of an element.
     */
    @Skin('border-top-width')
    public BorderTopWidth: string;

    /**
     * Sets the width of the border on all the four sides of an element.
     */
    @Skin('border-width')
    public BorderWidth: string;

    /**
     * Specify the location of the bottom edge of the positioned element.
     */
    @Skin('bottom')
    public Bottom: string;

    /**
     * Applies one or more drop-shadows to the element's box.
     */
    @Skin('box-shadow')
    public BoxShadow: string;

    /**
     * Alter the default CSS box model.
     */
    @Skin('box-sizing')
    public BoxSizing: string;

    /**
     * Specify the position of table's caption.
     */
    @Skin('caption-side')
    public CaptionSide: string;

    /**
     * Specifies the placement of an element in relation to floating elements.
     */
    @Skin('clear')
    public Clear: string;

    /**
     * Defines the clipping region.
     */
    @Skin('clip')
    public Clip: string;

    /**
     * Defines the clipping region.
     */
    @Skin('clip-path')
    public ClipPath: string;

    /**
   * Defines the filter.
   */
    @Skin('filter')
    public Filter: string;

    /**
     * Specify the color of the text of an element.
     */
    @Skin('color')
    public Color: string;

    /**
     * Specifies the number of columns in a multi-column element.
     */
    @Skin('column-count')
    public ColumnCount: string;

    /**
     * Specifies how columns will be filled.
     */
    @Skin('column-fill')
    public ColumnFill: string;

    /**
     * Specifies the gap between the columns in a multi-column element.
     */
    @Skin('column-gap')
    public ColumnGap: string;

    /**
     * Specifies a straight line, or "rule", to be drawn between each column in a multi-column element.
     */
    @Skin('column-rule')
    public ColumnRule: string;

    /**
     * Specifies the color of the rules drawn between columns in a multi-column layout.
     */
    @Skin('column-rule-color')
    public ColumnRuleColor: string;

    /**
     * Specifies the style of the rule drawn between the columns in a multi-column layout.
     */
    @Skin('column-rule-style')
    public ColumnRuleStyle: string;

    /**
     * Specifies the width of the rule drawn between the columns in a multi-column layout.
     */
    @Skin('column-rule-width')
    public ColumnRuleWidth: string;

    /**
     * Specifies how many columns an element spans across in a multi-column layout.
     */
    @Skin('column-span')
    public ColumnSpan: string;

    /**
     * Specifies the optimal width of the columns in a multi-column element.
     */
    @Skin('column-width')
    public ColumnWidth: string;

    /**
     * A shorthand property for setting column-width and column-count properties.
     */
    @Skin('columns')
    public Columns: string;

    /**
     * Inserts generated content.
     */
    @Skin('content')
    public Content: string;

    /**
     * Increments one or more counter values.
     */
    @Skin('counter-increment')
    public CounterIncrement: string;

    /**
     * Creates or resets one or more counters.
     */
    @Skin('counter-reset')
    public CounterReset: string;

    /**
     * Specify the type of cursor.
     */
    @Skin('cursor')
    public Cursor: string;

    /**
     * Define the text direction/writing direction.
     */
    @Skin('direction')
    public Direction: string;

    /**
     * Specifies how an element is displayed onscreen.
     */
    @Skin('display')
    public Display: string;

    /**
     * Show or hide borders and backgrounds of empty table cells.
     */
    @Skin('empty-cells')
    public EmptyCells: string;

    /**
     * Specifies the components of a flexible length.
     */
    @Skin('flex')
    public flex: string;

    /**
     * Specifies the initial main size of the flex item.
     */
    @Skin('flex-basis')
    public FlexBasis: string;

    /**
     * Specifies the direction of the flexible items.
     */
    @Skin('flex-direction')
    public FlexDirection: string;

    /**
     * A shorthand property for the flex-direction and the flex-wrap properties.
     */
    @Skin('flex-flow')
    public FlexFlow: string;

    /**
     * Specifies how the flex item will grow relative to the other items inside the flex container.
     */
    @Skin('flex-grow')
    public FlexGrow: string;

    /**
     * Specifies how the flex item will shrink relative to the other items inside the flex container.
     */
    @Skin('flex-shrink')
    public FlexShrink: string;

    /**
     * Specifies whether the flexible items should wrap or not.
     */
    @Skin('flex-wrap')
    public FlexWrap: string;

    /**
     * Specifies whether or not a box should float.
     */
    @Skin('float')
    public Float: string;

    /**
     * Defines a variety of font properties within one declaration.
     */
    @Skin('font')
    public Font: string;

    /**
     * Defines a list of fonts for element.
     */
    @Skin('font-family')
    public FontFamily: string;

    /**
     * Defines the font size for the text.
     */
    @Skin('font-size')
    public FontSize: string;

    /**
     * Preserves the readability of text when font fallback occurs.
     */
    @Skin('font-size-adjust')
    public FontSizeAdjust: string;

    /**
     * Selects a normal, condensed, or expanded face from a font.
     */
    @Skin('font-stretch')
    public FontStretch: string;

    /**
     * Defines the font style for the text.
     */
    @Skin('font-style')
    public FontStyle: string;

    /**
     * Specify the font variant.
     */
    @Skin('font-variant')
    public FontVariant: string;

    /**
     * Specify the font weight of the text.
     */
    @Skin('font-weight')
    public FontWeight: string;

    /**
     * Specify the height of an element.
     */
    @Skin('height')
    public Height: string;

    /**
     * Specifies how flex items are aligned along the main axis of the flex container after any flexible lengths and auto margins have been resolved.
     */
    @Skin('justify-content')
    public JustifyContent: string;

    /**
 * Specifies how flex items are aligned along the main axis of the flex container after any flexible lengths and auto margins have been resolved.
 */
    @Skin('justify-items')
    public JustifyItems: string;

    /**
     * Specify the location of the left edge of the positioned element.
     */
    @Skin('left')
    public Left: string;

    /**
     * Sets the extra spacing between letters.
     */
    @Skin('letter-spacing')
    public LetterSpacing: string;

    /**
     * Sets the height between lines of text.
     */
    @Skin('line-height')
    public LineHeight: string;

    /**
     * Defines the display style for a list and list elements.
     */
    @Skin('list-style')
    public ListStyle: string;

    /**
     * Specifies the image to be used as a list-item marker.
     */
    @Skin('list-style-image')
    public ListStyleImage: string;

    /**
     * Specifies the position of the list-item marker.
     */
    @Skin('list-style-position')
    public ListStylePosition: string;

    /**
     * Specifies the marker style for a list-item.
     */
    @Skin('list-style-type')
    public ListStyleType: string;

    /**
     * Sets the margin on all four sides of the element.
     */
    @Skin('margin')
    public Margin: string;

    /**
     * Sets the bottom margin of the element.
     */
    @Skin('margin-bottom')
    public MarginBottom: string;

    /**
     * Sets the left margin of the element.
     */
    @Skin('margin-left')
    public MarginLeft: string;

    /**
     * Sets the right margin of the element.
     */
    @Skin('margin-right')
    public MarginRight: string;

    /**
     * Sets the top margin of the element.
     */
    @Skin('margin-top')
    public MarginTop: string;

    /**
     * Specify the maximum height of an element.
     */
    @Skin('max-height')
    public MaxHeight: string;

    /**
     * Specify the maximum width of an element.
     */
    @Skin('max-width')
    public MaxWidth: string;

    /**
     * Specify the minimum height of an element.
     */
    @Skin('min-height')
    public MinHeight: string;

    /**
     * Specify the minimum width of an element.
     */
    @Skin('min-width')
    public MinWidth: string;

    /**
     * Specifies the transparency of an element.
     */
    @Skin('opacity')
    public Opacity: string;

    /**
     * Specifies the order in which a flex items are displayed and laid out within a flex container.
     */
    @Skin('order')
    public Order: string;

    /**
     * Sets the width, style, and color for all four sides of an element's outline.
     */
    @Skin('outline')
    public Outline: string;

    /**
     * Sets the color of the outline.
     */
    @Skin('outline-color')
    public OutlineColor: string;

    /**
     * Set the space between an outline and the border edge of an element.
     */
    @Skin('outline-offset')
    public OutlineOffset: string;

    /**
     * Sets a style for an outline.
     */
    @Skin('outline-style')
    public OutlineStyle: string;

    /**
     * Sets the width of the outline.
     */
    @Skin('outline-width')
    public OutlineWidth: string;

    /**
     * Specifies the treatment of content that overflows the element's box.
     */
    @Skin('overflow')
    public Overflow: string;

    /**
     * Specifies the treatment of content that overflows the element's box horizontally.
     */
    @Skin('overflow-x')
    public OverflowX: string;

    /**
     * Specifies the treatment of content that overflows the element's box vertically.
     */
    @Skin('overflow-y')
    public OverflowY: string;

    /**
     * Sets the padding on all four sides of the element.
     */
    @Skin('padding')
    public Padding: string;

    /**
     * Sets the padding to the bottom side of an element.
     */
    @Skin('padding-bottom')
    public PaddingBottom: string;

    /**
     * Sets the padding to the left side of an element.
     */
    @Skin('padding-left')
    public PaddingLeft: string;

    /**
     * Sets the padding to the right side of an element.
     */
    @Skin('padding-right')
    public PaddingRight: string;

    /**
     * Sets the padding to the top side of an element.
     */
    @Skin('padding-top')
    public PaddingTop: string;

    /**
     * Insert a page breaks after an element.
     */
    @Skin('page-break-after')
    public PageBreakAfter: string;

    /**
     * Insert a page breaks before an element.
     */
    @Skin('page-break-before')
    public PageBreakBefore: string;

    /**
     * Insert a page breaks inside an element.
     */
    @Skin('page-break-inside')
    public PageBreakInside: string;

    /**
     * Defines the perspective from which all child elements of the object are viewed.
     */
    @Skin('perspective')
    public Perspective: string;

    /**
     * Defines the origin (the vanishing point for the 3D space) for the perspective property.
     */
    @Skin('perspective-origin')
    public PerspectiveOrigin: string;

    /**
     * Specifies how an element is positioned.
     */
    @Skin('position')
    public Position: string;

    /**
     * Specifies quotation marks for embedded quotations.
     */
    @Skin('quotes')
    public Quotes: string;

    /**
     * Specifies whether or not an element is resizable by the user.
     */
    @Skin('resize')
    public Resize: string;

    /**
     * Specify the location of the right edge of the positioned element.
     */
    @Skin('right')
    public Right: string;

    /**
     * Specifies the length of the tab character.
     */
    @Skin('tab-size')
    public TabSize: string;

    /**
     * Specifies a table layout algorithm.
     */
    @Skin('table-layout')
    public TableLayout: string;

    /**
     * Sets the horizontal alignment of inline content.
     */
    @Skin('text-align')
    public TextAlign: string;

    /**
     * Specifies how the last line of a block or a line right before a forced line break is aligned when text-align is justify.
     */
    @Skin('text-align-last')
    public TextAlignLast: string;

    /**
     * Specifies the decoration added to text.
     */
    @Skin('text-decoration')
    public TextDecoration: string;

    /**
     * Specifies the color of the text-decoration-line.
     */
    @Skin('text-decoration-color')
    public TextDecorationColor: string;

    /**
     * Specifies what kind of line decorations are added to the element.
     */
    @Skin('text-decoration-line')
    public TextDecorationLine: string;

    /**
     * Specifies the style of the lines specified by the text-decoration-line property
     */
    @Skin('text-decoration-style')
    public TextDecorationStyle: string;

    /**
     * Indent the first line of text.
     */
    @Skin('text-indent')
    public TextIndent: string;

    /**
     * Specifies the justification method to use when the text-align property is set to justify.
     */
    @Skin('text-justify')
    public TextJustify: string;

    /**
     * Specifies how the text content will be displayed, when it overflows the block containers.
     */
    @Skin('text-overflow')
    public TextOverflow: string;

    /**
     * Applies one or more shadows to the text content of an element.
     */
    @Skin('text-shadow')
    public TextShadow: string;

    /**
     * Transforms the case of the text.
     */
    @Skin('text-transform')
    public TextTransform: string;

    /**
     * Specify the location of the top edge of the positioned element.
     */
    @Skin('top')
    public Top: string;

    /**
     * Applies a 2D or 3D transformation to an element.
     */
    @Skin('transform')
    public Transform: string;

    /**
     * Defines the origin of transformation for an element.
     */
    @Skin('transform-origin')
    public TransformOrigin: string;

    /**
     * Specifies how nested elements are rendered in 3D space.
     */
    @Skin('transform-style')
    public TransformStyle: string;

    /**
     * Defines the transition between two states of an element.
     */
    @Skin('transition')
    public Transition: string;

    /**
     * Specifies when the transition effect will start.
     */
    @Skin('transition-delay')
    public TransitionDelay: string;

    /**
     * Specifies the number of seconds or milliseconds a transition effect should take to complete.
     */
    @Skin('transition-duration')
    public TransitionDuration: string;

    /**
     * Specifies the names of the CSS properties to which a transition effect should be applied.
     */
    @Skin('transition-property')
    public TransitionProperty: string;

    /**
     * Specifies the speed curve of the transition effect.
     */
    @Skin('transition-timing-function')
    public TransitionTimingFunction: string;

    /**
     * Sets the vertical positioning of an element relative to the current text baseline.
     */
    @Skin('vertical-align')
    public VerticalAlign: string;

    /**
     * Specifies whether or not an element is visible.
     */
    @Skin('visibility')
    public Visibility: string;

    /**
     * Specifies how white space inside the element is handled.
     */
    @Skin('white-space')
    public WhiteSpace: string;

    /**
     * 	Specify the width of an element.
     */
    @Skin('width')
    public Width: string;

    /**
     * 	Specifies how to break lines within words.
     */
    @Skin('word-break')
    public WordBreak: string;

    /**
     * Sets the spacing between words.
     */
    @Skin('word-spacing')
    public WordSpacing: string;

    /**
     * Specifies whether to break words when the content overflows the boundaries of its container.
     */
    @Skin('word-wrap')
    public WordWrap: string;

    /**
     * Specifies a layering or stacking order for positioned elements.
     */
    @Skin('z-index')
    public ZIndex: string;


    public constructor(obj: UIViewClass) {
        this.control = obj;
    }

    public GetStyleObject(): any {
        return this.StylePropertyBag;
    }

    public SetStyleObject(styleObject: any) {
        this.StylePropertyBag = styleObject;
    }

    public CloneStyleObject() {
        return clone(this.StylePropertyBag);
    }
    public Assign(other: AppearanceObject): void {
        this.StylePropertyBag = Object.assign(this.StylePropertyBag, other.GetStyleObject());
    }

    public Hash:number;
    private generateHash() {
        let hash = 0, i, chr;
        if (this.content.length === 0) return hash;
        for (i = 0; i < this.content.length; i++) {
            chr = this.content.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }

        this.Hash =  hash;

    }

    private content: string;
    public ToString(): string {
        if (this.isModified) {
            this.isModified = false;
            const sb: StringBuilder = new StringBuilder();
            const focusStyleObject = this.GetStyleObject();
            if (Object.keys(focusStyleObject).length > 0) {
                for (let key in focusStyleObject) {
                    sb.AppendLine(`${key}:${focusStyleObject[key]};`);
                }

            }
            this.content = sb.ToString();
            this.generateHash();

        } else {
            return this.content;
        }

        return this.content;
    }
}