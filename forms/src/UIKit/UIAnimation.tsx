import { ControlHtmlRenderer } from "../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { UIView, ViewProperty } from "./UIView";
import { foreach, StringBuilder } from '@tuval/core';
import { Teact } from "../windows/Forms/Components/Teact";
import { TeactCSSTransition } from '../windows/Forms/Components/csstransition/TeactCSSTransition';
import { IRenderable } from "./IView";
import { IControl } from "../windows/Forms/Components/AAA/IControl";
import { UIController } from "./UIController";
import { viewFunc } from "./getView";

export class UIAnimationRenderer extends ControlHtmlRenderer<UIAnimationClass> {

  public get UseShadowDom(): boolean {
    return true;
  }
  public OnStyleCreating(obj: UIAnimationClass, sb: StringBuilder): void {
    sb.AppendLine(`
        .alert-enter {
            opacity: 0;
            transform: scale(0.9);
          }
          .alert-enter-active {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 300ms, transform 300ms;
          }
          .alert-exit {
            opacity: 1;
          }
          .alert-exit-active {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 300ms, transform 300ms;
          }
        `);
  }

  public GenerateElement(obj: UIAnimationClass): boolean {
    this.WriteStartFragment();
    return true;
  }
  public GenerateBody(obj: UIAnimationClass): void {
    if (!obj.Visible) {
      return;
    }
    this.WriteComponent(
      <TeactCSSTransition
        in={obj.ShowAnimation}
        timeout={300}
        classNames="alert"
        unmountOnExit
        appear
        onEnter={() => console.log('enter -------------------------------------------')}
        onExited={() => console.log('exit -------------------------------------------')}>
        <div>
          {this.CreateControls(obj)}
        </div>
      </TeactCSSTransition>
    );

  }
  protected CreateControls(obj: UIAnimationClass): any[] {
    const vNodes: any[] = [];
    if (obj.GetViews != null) {
      foreach(obj.GetViews(), (view: IRenderable) => {
        if (view != null) {
          vNodes.push(view.Render());
        }
      });
    }
    return vNodes;
  }

}
export class UIAnimationClass extends UIView {
  @ViewProperty()
  ShowAnimation: boolean = false;

  public setController(controller: UIController): this {
    super.setController(controller);
    this.Renderer = new UIAnimationRenderer({
      control: this,
      doNotBind: true,
      renderId: false,
      renderAsAnimated: false
    });
    return this;
  }
  public constructor() {
    super();

    this.ShowAnimation = false;
  }

  public start(show: boolean): this {
    this.ShowAnimation = show;
    return this;
  }

}

export function UIAnimation(...subViews: (UIView | IControl | UIController)[]): UIAnimationClass {
  return viewFunc(UIAnimationClass, (controller, propertyBag) => {
    return new UIAnimationClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
  });

}