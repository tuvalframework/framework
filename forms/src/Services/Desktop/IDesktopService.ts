import { IAppStoreItem } from '../AppStore/IAppStoreItem';
export interface IDesktopService {
    GetUserApps(env: string, user:string): Promise<any>;
    LoadApp(appName: string): Promise<any>;
    InstallApp(env: string, user: string,app: IAppStoreItem):Promise<any>;
}