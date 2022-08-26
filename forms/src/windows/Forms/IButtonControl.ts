import { DialogResult } from "./DialogResult";

export interface IButtonControl {
    /// <summary>Gets or sets the value returned to the parent form when the button is clicked.</summary>
    /// <returns>One of the <see cref="T:System.Windows.Forms.DialogResult" /> values.</returns>
    /// <filterpriority>1</filterpriority>
    DialogResult: DialogResult;

    /// <summary>Notifies a control that it is the default button so that its appearance and behavior is adjusted accordingly.</summary>
    /// <param name="value">true if the control should behave as a default button; otherwise false. </param>
    /// <filterpriority>1</filterpriority>
    notifyDefault(value: boolean): void;

    /// <summary>Generates a <see cref="E:System.Windows.Forms.Control.Click" /> event for the control.</summary>
    /// <filterpriority>1</filterpriority>
    performClick(): void;
}