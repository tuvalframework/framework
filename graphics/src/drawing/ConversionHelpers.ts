import { CGRectangle } from '@tuval/cg';
import { GraphicsUnit } from './GraphicsUnit';
import { float, Out } from '@tuval/core';
import { Graphics } from './Graphics';
import { CoordinateSpace } from './drawing2D/CoordinateSpace';
import { Matrix, MatrixOrder } from './drawing2D/Matrix';

export class ConversionHelpers {
  public static GraphicsUnitConversion(from: GraphicsUnit, to: GraphicsUnit, dpiX: float, dpiY: float, srcRect: Out<CGRectangle>): void {
    srcRect.value.X = ConversionHelpers.GraphicsUnitConversion1(from, to, dpiX, srcRect.value.X);
    srcRect.value.Y = ConversionHelpers.GraphicsUnitConversion1(from, to, dpiY, srcRect.value.Y);
    srcRect.value.Width = ConversionHelpers.GraphicsUnitConversion1(from, to, dpiX, srcRect.value.Width);
    srcRect.value.Height = ConversionHelpers.GraphicsUnitConversion1(from, to, dpiY, srcRect.value.Height);
  }

  public static GraphicsUnitConversion1(from: GraphicsUnit, to: GraphicsUnit, dpi: float, nSrc: float): float {
    let inchs: float = 0;

    switch (from) {
      case GraphicsUnit.Document:
        inchs = nSrc / 300.0;
        break;
      case GraphicsUnit.Inch:
        inchs = nSrc;
        break;
      case GraphicsUnit.Millimeter:
        inchs = nSrc / 25.4;
        break;
      case GraphicsUnit.Display:
        //if (type == gtPostScript) { /* Uses 1/100th on printers */
        //	inchs = nSrc / 100;
        //} else { /* Pixel for video display */
        inchs = nSrc / dpi;
        //}
        break;
      case GraphicsUnit.Pixel:
      case GraphicsUnit.World:
        inchs = nSrc / dpi;
        break;
      case GraphicsUnit.Point:
        inchs = nSrc / 72.0;
        break;
      //			case GraphicsUnit.Display:
      //				if (type == gtPostScript) { /* Uses 1/100th on printers */
      //					inchs = nSrc / 72.0f;
      //				} else { /* Pixel for video display */
      //					inchs = nSrc / dpi;
      //				}
      //				break;
      default:
        return nSrc;
    }

    switch (to) {
      case GraphicsUnit.Document:
        return inchs * 300.0;
      case GraphicsUnit.Inch:
        return inchs;
      case GraphicsUnit.Millimeter:
        return inchs * 25.4;
      case GraphicsUnit.Display:
        //if (type == gtPostScript) { /* Uses 1/100th on printers */
        //	return inchs * 100;
        //} else { /* Pixel for video display */
        return inchs * dpi;
      //}
      case GraphicsUnit.Pixel:
      case GraphicsUnit.World:
        return inchs * dpi;
      case GraphicsUnit.Point:
        return inchs * 72.0;
      //			case GraphicsUnit.Display:
      //				if (type == gtPostScript) { /* Uses 1/100th on printers */
      //					return inchs * 72.0f;
      //				} else { /* Pixel for video display */
      //					return inchs * dpi;
      //				}
      default:
        return nSrc;
    }
  }

  public static GetGraphicsTransform(
    graphics: Graphics,
    destinationSpace: CoordinateSpace,
    sourceSpace: CoordinateSpace,
    matrix: Out<Matrix>
  ): void {
    let scale_x: float = 0;
    let scale_y: float = 0;

    matrix.value.reset();

    if (destinationSpace !== sourceSpace) {
      scale_x = ConversionHelpers.GraphicsUnitConversion1(graphics.PageUnit, GraphicsUnit.Pixel, graphics.DpiX, 1);
      scale_y = ConversionHelpers.GraphicsUnitConversion1(graphics.PageUnit, GraphicsUnit.Pixel, graphics.DpiY, 1);

      if (graphics.PageUnit !== GraphicsUnit.Display) {
        scale_x *= graphics.PageScale;
        scale_y *= graphics.PageScale;
      }

      // Transform from sourceSpace to CoordinateSpace.Page
      switch (sourceSpace) {
        case CoordinateSpace.World:
          matrix.value.multiply(graphics.modelMatrix, MatrixOrder.Append);
          break;
        case CoordinateSpace.Page:
          break;
        case CoordinateSpace.Device:
          matrix.value.scale(1.0 / scale_x, 1.0 / scale_y, MatrixOrder.Append);
          break;
      }

      // Transform from CoordinateSpace.Page to destinationSpace
      switch (destinationSpace) {
        case CoordinateSpace.World:
          var destWorld = graphics.Transform;
          if (destWorld.IsInvertible) {
            destWorld.invert();
            matrix.value.multiply(destWorld, MatrixOrder.Append);
          }
          break;
        case CoordinateSpace.Page:
          break;
        case CoordinateSpace.Device:
          matrix.value.scale(scale_x, scale_y, MatrixOrder.Append);
          break;
      }
    }
  }
}
