export enum AccessibleEvents
{
    /// <summary>A sound was played. The system sends this event when a system sound, such as for menus, is played, even if no sound is audible. This might be caused by lack of a sound file or sound card. Servers send this event if a custom user interface element generates a sound.</summary>
    SystemSound = 1,
    /// <summary>An alert was generated. Server applications send this event whenever an important user interface change has occurred that a user might need to know about. The system does not send the event consistently for dialog box objects.</summary>
    SystemAlert = 2,
    /// <summary>The foreground window changed. The system sends this event even if the foreground window is changed to another window in the same thread. Server applications never send this event.</summary>
    SystemForeground = 3,
    /// <summary>A menu item on the menu bar was selected. The system sends this event for standard menus. Servers send this event for custom menus. The system might raise more than one MenuStart event that might or might not have a corresponding MenuEnd event.</summary>
    SystemMenuStart = 4,
    /// <summary>A menu from the menu bar was closed. The system sends this event for standard menus. Servers send this event for custom menus.</summary>
    SystemMenuEnd = 5,
    /// <summary>A shortcut menu was displayed. The system sends this event for standard menus. Servers send this event for custom menus. The system does not send the event consistently.</summary>
    SystemMenuPopupStart = 6,
    /// <summary>A shortcut menu was closed. The system sends this event for standard menus. Servers send this event for custom menus. When a shortcut menu is closed, the client receives this message followed almost immediately by the SystemMenuEnd event. The system does not send the event consistently.</summary>
    SystemMenuPopupEnd = 7,
    /// <summary>A window is being moved or resized. The system sends the event; servers never send this event.</summary>
    SystemCaptureStart = 8,
    /// <summary>A window has lost mouse capture. The system sends the event; servers never send this event.</summary>
    SystemCaptureEnd = 9,
    /// <summary>A window is being moved or resized. The system sends the event; servers never send this event.</summary>
    SystemMoveSizeStart = 10,
    /// <summary>The movement or resizing of a window is finished. The system sends the event; servers never send this event.</summary>
    SystemMoveSizeEnd = 11,
    /// <summary>A window entered context-sensitive Help mode. The system does not send the event consistently.</summary>
    SystemContextHelpStart = 12,
    /// <summary>A window exited context-sensitive Help mode. The system does not send the event consistently.</summary>
    SystemContextHelpEnd = 13,
    /// <summary>An application is about to enter drag-and-drop mode. Applications that support drag-and-drop operations must send this event; the system does not.</summary>
    SystemDragDropStart = 14,
    /// <summary>An application is about to exit drag-and-drop mode. Applications that support drag-and-drop operations must send this event; the system does not.</summary>
    SystemDragDropEnd = 15,
    /// <summary>A dialog box was displayed. The system sends the event for standard dialog boxes. Servers send this event for custom dialog boxes. The system does not send the event consistently.</summary>
    SystemDialogStart = 16,
    /// <summary>A dialog box was closed. The system does not send the event for standard dialog boxes. Servers send this event for custom dialog boxes. The system does not send the event consistently.</summary>
    SystemDialogEnd = 17,
    /// <summary>Scrolling has started on a scroll bar. The system sends the event for scroll bars attached to a window and for standard scroll bar controls. Servers send this event for custom scroll bars.</summary>
    SystemScrollingStart = 18,
    /// <summary>Scrolling has ended on a scroll bar. The system sends this event for scroll bars attached to a window and for standard scroll bar controls. Servers send this event for custom scroll bars.</summary>
    SystemScrollingEnd = 19,
    /// <summary>The user pressed ALT+TAB, which activates the switch window. If only one application is running when the user presses ALT+TAB, the system raises the SwitchEnd event without a corresponding SwitchStart event.</summary>
    SystemSwitchStart = 20,
    /// <summary>The user released ALT+TAB. The system sends the SwitchEnd event; servers never send this event. If only one application is running when the user presses ALT+TAB, the system sends the SwitchEnd event without a corresponding SwitchStart event.</summary>
    SystemSwitchEnd = 21,
    /// <summary>A window object is about to be minimized or maximized. The system sends the event; servers never send this event.</summary>
    SystemMinimizeStart = 22,
    /// <summary>A window object was minimized or maximized. The system sends the event; servers never send this event.</summary>
    SystemMinimizeEnd = 23,
    /// <summary>An object was created. The operating system sends the event for the following user interface elements: caret, header control, list view control, tab control, toolbar control, tree view control, and window object. Server applications send this event for their accessible objects. Servers must send this event for all an object's child objects before sending the event for the parent object. Servers must ensure that all child objects are fully created and ready to accept calls from clients when the parent object sends the event.</summary>
    Create = 32768,
    /// <summary>An object was destroyed. The system sends this event for the following user interface elements: caret, header control, list view control, tab control, toolbar control, tree view control, and window object. Server applications send this event for their accessible objects. This event may or may not be sent for child objects. However, clients can conclude that all the children of an object have been destroyed when the parent object sends this event.</summary>
    Destroy = 32769,
    /// <summary>A hidden object is being shown. The system sends this event for the following user interface elements: caret, cursor, and window object. Server applications send this event for their accessible objects. Clients can conclude that, when this event is sent by a parent object, all child objects have already been displayed. Therefore, server applications do not need to send this event for the child objects.</summary>
    Show = 32770,
    /// <summary>An object is hidden. The system sends the event for the following user interface elements: caret and cursor. Server applications send the event for their accessible objects. When the event is generated for a parent object, all child objects have already been hidden. Therefore, server applications do not need to send the event for the child objects. The system does not send the event consistently.</summary>
    Hide = 32771,
    /// <summary>A container object has added, removed, or reordered its children. The system sends this event for the following user interface elements: header control, list view control, toolbar control, and window object. Server applications send this event as appropriate for their accessible objects. This event is also sent by a parent window when the z order for the child windows changes.</summary>
    Reorder = 32772,
    /// <summary>An object has received the keyboard focus. The system sends this event for the following user interface elements: list view control, menu bar, shortcut menu, switch window, tab control, tree view control, and window object. Server applications send this event for their accessible objects.</summary>
    Focus = 32773,
    /// <summary>An accessible object within a container object has been selected. This event signals a single selection. Either a child has been selected in a container that previously did not contain any selected children, or the selection has changed from one child to another.</summary>
    Selection = 32774,
    /// <summary>An item within a container object was added to the selection. The system sends this event for the following user interface elements: list box, list view control, and tree view control. Server applications send this event for their accessible objects. This event signals that a child has been added to an existing selection.</summary>
    SelectionAdd = 32775,
    /// <summary>An item within a container object was removed from the selection. The system sends this event for the following user interface elements: list box, list view control, and tree view control. Server applications send this event for their accessible objects. This event signals that a child has been removed from an existing selection.</summary>
    SelectionRemove = 32776,
    /// <summary>Numerous selection changes occurred within a container object. The system sends this event for list boxes. Server applications send this event for their accessible objects. This event can be sent when the selected items within a control have changed substantially. This event informs the client that many selection changes have occurred. This is preferable to sending several SelectionAdd or SelectionRemove events.</summary>
    SelectionWithin = 32777,
    /// <summary>An object's state has changed. The system sends the event for the following user interface elements: check box, combo box, header control, push button, radio button, scroll bar, toolbar control, tree view control, up-down control, and window object. Server applications send the event for their accessible objects. For example, a state change can occur when a button object has been pressed or released, or when an object is being enabled or disabled. The system does not send the event consistently.</summary>
    StateChange = 32778,
    /// <summary>An object has changed location, shape, or size. The system sends this event for the following user interface elements: caret and window object. Server applications send this event for their accessible objects. This event is generated in response to the top-level object within the object hierarchy that has changed, not for any children it might contain. For example, if the user resizes a window, the system sends this notification for the window, but not for the menu bar, title bar, scroll bars, or other objects that have also changed. The system does not send this event for every non-floating child window when the parent moves. However, if an application explicitly resizes child windows as a result of being resized, the system sends multiple events for the resized children. If an object's <see cref="P:System.Windows.Forms.AccessibleObject.State" /> property is set to <see cref="F:System.Windows.Forms.AccessibleStates.Floating" />, servers should send a location change event whenever the object changes location. If an object does not have this state, servers should raise this event when the object moves relative to its parent.</summary>
    LocationChange = 32779,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.Name" /> property changed. The system sends this event for the following user interface elements: check box, cursor, list view control, push button, radio button, status bar control, tree view control, and window object. Server applications send this event for their accessible objects.</summary>
    NameChange = 32780,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.Description" /> property changed. Server applications send this event for their accessible objects.</summary>
    DescriptionChange = 32781,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.Value" /> property changed. The system raises the ValueChange event for the following user interface elements: edit control, header control, hot key control, progress bar control, scroll bar, slider control, and up-down control. Server applications send this event for their accessible objects.</summary>
    ValueChange = 32782,
    /// <summary>An object has a new parent object. Server applications send this event for their accessible objects.</summary>
    ParentChange = 32783,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.Help" /> property changed. Server applications send this event for their accessible objects.</summary>
    HelpChange = 32784,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.DefaultAction" /> property changed. The system sends this event for dialog boxes. Server applications send this event for their accessible objects. Therefore, server applications do not need to send this event for the child objects. Hidden objects have a state of <see cref="F:System.Windows.Forms.AccessibleStates.Invisible" />, and shown objects do not. Events of type AccessibleEvents.Hide indicate that a state of <see cref="F:System.Windows.Forms.AccessibleStates.Invisible" /> has been set. Therefore, servers do not need to send the AccessibleEvents.StateChange event in this case.</summary>
    DefaultActionChange = 32785,
    /// <summary>An object's <see cref="P:System.Windows.Forms.AccessibleObject.KeyboardShortcut" /> property changed. Server applications send the event for their accessible objects.</summary>
    AcceleratorChange = 32786
}