import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { ClassInfo, is } from '@tuval/core';
import { Control } from "../Control";
import { TagComponent } from "../../tag/Tag";
import { TagCollection } from "./TagCollection";


export class TagsControl extends Control<TagsControl> {

    public get Tags(): TagCollection {
        return this.GetProperty('Tags');
    }
    public set Tags(value: TagCollection) {
        this.SetProperty('Tags', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        this.Tags = new TagCollection(this);
    }
    private renderTags(): any[] {
        return this.Tags.ToArray().map(tag => {
            return (<TagComponent className='p-mr-2' value={tag.Text}></TagComponent>);
        });

    }
    public CreateElements(): any {
        return (
            <div>{this.renderTags()}</div>
        );
    }
}