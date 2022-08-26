import { TApplication } from "./TApplication";
import { List ,EventBus} from "@tuval/core";

export class TaskManager {
    private static Applications: List<TApplication> = new List();
    public static Start(appType: any): Promise<TApplication> {
        return new Promise((resolve,reject)=>{
            const app = new appType();
            app.StartResolve = resolve;
            TaskManager.Applications.Add(app);
            //app.MainForm.Show();
            // EventBus.Default.fire('tuval.desktop.render', {});
            //resolve(app);
        });

    }
    public static Quit(app:TApplication): void {
        TaskManager.Applications.Remove(app);
        EventBus.Default.fire('tuval.desktop.render', {});
    }
    public static GetApplications():TApplication[] {
        return TaskManager.Applications.ToArray();
    }
}