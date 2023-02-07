import React from "react";
import { UIController } from '../../UIController';

export interface IApplication {
    controller: Function
}
export class Application extends React.Component<IApplication, any> {
    constructor(props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
        return (
            <this.props.controller></this.props.controller>
        )
    }
}