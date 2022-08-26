export enum AccessibleNavigation
    {
        /// <summary>Navigation to a sibling object located above the starting object.</summary>
        Up = 1,
        /// <summary>Navigation to a sibling object located below the starting object.</summary>
        Down = 2,
        /// <summary>Navigation to the sibling object located to the left of the starting object.</summary>
        Left = 3,
        /// <summary>Navigation to the sibling object located to the right of the starting object.</summary>
        Right = 4,
        /// <summary>Navigation to the next logical object, typically from a sibling object to the starting object.</summary>
        Next = 5,
        /// <summary>Navigation to the previous logical object, typically from a sibling object to the starting object.</summary>
        Previous = 6,
        /// <summary>Navigation to the first child of the object.</summary>
        FirstChild = 7,
        /// <summary>Navigation to the last child of the object.</summary>
        LastChild = 8
    }