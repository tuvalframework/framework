import { Delegate } from '@tuval/core';
import { EventArgs } from './EventArgs';

export class EventHandler extends Delegate<(e: EventArgs)=> void>{};