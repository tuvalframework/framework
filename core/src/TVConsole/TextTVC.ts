import { Override } from "../Reflection/Decorators/ClassInfo";
import { TVC } from "./TVC";
import { Screen } from "./Screen";
import { is } from '../is';

export class TextTVC extends TVC<Screen> {
    @Override
    public CreateScreen(args: any, tags: any): Screen {
        if (!is.NodeEnvironment()) {
            return new Screen(this, args, tags);
        }
        return null as any;
    }
}