import { IControl } from '../IControl';
import { ButtonColors } from './Button';
import { Event } from '@tuval/core';

export interface IButton extends IControl {
    Color: ButtonColors;
    Clicked: Event<any>;
}