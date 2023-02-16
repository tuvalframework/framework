import React from "react";
import { useLocation } from 'react-router-dom';
import { Icon } from './components/Icon/Icon';
import { Icons } from './components/Icon/Icons';
import { ReactView } from "./components/ReactView/ReactView";
import { UIRouteLink } from "./components/Router/UIRouteLink/UIRouteLink";
import { UIView } from "./components/UIView/UIView";
import { cTop, cTopLeading } from './Constants';
import { DesktopController } from "./DesktopController";
import { HStack } from "./layout/HStack/HStack";
import { VStack } from "./layout/VStack/VStack";
import { UIController } from "./UIController";


export class LayoutController extends UIController {
    public override LoadView(): UIView {
        return (
            HStack({ alignment: cTop, spacing: 10 })(
                VStack({ alignment: cTopLeading })(
                    HStack(
                        UIRouteLink('/app/com.tuvalsoft.app.procetra')(
                            Icon(Icons.Activity).size(25)
                        )
                    ).width(50).height(50).foregroundColor("white")
                    ,
                    HStack(
                        UIRouteLink('/app/com.tuvalsoft.app.organizationmanager')(
                            Icon(Icons.AddNewDoc).size(25)
                        )
                    ).width(50).height(50).foregroundColor("white")

                    /*  ReactView(
                         <Fragment>
                             <Link to="/app/com.tuvalsoft.app.procetra">Organization Man</Link>
                             <Link to="/app/com.tuvalsoft.app.procetra/a">Organization Man</Link>
                             <Link to="/app/organizationmanager/home/dashboard">Test App</Link>
                         </Fragment>
                     ) */
                ).width(50).background('#292F4C'),
                VStack({ alignment: cTopLeading })(
                    ReactView(
                        <DesktopController />
                    )
                ).width('100%'),
            )
        )
    }
}