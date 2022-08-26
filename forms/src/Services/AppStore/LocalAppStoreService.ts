import { IAppStoreService } from './IAppStoreService';
import { IAppStoreItem } from './IAppStoreItem';
import { File, Path, TLoader, FS, singleton, ModuleLoader, instance as container, foreach } from '@tuval/core';

export class LocalAppStoreService implements IAppStoreService {
    private apps: IAppStoreItem[];
    private root: string = 'C:\\Apps';
    public GetApps(env: string): Promise<IAppStoreItem[]>;
    public GetApps(env: string, category: string): Promise<IAppStoreItem[]>;
    public GetApps(...args: any[]): Promise<IAppStoreItem[]> {
        if (args.length === 1) {
            const env: string = args[0];
            return new Promise((resolve, reject) => {
                const filePath = Path.Combine(this.root, env, 'appstore.json');
                /* if (File.Exists(filePath)) {
                    this.apps = this.getApps(filePath);
                    resolve(this.apps);
                } else { */
                TLoader.LoadJSON('./static/appstore.json', filePath).then(e => {
                    FS.syncfs();
                    this.apps = this.getApps(filePath);
                    resolve(this.apps);
                });
                //}
            });
        } else {
            if (args.length === 2) {
                const env: string = args[0];
                const category: string = args[1];
                return new Promise((resolve, reject) => {
                    const filePath = Path.Combine(this.root, env, 'appstore.json');
                    /* if (File.Exists(filePath)) {
                        let apps: any[] = this.getApps(filePath);
                        apps = apps.filter(app => (app.category === category) || category === 'All');
                        resolve(apps);
                    } else { */
                        TLoader.LoadJSON('./static/appstore.json', filePath).then(e => {
                            FS.syncfs();
                            let apps: any[] = this.getApps(filePath);
                            apps = apps.filter(app => (app.category === category) || category === 'All');
                            resolve(apps);
                        });
                   // }
                });
            }
        }
    }
    private getApps(filePath: string): any {
        if (File.Exists(filePath)) {
            const fileData = File.ReadAllText(filePath);
            const apps = JSON.parse(fileData);

            try {
                const appStoreProviders = container.resolveAll('IAppStoreCategory');
                foreach(appStoreProviders, (item: any) => {
                    apps.apps.push(...item.items);
                });
            }
            catch {

            }
            return apps.apps;
        }
    }
}