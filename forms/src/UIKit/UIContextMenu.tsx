import { Teact } from "../windows/Forms/Components/Teact";
import { ControlHtmlRenderer } from '../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer';
import { UIView, ViewProperty } from "./UIView";
import { foreach, StringBuilder, CONTINUE } from '@tuval/core';
import { ContextMenu } from './Components/contextmenu/ContextMenu';
import React, { createElement, Fragment } from "../preact/compat";
import { IRenderable } from "./IView";
import { ContextMenuComponent } from "../windows/Forms/Components/contextmenu/ContextMenu";
import { Menu } from './Components/menu/Menu';
import { classNames } from "./Components/utils/ClassNames";
import { UIController } from "./UIController";
import { getView, viewFunc } from "./getView";
import { DividerClass } from "./Divider";

export class UIContextMenuRenderer extends ControlHtmlRenderer<UIContextMenuClass> {
   shadowDom: any;
   protected menu: any;
   /*  public get UseShadowDom(): boolean {
       return true;
    } */

   public OnStyleCreating(obj: UIContextMenuClass, sb: StringBuilder): void {

      sb.AppendLine(`
      .p-menu-overlay {
         position: absolute;
     }

     .p-menu ul {
         margin: 0;
         padding: 0;
         list-style: none;
     }

     .p-menu .p-menuitem-link {
         cursor: pointer;
         display: flex;
         align-items: center;
         text-decoration: none;
         overflow: hidden;
         position: relative;
     }

     .p-menu .p-menuitem-text {
         line-height: 1;
     }


     /* Theme */

     .p-menu {
         padding: 0.25rem 0;
         background: #ffffff;
         color: #495057;
         border: 1px solid #dee2e6;
         border-radius: 6px;
         width: 12.5rem;
     }

     .p-menu .p-menuitem-link {
         padding: 0.55rem 0.75rem;
         color: #495057;
         border-radius: 0;
         transition: box-shadow 0.2s;
         user-select: none;
     }

     .p-menu .p-menuitem-link .p-menuitem-text {
         color: #495057;
     }

     .p-menu .p-menuitem-link .p-menuitem-icon {
         color: #6c757d;
         margin-right: 0.5rem;
     }

     .p-menu .p-menuitem-link .p-submenu-icon {
         color: #6c757d;
     }

     .p-menu .p-menuitem-link:not(.p-disabled):hover {
         background: #e9ecef;
     }

     .p-menu .p-menuitem-link:not(.p-disabled):hover .p-menuitem-text {
         color: #495057;
     }

     .p-menu .p-menuitem-link:not(.p-disabled):hover .p-menuitem-icon {
         color: #6c757d;
     }

     .p-menu .p-menuitem-link:not(.p-disabled):hover .p-submenu-icon {
         color: #6c757d;
     }

     .p-menu .p-menuitem-link:focus {
         outline: 0 none;
         outline-offset: 0;
         box-shadow: inset 0 0 0 0.15rem #C7D2FE;
     }

     .p-menu.p-menu-overlay {
         background: #ffffff;
         border: 0 none;
         box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
     }

     .p-menu .p-submenu-header {
         margin: 0;
         padding: 0.75rem 1.25rem;
         color: #343a40;
         background: #ffffff;
         font-weight: 700;
         border-top-right-radius: 0;
         border-top-left-radius: 0;
     }

     .p-menu .p-menu-separator {
         border-top: 1px solid #dee2e6;
         margin: 0.25rem 0;
     }

        `);
   }

   public GenerateElement(obj: UIContextMenuClass): boolean {
      this.WriteStartFragment();
      return true;
   }


   protected OnShadowDomDidMount(ref: any, obj: UIContextMenuClass): void {
      this.shadowDom = ref;
   }

   /*    protected OnShadowDomWillMount(ref: any, obj: UIContextMenuClass): void {
         const prevMenu = document.getElementById('mu_context_menu');
         if (prevMenu) {
            prevMenu.remove();
         }
      } */


   public GenerateBody(obj: UIContextMenuClass): void {
      const items = [];

      debugger;

      // onClick={(e) => { view.FireClick(e); options.onClick(e); }

      foreach(obj.items, root => {
         const view: UIView = getView(obj instanceof UIController ? obj : (obj as any).controller, root) as any;
         if (view == null) {
            return CONTINUE;
         } else if (view instanceof DividerClass) {
            items.push({ separator: true });
         } else {
            items.push({
              // command: (event) => console.log('clicked'),
               template: (item, options) => {
                  return (
                     <div className={options.className} target={item.target}  onClick={options.onClick}>
                        {view.Render()}
                     </div>
                  );
               }
            })
         }

      });

      const style = {};
      style['width'] = obj.Appearance.Width;
      style['height'] = obj.Appearance.Height;
      style['padding'] = obj.Appearance.Padding;

      obj.Appearance.Padding = '';


      const _items = [

         {
            label: 'React Website',
            icon: 'pi pi-external-link',
            url: 'https://reactjs.org/'
         },
         {
            label: 'Router',
            icon: 'pi pi-upload',
            template: (item, options) => {
               return (
                  <div className={options.className} target={item.target} onClick={options.onClick} >
                    Test
                  </div>
               );
            },
            command: (e) => {
               alert('')
            }
         }


      ];


      this.WriteComponent(
         <Fragment>
            <div style={style} onclick={(e) => { this.menu.toggle(e); /* e.stopPropagation(); e.preventDefault(); */ }}>
               {this.CreateControls(obj)}
               <Menu id='mu_context_menu' popup model={items} ref={el => this.menu = el}></Menu>
            </div>
         </Fragment>
      );
   }

   protected CreateControls(obj: UIContextMenuClass): any[] {
      const vNodes: any[] = [];

      if ((obj as any).SubViews != null) {
         foreach(obj.GetViews(), (root: IRenderable) => {
            const view = getView(obj instanceof UIController ? obj : (obj as any).controller, root);
            if (view != null) {
               vNodes.push(view.Render());
            }
         });
      }

      return vNodes;
   }
}


export class UIContextMenuClass extends UIView {
   @ViewProperty()
   public items: UIView[];

   public setController(controller: UIController): this {
      super.setController(controller);
      this.Renderer = new UIContextMenuRenderer({
         control: this,
         doNotBind: true,
         renderId: false
      });

      return this;
   }
   public constructor() {
      super();
      // Default renderer


   }

   public setItems(...items: UIView[]): this {
      this.items = items;
      return this;
   }
}

type FunctionUIContextMenu = (...content: UIView[]) => UIContextMenuClass;
export function UIContextMenu(...items: UIView[]): FunctionUIContextMenu {
   return (...content: UIView[]) => {
      return viewFunc(UIContextMenuClass, (controller, propertyBag) => {
         return new UIContextMenuClass().setController(controller).PropertyBag(propertyBag).setChilds(...content).setItems(...items);
      });
   }
}