import { viewFunc } from "../getView";
import { TypographyClass } from "./TypographyClass";

export type TypographyFunc = (text: string) => TypographyClass;

export function Typography({ variant }: { variant: string }): TypographyFunc {
    return (text: string) => {
        return viewFunc(TypographyClass, (controller, propertyBag) => {
            return new TypographyClass().setController(controller).PropertyBag(propertyBag).variant(variant).text(text)
        });
    }
}

/* export function Typography(text: string): TypographyClass {
    return viewFunc(TypographyClass, (controller, propertyBag) => {
        return new TypographyClass().setController(controller).PropertyBag(propertyBag).text(text)
    });
} */