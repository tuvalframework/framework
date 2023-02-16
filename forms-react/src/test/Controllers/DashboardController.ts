import { UIView } from "../../components/UIView/UIView";
import { UIController } from "../../UIController";
import { Text } from '../../components/Text/Text';

export class DashboardController extends UIController {

    public override LoadView(): UIView {
        return (
            Text("Dashboard")
        )
    }

}