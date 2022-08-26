import { IDisposable } from "@tuval/core";
import { __ComponentCollection } from "./ComponentCollection";
import { IComponent } from "./IComponent";

export interface IContainer extends IDisposable {
    /// <summary>Gets all the components in the <see cref="T:System.ComponentModel.IContainer" />.</summary>
    /// <returns>A collection of <see cref="T:System.ComponentModel.IComponent" /> objects that represents all the components in the <see cref="T:System.ComponentModel.IContainer" />.</returns>
    Components: __ComponentCollection;

    /// <summary>Adds the specified <see cref="T:System.ComponentModel.IComponent" /> to the <see cref="T:System.ComponentModel.IContainer" /> at the end of the list.</summary>
    /// <param name="component">The <see cref="T:System.ComponentModel.IComponent" /> to add. </param>
    add(component: IComponent): void;

    /// <summary>Adds the specified <see cref="T:System.ComponentModel.IComponent" /> to the <see cref="T:System.ComponentModel.IContainer" /> at the end of the list, and assigns a name to the component.</summary>
    /// <param name="component">The <see cref="T:System.ComponentModel.IComponent" /> to add. </param>
    /// <param name="name">The unique, case-insensitive name to assign to the component.-or- null that leaves the component unnamed. </param>

    add(component: IComponent, name: string): void;

    /// <summary>Removes a component from the <see cref="T:System.ComponentModel.IContainer" />.</summary>
    /// <param name="component">The <see cref="T:System.ComponentModel.IComponent" /> to remove. </param>
    remove(component: IComponent): void;
}