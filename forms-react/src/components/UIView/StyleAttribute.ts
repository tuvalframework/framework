import { ColorClass } from './ColorClass';

export interface StyleAttribute {
    default?: string | ColorClass;
    hover?: string | ColorClass;
    active?: string | ColorClass;
    disabled?: string | ColorClass;
    focus?: string | ColorClass;
    before?: string | ColorClass;
}