import { List, foreach, int, is, BREAK, ArgumentOutOfRangeException } from '@tuval/core';
import { ControlTypes } from '../../ControlTypes';
import { Tag } from './Tag';
import { TagsControl } from './Tags';
export class TagCollection extends List<Tag> {
    public TagsControl: TagsControl = null as any;
    public constructor(tagsControl: TagsControl) {
        super();
        this.TagsControl = tagsControl;
    }

    public Add(text: string): Tag;
    public Add(tag: Tag): int;
    public Add(...args: any[]): Tag | int {
        if (args.length === 1 && is.string(args[0])) {
            const tag = new Tag();
            tag.Text = args[0];
            super.Add(tag);
            if (this.TagsControl != null) {
                this.TagsControl.ForceUpdate();
            }
            return tag;
        } else if (args.length === 1) {
            return super.Add(args[0]);
        }
        throw new ArgumentOutOfRangeException('');
    }
}
