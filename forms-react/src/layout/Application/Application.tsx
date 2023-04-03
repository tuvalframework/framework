import React, { createContext, useContext } from "react";
import { Theme } from "../../thema-system";
import { DialogContainer, ModalCollection, ModalDialogs } from "../Dialog/DialogContainerClass";
import { UIThemeContext } from "../Theme/UIThemeRenderer";

export const ApplicationContext = createContext(null!);

export function useApplication(): Application {
    return useContext(ApplicationContext);
}

export function getAppFullName() {
    try {
        let regex = /\/app\/com\.([A-Za-z]+)\.([A-Za-z]+)\.([A-Za-z]+)/i;

        // Alternative syntax using RegExp constructor
        // const regex = new RegExp('(?:^\\/app\\/+|\\G(?!^)\\.)\\K\\w+', 'g')

        const str = window.location.href;


        const m = regex.exec(str);
        //alert(`com.${m[1]}.${m[2]}.${m[3]}`)
        return `com.${m[1]}.${m[2]}.${m[3]}`;
    }
    catch {
        return '';
    }
}

export interface IApplication {
    name: string;
    controller: Function;
    theme: Theme,
    mainColor: string
}



export class Application extends React.Component<IApplication, any> {


    public get Name(): string {
        return this.props.name;
    }
    public get Theme(): Theme {
        return this.props.theme;
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    public render(): React.ReactNode {

        const r: any = document.querySelector(':root');
        r.style.setProperty('--main-theme-color', this.props.mainColor);

        const appName = getAppFullName();

        if (ModalDialogs[appName] == null) {
            ModalDialogs[appName] = new ModalCollection();
        }

        return (
            <ApplicationContext.Provider value={this}>
                <UIThemeContext.Provider value={this.Theme}>
                    <DialogContainer></DialogContainer>
                    <this.props.controller></this.props.controller>
                </UIThemeContext.Provider>
            </ApplicationContext.Provider>
        )
    }
}