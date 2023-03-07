
import { is } from '@tuval/core';
import { HeadingClass } from './HeadingClass';


export function Heading(value: string): HeadingClass{
    return new HeadingClass().value(value);
}