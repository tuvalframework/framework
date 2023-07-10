import { UIFormController } from "../../UIFormController";


export abstract class Action {
    public abstract get Type(): string;
    public abstract Execute({action, formMetaData,controller, dialog}: {action: any,formMetaData: any, controller:UIFormController,dialog: any}): Promise<any>;
}