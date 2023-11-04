import { UIView } from "../../components/UIView/UIView";
import { GeometryClass } from "./GeometryClass";


export function Geometry(view: (params) => UIView) {
    return new GeometryClass().children(view);
}