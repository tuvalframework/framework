import { hypot } from "./hypot";

export function dist(x1: number, y1: number, x2: number, y2: number) {
    if (arguments.length === 4) {
      //2D
      return hypot(arguments[2] - arguments[0], arguments[3] - arguments[1]);
    } else if (arguments.length === 6) {
      //3D
      return hypot(
        arguments[3] - arguments[0],
        arguments[4] - arguments[1],
        arguments[5] - arguments[2]
      );
    }
  };