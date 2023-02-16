import { UIView } from "../../components/UIView/UIView";
import { UIController } from "../../UIController";
import { Text } from '../../components/Text/Text';
import { UIRouteOutlet } from '../../components/Router/Outlet/UIRouteOutlet';
import { VStack } from "../../layout/VStack/VStack";
import { ReactView } from "../../components/ReactView/ReactView";
import { Link, useLocation } from "react-router-dom";
import React from "react";


export class LayoutController extends UIController {

    public override LoadView(): UIView {
        return (
            VStack(
                Text(useLocation().pathname),
                UIRouteOutlet().width("100%").height("100%")
            )
        )
    }

}