import React, { createElement, Fragment } from "../../../../../preact/compat";
import { Teact } from '../../Teact';
import { is, Delegate, Event, EventBus } from '@tuval/core';
import { Control } from "../Control";
import { StartButton } from "./StartButton";
import { ShowAll } from "./ShowAll";
import { TaskbarPanel } from "./TaskbarPanel";
import { Avatar } from "../../avatar/Avatar";

export class Taskbar extends Control<Taskbar> {

    public get UserName(): string {
        return this.GetProperty('UserName');
    }
    public set UserName(value: string) {
        this.SetProperty('UserName', value);
    }

    public get ProfilePicture(): string {
        return this.GetProperty('ProfilePicture');
    }
    public set ProfilePicture(value: string) {
        this.SetProperty('ProfilePicture', value);
    }

    public SetupControlDefaults() {
        super.SetupControlDefaults();
        EventBus.Default.on('tuval.desktop.userLogin', (user) => {
            console.log(user);
            this.UserName = user.nameSurname;
            this.ProfilePicture = user.pictureUrl;
        });
    }

    public CreateElements(): any {
        const showAll = new ShowAll();
        const startButton = new StartButton();
        const taskPanel = new TaskbarPanel();
        return (
            <div>
                <div class="tuval-taskbar-shadow"></div>
                <div class="tuval-taskbar">
                    <div class='tuval-taskbar-left'>
                        {showAll.CreateMainElement()}
                        {startButton.CreateMainElement()}
                        {taskPanel.CreateMainElement()}
                        <div class="flex">
                            <div class="flex flex-grow-1"></div>
                            <div class="flex align-items-center justify-content-end">
                                {/*  <Avatar icon="pi pi-user" className="p-mr-2 p-mt-2" shape="circle" /> */}
                                <Avatar image={this.ProfilePicture} className="p-mr-2 p-mt-2" shape="circle"></Avatar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}