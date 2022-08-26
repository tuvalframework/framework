import { classNames } from '@tuval/core';
import React, { createElement } from '../../../../preact/compat';
import { ObjectUtils } from '../ObjectUtils';
import { Teact } from "../Teact";


export default class IconUtils {

    static getJSXIcon(icon, iconProps, options) {
        let content = null;

        if (icon) {
            const iconType = typeof icon;
            const className = classNames(iconProps.className, iconType === 'string' && icon);
            content = <span {...iconProps} className={className}></span>;

            if (iconType !== 'string') {
                const defaultContentOptions = {
                    iconProps: iconProps,
                    element: content,
                    ...options
                };

                return ObjectUtils.getJSXElement(icon, defaultContentOptions);
            }
        }

        return content;
    }
}