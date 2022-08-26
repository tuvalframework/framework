import { IDesktopService } from './IDesktopService';
import { File, Path, TLoader, FS, singleton, ModuleLoader, TString, Encoding, using, FileStream, FileMode, FileAccess } from '@tuval/core';
import { IAppStoreItem } from '../AppStore';

export class LocalDesktopService implements IDesktopService {
    private appsInfo: any;

    public LoadApp(appName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const app: any = this.appsInfo.Applications.filter(_app => {
                return _app.name === appName;
            })[0];

            if (app != null) {
                if (app.encoded) {
                    ModuleLoader.LoadBundledModuleWithDecode(app.url, app.name).then((_app: any) => {
                        if (_app != null) {
                            resolve(_app);
                        } else {

                        }
                    });
                } else {
                    ModuleLoader.LoadBundledModule(app.url, app.name).then((_app: any) => {
                        if (_app != null) {
                            resolve(_app)
                        } else {

                        }
                    });
                }
            } else {
                reject('app bulunamadı.');
            }
        });

    }
    private root: string = 'C:\\Apps';
    public GetUserApps(env: string, user: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const filePath = Path.Combine(this.root, env, user, 'Applications.json');
            if (File.Exists(filePath)) {
                this.appsInfo = this.getUserApps(filePath);
                resolve(this.appsInfo.Applications);
            } else {
                TLoader.LoadJSON('/static/Applications.json', filePath).then(e => {
                    FS.syncfs();
                    this.appsInfo = this.getUserApps(filePath);
                    resolve(this.appsInfo.Applications);
                });
            }
        });
    }
    private getUserApps(filePath: string): any {
        if (File.Exists(filePath)) {
            const fileData = File.ReadAllText(filePath);
            const apps = JSON.parse(fileData);
            return apps;
        }
    }

    public InstallApp(env: string, user: string, app: IAppStoreItem): Promise<any> {
        return new Promise((resolve, reject) => {
            const filePath = Path.Combine(this.root, env, user, 'Applications.json');
            if (File.Exists(filePath)) {
                const applicationsJSON = File.ReadAllText(filePath);
                const applications = JSON.parse(applicationsJSON);
                const appInfo = {
                    icon: app.icon,
                    name: app.id,
                    text: app.name,
                    service: app.service,
                    application: app.application,
                    encoded: true,
                    url: TString.Format("/applications/{0}.app", app.id)
                }
                applications.Applications.push(appInfo);
                this.appsInfo = applications;
                const newJSON = JSON.stringify(applications);
                const newJSONBuffer = Encoding.UTF8.GetBytes(newJSON);
                using(new FileStream(filePath, FileMode.Append, FileAccess.Write), (fs) => {
                    fs.Write(newJSONBuffer, 0, newJSONBuffer.length);
                    fs.Close();
                });

                FS.syncfs(false, () => {
                    resolve(appInfo);
                });

            }
        });

    }

}