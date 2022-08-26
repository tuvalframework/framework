import { UIController } from "../UIController";
import { UIView, ViewProperty } from "../UIView";
import { int } from '@tuval/core';
import { UIMediaPlayerRenderer } from "./UIMediaPlayerRenderer";


export class UIMediaPlayerClass extends UIView {

    /**
    * @internal
    */
    @ViewProperty() vp_Url: string;
    public url(value: string): this {
        this.vp_Url = value;
        return this;
    }

    /**
   * @internal
   */
    @ViewProperty() vp_PreviewImage: string;
    public previewImage(value: string): this {
        this.vp_PreviewImage = value;
        return this;
    }

    /**
    * @internal
    */
    @ViewProperty() vp_Logo: string;
    public logo(value: string): this {
        this.vp_Logo = value;
        return this;
    }

    /**
   * @internal
   */
    @ViewProperty() vp_Playing: boolean;
    public playing(value: boolean): this {
        this.vp_Playing = value;
        return this;
    }

      /**
     * @internal
     */
       @ViewProperty() vp_OnProgress: Function;
       public onProgress(value: Function): this {
           this.vp_OnProgress = value;
           return this;
       }

         /**
         * @internal
         */
          @ViewProperty() vp_OnEnded: Function;
          public onEnded(value: Function): this {
              this.vp_OnEnded = value;
              return this;
          }

    public setController(controller: UIController): this {
        super.setController(controller);
        this.Renderer = new UIMediaPlayerRenderer({
            control: this,
            doNotBind: true,
            renderId: false
        });

        return this;
    }
    public constructor() {
        super();

        this.Appearance.Width = '100%';
        this.Appearance.Height = '100%';
    }


}