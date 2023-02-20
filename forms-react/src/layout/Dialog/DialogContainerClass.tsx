import { BREAK, foreach, List } from "@tuval/core";
import React, { Fragment, useEffect, useState } from "react";
import { UIView } from "../../components/UIView/UIView";
import VStackRenderer from "../VStack/VStackRenderer";
import { DialogView } from "./DialogView";



class ModalCollection extends List<DialogView> {
    public Remove(removedItem: DialogView): boolean {
        let found = null;
        foreach(this, ((item: DialogView) => {
            if (item === removedItem) {
                found = item;
                return BREAK;
            }
        }));

        if (found != null) {
            const result = super.Remove(found);
            this.OnDoalogAdded();
            return result;
        } else {
            return false;
        }
    }

    public override Add(item: DialogView): number {
      
       const result = super.Add(item);
       this.OnDoalogAdded();
       return result;
    }

    public OnDoalogAdded() {}
}

export const ModalDialogs = new ModalCollection();

function DialogContainer() {
    const [value, setValue] = useState(0)
    useEffect(()=> {
        ModalDialogs.OnDoalogAdded = () => {
            const newValue = value + 1;
            setValue(newValue)
        }
    })
    
    return (
        <Fragment>
            {ModalDialogs.ToArray().map(dialog => dialog.render())}
        </Fragment>
    )
}


export class DialogContainerClass extends UIView {

   
    public constructor() {
        super();
       
    }

    public render() {
        return (<DialogContainer></DialogContainer>)
    }
}