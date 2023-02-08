import { TextField, Chips, MenuButton } from "monday-ui-react-core";
import { ColorPicker, Dropdown } from "monday-ui-react-core/dist/types/components";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { CheckBox } from "./components/Checkbox/Checkbox";
import { EditableHeader } from "./components/EditableHeader/EditableHeader";
import { Editor } from "./components/Editor/Editor";
import { InputGroup } from "./components/InputGroup/InputGroup";
import { InputMask } from "./components/InputMask/InputMask";
import { InputNumber } from "./components/InputNumber/InputNumber";
import { InputSwitch } from "./components/InputSwitch/InputSwitch";
import { InputTextArea } from "./components/InputTextarea/InputTextarea";
import { Knob } from "./components/Knob/Knob";
import { ListBox } from "./components/ListBox/ListBox";
import { ReactView } from "./components/ReactView/ReactView";
import { UIViewClass } from "./components/UIView/UIViewClass";
import { cTop, cTopLeading } from './Constants';
import { DesktopController } from "./DesktopController";
import { HStack } from "./layout/HStack/HStack";
import { VStack } from "./layout/VStack/VStack";
import { UIController } from "./UIController";


export class LayoutController extends UIController {


    public override LoadView(): UIViewClass {

        return (
            HStack({ alignment: cTop, spacing: 10 })(
                VStack({ alignment: cTopLeading })(
                    ReactView(
                        <Fragment>
                            <Link to="/app/organizationmanager"></Link>
                            <Link to="/app/testapp">Test App</Link>
                        </Fragment>
                    )
                ).width(250),
                VStack({ alignment: cTopLeading })(
                    ReactView(
                        <DesktopController />
                    )
                ).width('100%'),
            )
        )
    }
}