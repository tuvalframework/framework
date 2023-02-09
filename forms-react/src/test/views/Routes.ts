import { UIRoute } from '../../components/Router/UIRoute/UIRoute';
import { UIRoutes } from "../../components/Router/UIRoutes/UIRoutes"
import { DashboardController } from "../Controllers/DashboardController"
import { HomeController } from '../Controllers/HomeController';
import { LayoutController } from '../Controllers/LayoutController';

export const Routes = () => {
    return (
        UIRoutes(
            UIRoute('/', LayoutController).children(
                UIRoute('a', DashboardController)
            )
        )
    )
}