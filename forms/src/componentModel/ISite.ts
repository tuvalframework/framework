import { IComponent } from "./IComponent";
import { IContainer } from "./IContainer";

export interface ISite {
    /// <summary>Gets the component associated with the <see cref="T:System.ComponentModel.ISite" /> when implemented by a class.</summary>
    /// <returns>The <see cref="T:System.ComponentModel.IComponent" /> instance associated with the <see cref="T:System.ComponentModel.ISite" />.</returns>
    Component: IComponent;

    /// <summary>Gets the <see cref="T:System.ComponentModel.IContainer" /> associated with the <see cref="T:System.ComponentModel.ISite" /> when implemented by a class.</summary>
    /// <returns>The <see cref="T:System.ComponentModel.IContainer" /> instance associated with the <see cref="T:System.ComponentModel.ISite" />.</returns>
    Container: IContainer;


    /// <summary>Determines whether the component is in design mode when implemented by a class.</summary>
    /// <returns>true if the component is in design mode; otherwise, false.</returns>
    DesignMode: boolean;

    /// <summary>Gets or sets the name of the component associated with the <see cref="T:System.ComponentModel.ISite" /> when implemented by a class.</summary>
    /// <returns>The name of the component associated with the <see cref="T:System.ComponentModel.ISite" />; or null, if no name is assigned to the component.</returns>
    Name: string
}