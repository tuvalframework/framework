import { Queue } from "../../Collections/Generic/Queue";
import { ConsoleBase } from "../ConsoleBase";
import { TextConsole } from "../TextConsole";

export interface IConsoleCommand {
    CommandName: string;
    GetReturnObject(): any;
    Execute(console: ConsoleBase<any>): void;
    IsWaitable(): boolean;
    IsSubProcess(): boolean;
    GetSubProcessQueue():Queue<any>;
}