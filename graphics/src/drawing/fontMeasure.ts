
/* let measure = requrie('font-measure')

measure('Roboto') */

import { float } from "@tuval/core"

/*
{
  top: 0,
  median: 0.640625,
  middle: 0.640625,
  bottom: 1.3125,
  alphabetic: 1.03125,
  baseline: 1.03125,
  upper: 0.328125,
  lower: 0.515625,
  capHeight: 0.703125,
  xHeight: 0.515625
  ascent: 0.28125,
  descent: 1.234375,
  hanging: 0.203125,
  ideographic: 1.296875,
  lineHeight: 1.3125,
  overshoot: 0.015625,
  tittle: 0.28125,
}
 */

export interface IFontMetrics {
    top: float
    bottom: float,
    lineHeight: float,
    alphabetic: float,
    baseline: float,
    middle: float,
    median: float,
    hanging: float,
    ideographic: float,
    upper: float,
    capHeight: float,
    lower: float,
    xHeight: float,
    tittle: float,
    ascent: float,
    descent: float,
    overshoot: float
}

measureFont.canvas = document.createElement('canvas')
measureFont.cache = {}

export function measureFont(font, o): IFontMetrics {
    if (!o) o = {}

    if (typeof font === 'string' || Array.isArray(font)) {
        o.family = font
    }

    var family = Array.isArray(o.family) ? o.family.join(', ') : o.family
    if (!family) throw Error('`family` must be defined')

    var fs = o.size || o.fontSize || o.em || 48
    var weight = o.weight || o.fontWeight || ''
    var style = o.style || o.fontStyle || ''
    var font: any = [style, weight, fs].join(' ') + 'px ' + family
    var origin = o.origin || 'top'

    if (measureFont.cache[family]) {
        // return more precise values if cache has them
        if (fs <= measureFont.cache[family].em) {
            return applyOrigin(measureFont.cache[family], origin) as any;
        }
    }

    var canvas = o.canvas || measureFont.canvas
    var ctx = canvas.getContext('2d')
    var chars = {
        upper: o.upper !== undefined ? o.upper : 'H',
        lower: o.lower !== undefined ? o.lower : 'x',
        descent: o.descent !== undefined ? o.descent : 'p',
        ascent: o.ascent !== undefined ? o.ascent : 'h',
        tittle: o.tittle !== undefined ? o.tittle : 'i',
        overshoot: o.overshoot !== undefined ? o.overshoot : 'O'
    }
    var l = Math.ceil(fs * 1.5)
    canvas.height = l
    canvas.width = l * .5
    ctx.font = font

    var char = 'H'
    var result: any = {
        top: 0
    }

    // measure line-height
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'black'
    ctx.fillText(char, 0, 0)
    var topPx: any = firstTop(ctx.getImageData(0, 0, l, l))
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'bottom'
    ctx.fillText(char, 0, l)
    var bottomPx: any = firstTop(ctx.getImageData(0, 0, l, l))
    result.lineHeight =
        result.bottom = l - bottomPx + topPx

    // measure baseline
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(char, 0, l)
    var baselinePx: any = firstTop(ctx.getImageData(0, 0, l, l))
    var baseline = l - baselinePx - 1 + topPx
    result.baseline =
        result.alphabetic = baseline

    // measure median
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'middle'
    ctx.fillText(char, 0, l * .5)
    var medianPx: any = firstTop(ctx.getImageData(0, 0, l, l))
    result.median =
        result.middle = l - medianPx - 1 + topPx - l * .5

    // measure hanging
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'hanging'
    ctx.fillText(char, 0, l * .5)
    var hangingPx: any = firstTop(ctx.getImageData(0, 0, l, l))
    result.hanging = l - hangingPx - 1 + topPx - l * .5

    // measure ideographic
    ctx.clearRect(0, 0, l, l)
    ctx.textBaseline = 'ideographic'
    ctx.fillText(char, 0, l)
    var ideographicPx: any = firstTop(ctx.getImageData(0, 0, l, l))
    result.ideographic = l - ideographicPx - 1 + topPx

    // measure cap
    if (chars.upper) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.upper, 0, 0)
        result.upper = firstTop(ctx.getImageData(0, 0, l, l))
        result.capHeight = (result.baseline - result.upper)
    }

    // measure x
    if (chars.lower) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.lower, 0, 0)
        result.lower = firstTop(ctx.getImageData(0, 0, l, l))
        result.xHeight = (result.baseline - result.lower)
    }

    // measure tittle
    if (chars.tittle) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.tittle, 0, 0)
        result.tittle = firstTop(ctx.getImageData(0, 0, l, l))
    }

    // measure ascent
    if (chars.ascent) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.ascent, 0, 0)
        result.ascent = firstTop(ctx.getImageData(0, 0, l, l))
    }

    // measure descent
    if (chars.descent) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.descent, 0, 0)
        result.descent = firstBottom(ctx.getImageData(0, 0, l, l))
    }

    // measure overshoot
    if (chars.overshoot) {
        ctx.clearRect(0, 0, l, l)
        ctx.textBaseline = 'top'
        ctx.fillText(chars.overshoot, 0, 0)
        var overshootPx: any = firstBottom(ctx.getImageData(0, 0, l, l))
        result.overshoot = overshootPx - baseline
    }

    // normalize result
    for (var name in result) {
        result[name] /= fs
    }

    result.em = fs
    measureFont.cache[family] = result

    return applyOrigin(result, origin) as any;

    function applyOrigin(obj, origin) {
        var res = {}
        if (typeof origin === 'string') origin = obj[origin]
        for (var name in obj) {
            if (name === 'em') continue
            res[name] = obj[name] - origin
        }
        return res
    }

    function firstTop(iData) {
        var l = iData.height
        var data = iData.data
        for (var i = 3; i < data.length; i += 4) {
            if (data[i] !== 0) {
                return Math.floor((i - 3) * .25 / l)
            }
        }
    }

    function firstBottom(iData) {
        var l = iData.height
        var data = iData.data
        for (var i = data.length - 1; i > 0; i -= 4) {
            if (data[i] !== 0) {
                return Math.floor((i - 3) * .25 / l)
            }
        }
    }
}