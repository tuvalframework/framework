import { int, is, StringBuilder } from '@tuval/core';
import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { IControl } from "../windows/Forms/Components/AAA/IControl";
import { viewFunc } from './getView';
import { UIController } from './UIController';
import { UIView, ViewProperty } from "./UIView";
import { Skeleton } from './Components/skeleton/Skeleton';
import { Teact } from '../windows/Forms/Components/Teact';

interface IImage extends IControl {
    Src: string;
    Img?: any;
}

class ImageRenderer extends ControlHtmlRenderer<IImage> {
    public get UseShadowDom(): boolean {
        return true;
    }

    public OnStyleCreating(obj: UIImageClass, sb: StringBuilder): void {

        if (obj.vp_Skeleton === true) {
            sb.AppendLine(require('./Components/skeleton/Skeleton.css'));
            sb.AppendLine(require('./Components/skeleton/Thema.css'));
        }
    }

    public GenerateElement(obj: IImage): boolean {
        this.WriteStartFragment();
        return true;
    }

    protected OnComponentDidMount(ref: HTMLElement, obj: UIImageClass): void {
        //For image caching
        if (ref != null && obj.Img != null && obj.vp_Skeleton !== true) {
            obj.Img.style.height = obj.vp_ImageWidth ?? obj.Appearance.Width;
            obj.Img.style.width = obj.vp_ImageHeight ?? obj.Appearance.Height;
            ref.appendChild(obj.Img);
        }
    }

    public GenerateBody(obj: UIImageClass): void {
        if (obj.Img == null && obj.vp_Skeleton !== true) {
            this.WriteStartElement('img');
            this.WriteAttrVal('src', obj.Src);
            this.WriteStyleAttrVal('width', obj.vp_ImageWidth ?? obj.Appearance.Width);
            this.WriteStyleAttrVal('height', obj.vp_ImageHeight ?? obj.Appearance.Height);
            this.WriteStyleAttrVal('max-width',  obj.Appearance.MaxWidth);
            this.WriteStyleAttrVal('max-height', obj.Appearance.MaxHeight);
            this.WriteStyleAttrVal('border-radius', obj.Appearance.BorderRadius);
            this.WriteEndElement();
        }

        if (obj.vp_Skeleton === true) {
            this.WriteComponent(
                <Skeleton width="100%" height="100%" animation="wave" shape='rectangle' borderRadius={obj.Appearance.BorderRadius} />
            )
        }
    }
}

export class UIImageClass extends UIView implements IImage {

    /** @internal */
    @ViewProperty() Src: string;
    /** @internal */
    @ViewProperty() Img: HTMLImageElement;
    @ViewProperty() vp_ImageWidth: string;
    @ViewProperty() vp_ImageHeight: string;

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new ImageRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });
        return this;
    }
    public constructor() {
        super();

        this.Appearance.Display = 'flex';
        this.Appearance.JustifyContent = 'center';
        this.Appearance.AlignContent = 'center';
        this.Appearance.JustifyItems = 'center';
        this.Appearance.AlignItems = 'center';

    }
    public src(value: string): this {
        this.Src = value;
        return this;
    }
    public img(value: HTMLImageElement): this {
        this.Img = value;
        return this;
    }

    public imageWidth(value: int | string): this {
        if (is.string(value)) {
            this.vp_ImageWidth = value;
        } else {
            this.vp_ImageWidth = `${value}px`;
        }

        return this;
    }

    public imageHeight(value: int | string): this {
        if (is.string(value)) {
            this.vp_ImageHeight = value;
        } else {
            this.vp_ImageHeight = `${value}px`;
        }

        return this;
    }

    /*   public width(): this;
      public width(value: int): this;
      public width(value: string): this;
      public width(...args: any[]): this {
          if (args.length === 0) {
              this.Width = 'auto' as any;
              return this;
          } else if (args.length === 1 && is.number(args[0])) {
              const value = args[0];
              this.Width = `${value}px` as any;
              return this;
          } else if (args.length === 1 && is.string(args[0])) {
              const value: string = args[0];
              this.Width = value as any;
              return this;
          }

          throw `ArgumentOutOfRange Exception in UIImageClass::width method. Argument count: ${args.length}`;
      } */


    /*  public height(): this;
     public height(value: int): this;
     public height(value: string): this;
     public height(...args: any[]): this {
         if (args.length === 0) {
             this.Height = 'auto' as any;
             return this;
         } else if (args.length === 1 && is.number(args[0])) {
             const value = args[0];
             this.Height = `${value}px` as any;
             return this;
         } else if (args.length === 1 && is.string(args[0])) {
             const value: string = args[0];
             this.Height = value as any;
             return this;
         }

         throw `ArgumentOutOfRange Exception in UIImageClass::height method. Argument count: ${args.length}`;
     } */

}

export function UIImage(src: string): UIImageClass {
    const emptyImage = 'data:image/svg+xml;base64,PHN2ZyBpZD0iYjM4OGU5NDQtNTUwOS00OWM5LTg0ZDctZjM4YmZmYTk5NWIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHZpZXdCb3g9IjAgMCAxIDEiPg0KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50IiAvPg0KPC9zdmc+';
    if (is.nullOrEmpty(src)) {
        src = emptyImage;
    }
    return viewFunc(UIImageClass, (controller, propertyBag) => {
        return new UIImageClass().setController(controller).PropertyBag(propertyBag).src(src);;
    });
}