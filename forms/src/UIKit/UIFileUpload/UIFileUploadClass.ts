import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { IUploadFileReady } from "./IUploadFileReady";
import { UIFileUploadRenderer } from "./UIFileUploadRenderer";

export class UIFileUploadClass extends UIView {

   @ViewProperty()
   public FileReady: (value: IUploadFileReady) => void;

   @ViewProperty() vp_AllowedExtensions: string;

   public setController(controller: UIController): this {
      super.setController(controller);
      this.Renderer = new UIFileUploadRenderer({
         control: this,
         doNotBind: true,
         renderId: false
      });

      return this;
   }
   public constructor() {
      super();
      // Default renderer

      /* this.Appearance.Width = '100%';
      this.Appearance.Height = '100%'; */


   }

   public onFileReady(value: (param: IUploadFileReady) => void): this {
      this.FileReady = value;
      return this;
   }

   public allowedExtensions(value: string): this {
      this.vp_AllowedExtensions = value;
      return this;
   }

   /* public setItems(...items: UIView[]): this {
      this.items = items;
      return this;
   } */
}