import { Queue } from "../../Collections/Generic/Queue";
import { Override } from "../../Reflection";
import { ConsoleCommandBase } from "./CommandBase";
import { ConsoleBase } from "../ConsoleBase";
import { TextConsole } from "../TextConsole";
import { TextTVC } from "../TextTVC";
import { TVC } from "../TVC";

export class SubProcessCommandBase extends ConsoleCommandBase {
    public Execute(console: ConsoleBase<TVC>): void {
        //throw new Error("Method not implemented.");
    }
    @Override
    public IsSubProcess(): boolean {
        return true;
    }

    @Override
    public GetSubProcessQueue(): Queue<any> {
        return new Queue();
    }
}