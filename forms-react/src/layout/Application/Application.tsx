import React, { createContext, useContext } from "react";

export const ApplicationContext = createContext(null!);

export function useApplication(): Application {
    return useContext(ApplicationContext);
}

export interface IApplication {
    name: string;
    controller: Function;
}
export class Application extends React.Component<IApplication, any> {
    public get Name(): string {
        return this.props.name;
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <ApplicationContext.Provider value={this}>
                <this.props.controller></this.props.controller>
            </ApplicationContext.Provider>
        )
    }
}