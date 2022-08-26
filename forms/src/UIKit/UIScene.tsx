import { TForm } from '../windows/Forms/Components/AAA/TForm';
import { Color, UIView } from './UIView';
import { foreach, ICollection, IEnumerable, IEnumerator, IList, int } from '@tuval/core';
import { Control } from '../windows/Forms/Components/AAA/Control';
import { Form } from '../windows/Forms/Components/form/Form';
import { Teact } from '../windows/Forms/Components/Teact';
import { UIController } from './UIController';
import { Fragment } from '../preact/compat';
import { ControlCollection } from '../windows/Forms/Components/AAA/ControlCollection';
import { IRenderable } from './IView';
import { IVirtualContainer } from '../windows/Forms/Components/AAA/Panel';
import { IControl } from '../windows/Forms/Components/AAA/IControl';
import { viewFunc } from './getView';
import { ZStack } from './ZStack';
import { UIImage } from './UIImage';
import { VStack } from './VStack';


export class UISceneClass extends UIView implements IVirtualContainer {

    Controls: ControlCollection<any, any>;
    public GetViews(): IRenderable[] {
        return this.SubViews.ToArray();
    }

    public setController(controller: UIController): this {
        super.setController(controller);
        return this;
    }

    public constructor() {
        super();
        //this.Appearance.Width = 'inherit';
        this.Appearance.Display = 'flex';
        this.Appearance.AlignItems = 'center';
        this.Appearance.JustifyContent = 'center';
        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }

    /*  private renderSubViews(): any[] {
         return this.SubViews.ToArray().map(view => {
             if (view instanceof UIController) {
                 return view.CreateMainElement();
             } else {
                 return view.Render();
             }
         });
     }
     public Render() {
         return (
             <Fragment>
                 {this.renderSubViews()}
             </Fragment>
         );
     } */

}

export function UIScene(...subViews: (UIView | IControl | UIController)[]): UISceneClass {
    return viewFunc(UISceneClass, (controller, propertyBag) => {
        return new UISceneClass().setController(controller).PropertyBag(propertyBag).setChilds(...subViews);
    });
}

export interface DesktopPreviewParams {
    width?: number | string;
    height?: number | string;
}
export type FunctionDesktopPreview = (...views: UIView[]) => UIView;

export function DesktopPreview(value: DesktopPreviewParams): FunctionDesktopPreview;
export function DesktopPreview(...subViews: (UIView | IControl | UIController)[]): UIView;
export function DesktopPreview(...args: any[]): UIView | FunctionDesktopPreview {
    if (args.length === 1 && typeof args[0] === 'object' && args[0].constructor === Object && !(args[0] instanceof UIView || args[0] instanceof UIController || args[0] instanceof Control)) {
        const { width, height }: DesktopPreviewParams = args[0];
        return (...views: UIView[]) => {
            return (
                ZStack(
                    UIImage('/static/images/background.png'),
                    VStack(
                        VStack(
                            ...views
                        )
                            .overflow('hidden')
                            .width((width as any) ?? '80%').height((height as any) ?? '70%').background(Color.white).cornerRadius(12)
                    )
                ).minWidth('500px')
            )
        }
    } else {
        return (
            ZStack(
                UIImage('/static/images/background.png'),
                VStack(
                    VStack(
                        ...args
                    ).width('80%').height('70%').background(Color.white).cornerRadius(12)
                )
            ).minWidth('500px')
        )
    }
}

type ForEachIterateFunction<T> = (item: T, index?: number) => UIView;
export function ForEach<T>(enumarable: IEnumerator<T> | IEnumerable<T> | IList<T> | Array<T> | ICollection<T> | Iterator<T> | Iterable<T> | Set<T>): (value: ForEachIterateFunction<T>) => any[] {
    return (enumFunc: ForEachIterateFunction<T>) => {
        const result: any[] = [];
        let index: int = 0;

        const t0 = performance.now();

        /*  if (enumarable != null && (enumarable as any).length) {
             for (let i = 0; i < (enumarable as any).length; i++) {
                 const subView: any = enumFunc(enumarable[i], i);
                 result.push(subView);
             }
         } */

        foreach(enumarable, (item: any) => {
            const subView: any = enumFunc(item, index);
            if (Array.isArray(subView)) {
                foreach(subView, (view: any) => {
                    result.push(view);
                })
            } else {
                result.push(subView);
            }
            index++;
        });

        const t1 = performance.now();
        //console.log(`ForEach ${t1 - t0} milliseconds.`);
        return result;
    }
}

/* export function ForEach(enumarable: any, enumFunc: Function) {
    const result: UIView[] = [];
    let index: int = 0;
    foreach(enumarable, (item: any) => {
        const subView = enumFunc(item, index);
        if (Array.isArray(subView)) {
            foreach(subView, (view: any) => {
                result.push(view);
            })
        } else if (subView instanceof UIView) {
            result.push(subView);
        }
        index++;
    });
    return result;
} */

export function Filter(enumarable: any, enumFunc: Function) {
    const result: IRenderable[] = [];
    foreach(enumarable, (item: IRenderable) => {
        const isAdd = enumFunc(item);
        if (isAdd) {
            result.push(item);
        }
    });
    return result;
}

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

export function Case<T extends UIView>(match: string | number, caseObject: any): T {
    if (caseObject[match] != null) {
        return caseObject[match];
    }
    return null;
}