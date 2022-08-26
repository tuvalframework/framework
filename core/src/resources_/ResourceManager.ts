import { IResource, IResourceItem, IResourcePage } from './../Reflection/Assembly';
import { Assembly } from "../Reflection/Assembly";
import { TString } from '../Text/TString';

export class ResourceManager {
    private m_Culture: string;
    private m_ResourcePage: string = '';
    private m_ResourceItems: IResourceItem[] = [];
    public constructor(resourceName: string) {
        this.m_Culture = 'tr-TR';
        this.m_ResourcePage = resourceName;
        Assembly.Resources.forEach((cuture) => {
            if (cuture.culture === this.m_Culture) {
                cuture.resources.forEach((page) => {
                    if (page.name === resourceName) {
                        this.m_ResourceItems = page.resources;
                    }
                });
            }
        });

    }
    public /* virtual */ GetString(name: string): string {
        let result: string = TString.Empty;
        this.m_ResourceItems.forEach((resource: IResourceItem) => {
            if (resource.key === name) {
                result = resource.value as string;
            }
        });
        return result;
    }
}