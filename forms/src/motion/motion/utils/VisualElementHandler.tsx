import React, { Component } from "../../../preact/compat";
import { Teact } from "../../../windows/Forms/Components/Teact";
import { MotionConfigProps } from "../.."
import { VisualElement } from "../../render/types"
import { MotionProps } from "../types"

interface Props {
    visualElement?: VisualElement
    props: MotionProps & MotionConfigProps
}

export class VisualElementHandler extends Component/* <
    React.PropsWithChildren<Props>
>  */{
    /**
     * Update visual element props as soon as we know this update is going to be commited.
     */
    getSnapshotBeforeUpdate() {
        this.updateProps()
        return null
    }

    componentDidUpdate() {}

    updateProps() {
        const { visualElement, props } = this.props
        if (visualElement) visualElement.setProps(props)
    }

    render() {
        return this.props.children
    }
}
