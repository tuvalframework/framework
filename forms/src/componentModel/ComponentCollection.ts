import { ReadOnlyCollectionBase, IEnumerator, IDisposable, System, as, int } from "@tuval/core"
import { IComponent } from "./IComponent"

export class __ComponentCollection extends ReadOnlyCollectionBase<IComponent> {

    protected _getCount(): number {
        return super.Get_Count();
    }

    protected _getEnumerator(): IEnumerator<IComponent> {
        return super.GetEnumerator();
    }
    /// <summary>Gets any component in the collection matching the specified name.</summary>
    /// <returns>A component with a name matching the name specified by the <paramref name="name" /> parameter, or null if the named component cannot be found in the collection.</returns>
    /// <param name="name">The name of the <see cref="T:System.ComponentModel.IComponent" /> to get. </param>
    public get(name: string): IComponent {

        let component: IComponent;
        if (name != null) {
            const enumerator: IEnumerator<IComponent> = super.GetEnumerator();
            try {
                while (enumerator.MoveNext()) {
                    const current: IComponent = enumerator.Current as any;
                    if (current == null || current.Site == null || current.Site.Name == null || current.Site.Name !== name) {
                        continue;
                    }
                    component = current;
                    return component;
                }
                return null as any;
            }
            finally {
                const disposable: IDisposable = as(enumerator, System.Types.Disposable.IDisposable);
                if (disposable != null) {
                    disposable.Dispose();
                }
            }
        }
        return null as any;

    }



    /// <summary>Initializes a new instance of the <see cref="T:System.ComponentModel.ComponentCollection" /> class using the specified array of components.</summary>
    /// <param name="components">An array of <see cref="T:System.ComponentModel.IComponent" /> objects to initialize the collection with. </param>
    public constructor(components: IComponent[]) {
        super();

        throw new Error('Hata');
        //super.AddRange(components);
    }

    /// <summary>Copies the entire collection to an array, starting writing at the specified array index.</summary>
    /// <param name="array">An <see cref="T:System.ComponentModel.IComponent" /> array to copy the objects in the collection to. </param>
    /// <param name="index">The index of the <paramref name="array" /> at which copying to should begin. </param>
  /*   public copyTo(array: IComponent[], index: number): IComponent[] {
        return super.copyTo(array as any, index) as any;
    } */
}