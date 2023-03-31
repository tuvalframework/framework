import { UIView } from "./components/UIView/UIView";

type TrueCaseFunction = (view: UIView) => FalseCaseFunction;
type FalseCaseFunction = { else: (view: UIView) => UIView };
export function If(condition: boolean): TrueCaseFunction {
    return (trueContent: UIView) => {
        return {
            else: (falseContent: UIView) => {
                if (condition) {
                    return trueContent;
                } else {
                    return falseContent;
                }
            }
        }
    }
}