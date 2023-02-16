import { UIView } from "../../components/UIView/UIView";
import { UIController } from "../../UIController";
import { Text } from '../../components/Text/Text';

export class HomeController extends UIController {

    public override LoadView(): UIView {
        return (
            Text("Home")
        )
    }

}