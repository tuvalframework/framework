export enum AccessibleSelection {
    /// <summary>The selection or focus of an object is unchanged.</summary>
    None = 0,
    /// <summary>Assigns focus to an object and makes it the anchor, which is the starting point for the selection. Can be combined with TakeSelection, ExtendSelection, AddSelection, or RemoveSelection.</summary>
    TakeFocus = 1,
    /// <summary>Selects the object and deselects all other objects in the container.</summary>
    TakeSelection = 2,
    /// <summary>Selects all objects between the anchor and the selected object.</summary>
    ExtendSelection = 4,
    /// <summary>Adds the object to the selection.</summary>
    AddSelection = 8,
    /// <summary>Removes the object from the selection.</summary>
    RemoveSelection = 16
}