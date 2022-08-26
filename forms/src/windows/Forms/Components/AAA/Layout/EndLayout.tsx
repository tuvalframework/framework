import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, foreach, List } from '@tuval/core';
import { InputText } from "../../inputtext/TuInputText";
import { Control, IControlContainer, Modes } from '../Control';
import { ControlCollection } from "../ControlCollection";
import { ControlTypes } from "../../ControlTypes";

@ClassInfo({
    fullName: ControlTypes.ContainerControl,
    instanceof: [
        ControlTypes.ContainerControl,
        ControlTypes.IControlContainer,
    ]
})
export class ContainerControl<T extends Control<any>> extends Control<ContainerControl<T>> implements  IControlContainer{


    public get Controls(): ControlCollection {
        return this.GetProperty('Controls');
    }

    public set Controls(value: ControlCollection) {
        this.SetProperty('Controls', value);
    }


    protected SetupControlDefaults(): void {
        super.SetupControlDefaults();
        this.Controls = new ControlCollection(this);
    }
    protected CreateControls(): any[] {
        const vNodes: any[] = [];
        foreach(this.Controls, (control) => {
            vNodes.push(control.CreateMainElement());
        });
        return vNodes;
    }

    public CreateElements() {
        throw new Error("CreateElements Method not implemented.");
    }

    public GetControls(): List<Control<any>> {
        return this.Controls;
    }


}

export class EndLayout extends ContainerControl<EndLayout> {

    /*   public constructor();
      public constructor(props);
      public constructor(...args: any[]) {
          super(args[0]);
          const props = args[0];
      }
   */

    public CreateElements(): any {
        return (
            <div className="p-d-flex p-jc-end">
                {this.CreateControls()}
            </div>
        );
    }

}