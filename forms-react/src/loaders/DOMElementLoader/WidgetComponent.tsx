import React from "react";

export class WidgetComponent extends React.Component<any, any> {
    private ref = { current: null };
    public get Name(): string {
        return this.props.name;
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount(): void {
        const { element } = this.props;
        const { current } = this.ref;
        current.appendChild(element);

    }
    public render(): React.ReactNode {

        return (

            <div ref={this.ref}></div>
        )
    }
}