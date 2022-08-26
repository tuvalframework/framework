import { TVC,Override } from "@tuval/core";
import { GuiScreen } from "./GUIScreen";

export class GuiTVC extends TVC<GuiScreen> {
    @Override
    public CreateScreen(args: any, tags: any): GuiScreen {
        return new GuiScreen(this, args, tags);
    }
}