import { IAppStoreItem } from './IAppStoreItem';

export interface IAppStoreService {
    GetApps(env: string): Promise<IAppStoreItem[]>;
    GetApps(env: string, category: string): Promise<IAppStoreItem[]>;
}


