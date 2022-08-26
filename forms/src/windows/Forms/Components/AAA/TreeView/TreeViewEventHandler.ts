import { Delegate } from '@tuval/core';
import { TreeViewEventArgs } from './TreeViewEventArgs';

export class TreeViewEventHandler extends Delegate<(sender: any, e: TreeViewEventArgs) => void>{ }


