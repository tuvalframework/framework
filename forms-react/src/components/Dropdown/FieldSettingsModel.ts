
export interface FieldSettingsModel {
    /**
        * Maps the text column from data table for each list item
        *
        * @default null
        */
    text?: string;
    /**
        * Maps the value column from data table for each list item
        *
        * @default null
        */
    value?: string;
    /**
        * Maps the icon class column from data table for each list item.
        *
        * @default null
        */
    iconCss?: string;
    /**
        * Group the list items with it's related items by mapping groupBy field.
        *
        * @default null
        */
    groupBy?: string;
    /**
        * Allows additional attributes such as title, disabled, etc., to configure the elements
        * in various ways to meet the criteria.
        *
        * @default null
        */
    htmlAttributes?: string;
}