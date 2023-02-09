import { UIViewClass } from "../../components/UIView/UIViewClass";
import { UIController } from "../../UIController";
import { Text } from '../../components/Text/Text';

export class DashboardController extends UIController {

    public override LoadView(): UIViewClass {
        return (
            Text("Dashboard")
        )
    }

}