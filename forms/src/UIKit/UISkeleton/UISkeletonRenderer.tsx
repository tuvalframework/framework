import { StringBuilder } from "@tuval/core";
import { Fragment } from "../../preact";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Skeleton } from "../Components/skeleton/Skeleton";
import { Steps } from "../Components/steps/Steps";
import { classNames } from "../Components/utils/ClassNames";
import { UISkeletonClass } from "./UISkeletonClass";

export class UISkeletonRenderer extends ControlHtmlRenderer<UISkeletonClass> {
    shadowDom: any;
    protected menu: any;
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UISkeletonClass, sb: StringBuilder): void {
        sb.AppendLine(require('../Components/skeleton/Skeleton.css'));
        sb.AppendLine(require('../Components/skeleton/Thema.css'));
    }

    public GenerateElement(obj: UISkeletonClass): boolean {
        this.WriteStartFragment();
        return true;
    }

    public GenerateBody(obj: UISkeletonClass): void {
        this.WriteComponent(
            <Skeleton width="100%" height="100%" animation="wave" shape='rectangle' borderRadius="16px"/>
        );
    }
}