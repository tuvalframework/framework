import React from "react";

export class WidgetComponent extends React.Component<any, any> {
    public get Name(): string {
        return this.props.name;
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    public render(): React.ReactNode {
      
        return (

            <this.props.controller alwaysNew={this.props.alwaysNew} config={this.props.config} data={this.props.data} onSave={this.props.onSave}></this.props.controller>

        )
    }
}