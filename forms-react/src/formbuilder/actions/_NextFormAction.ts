import { UIFormController } from "../../UIFormController";
import { Action } from "./Action";


export class _NextFormAction extends Action {
    public get Type(): string {
        return 'next';
    }

    public Execute({ controller, dialog }: { controller: UIFormController; dialog: any; }): Promise<any> {
        return new Promise((resolve, reject) => {
            dialog.nextForm();
            resolve(true);
        })
    }

}