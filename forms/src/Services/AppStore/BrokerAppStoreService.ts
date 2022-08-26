import { IAppStoreService } from './IAppStoreService'
import { singleton } from '@tuval/core'
import { IAppStoreItem } from './IAppStoreItem'

export class BrokerAppStoreService implements IAppStoreService {
  public GetApps(env: string): Promise<IAppStoreItem[]> {
    return new Promise((resolve, reject) => {
      /*   const a = new GetAppsRequest();
            a.HandshakeId = 5;
            a.Send().then(apps => {
                resolve(apps as any); */
      /*  foreach(apps, (app: any) => {
                     const item = new CardViewItem();
                     item.Title = app.name;
                     item.SubTitle = app.category;
                     item.Image = app.icon;
                     this.cardView.Items.Add(item);
                 }); */
      /*  }); */
    })
  }
}
