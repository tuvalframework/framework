import { IDisposable, EventHandler } from "@tuval/core";
import { ISite } from "./ISite";

export interface IComponent extends IDisposable
{
    /// <summary>Gets or sets the <see cref="T:System.ComponentModel.ISite" /> associated with the <see cref="T:System.ComponentModel.IComponent" />.</summary>
    /// <returns>The <see cref="T:System.ComponentModel.ISite" /> object associated with the component; or null, if the component does not have a site.</returns>
     Site:ISite;

    /// <summary>Represents the method that handles the <see cref="E:System.ComponentModel.IComponent.Disposed" /> event of a component.</summary>
     disposed:EventHandler;
}