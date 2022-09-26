import { foreach } from "@tuval/core";
import { useEffect, useRef } from "../../hooks";
import { Fragment } from "../../preact/compat";
import { ControlHtmlRenderer } from "../../windows/Forms/Components/AAA/HtmlRenderer/ControlHtmlRenderer";
import { Teact } from "../../windows/Forms/Components/Teact";
import { Avatar } from "../Components/avatar/Avatar";
import { OverlayPanel } from "../Components/overlaypanel/OverlayPanel";
import { SlideMenu } from "../Components/slidemenu/SlideMenu";
import { getView } from "../getView";
import { IRenderable } from "../IView";
import { UIController } from "../UIController";
import { SlideMenuViewClass } from "./SlideMenuViewClass";


export class SlideMenuViewRenderer extends ControlHtmlRenderer<SlideMenuViewClass> {
   overlay: any;

   public GenerateElement(obj: SlideMenuViewClass): boolean {
      this.WriteStartFragment();
      return true;
   }

   public override GetCustomJss(): Object {
      return {
          '& .p-slidemenu': {
              border:'solid 0px'
          }
      }
  }

   public GenerateBody(obj: SlideMenuViewClass): void {
      const items = [
         {
            label: 'File',
            icon: 'pi pi-fw pi-file',
            items: [
               {
                  label: 'New',
                  icon: 'pi pi-fw pi-plus',
                  items: [
                     {
                        label: 'Bookmark',
                        icon: 'pi pi-fw pi-bookmark'
                     },
                     {
                        label: 'Video',
                        icon: 'pi pi-fw pi-video'
                     },

                  ]
               },
               {
                  label: 'Delete',
                  icon: 'pi pi-fw pi-trash'
               },
               {
                  separator: true
               },
               {
                  label: 'Export',
                  icon: 'pi pi-fw pi-external-link'
               }
            ]
         },
         {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
               {
                  label: 'Left',
                  icon: 'pi pi-fw pi-align-left'
               },
               {
                  label: 'Right',
                  icon: 'pi pi-fw pi-align-right'
               },
               {
                  label: 'Center',
                  icon: 'pi pi-fw pi-align-center'
               },
               {
                  label: 'Justify',
                  icon: 'pi pi-fw pi-align-justify'
               },

            ]
         },
         {
            label: 'Users',
            icon: 'pi pi-fw pi-user',
            items: [
               {
                  label: 'New',
                  icon: 'pi pi-fw pi-user-plus',

               },
               {
                  label: 'Delete',
                  icon: 'pi pi-fw pi-user-minus',

               },
               {
                  label: 'Search',
                  icon: 'pi pi-fw pi-users',
                  items: [
                     {
                        label: 'Filter',
                        icon: 'pi pi-fw pi-filter',
                        items: [
                           {
                              label: 'Print',
                              icon: 'pi pi-fw pi-print'
                           }
                        ]
                     },
                     {
                        icon: 'pi pi-fw pi-bars',
                        label: 'List'
                     }
                  ]
               }
            ]
         },
         {
            label: 'Events',
            icon: 'pi pi-fw pi-calendar',
            items: [
               {
                  label: 'Edit',
                  icon: 'pi pi-fw pi-pencil',
                  items: [
                     {
                        label: 'Save',
                        icon: 'pi pi-fw pi-calendar-plus'
                     },
                     {
                        label: 'Delete',
                        icon: 'pi pi-fw pi-calendar-minus'
                     },

                  ]
               },
               {
                  label: 'Archieve',
                  icon: 'pi pi-fw pi-calendar-times',
                  items: [
                     {
                        label: 'Remove',
                        icon: 'pi pi-fw pi-calendar-minus'
                     }
                  ]
               }
            ]
         },
         {
            separator: true
         },
         {
            label: 'Quit',
            icon: 'pi pi-fw pi-power-off'
         }
      ];


      this.WriteComponent(
         <SlideMenu viewportHeight={obj.vp_ViewportHeight} model={items} />
      );
   }

   protected CreateControls(obj: SlideMenuViewClass): any[] {
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