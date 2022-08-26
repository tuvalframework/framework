import { AppearanceObject } from "../windows/Forms/Components/AAA/AppearanceObject";

export interface IRenderable {
    Appearance:AppearanceObject;
    Render(): any;
}