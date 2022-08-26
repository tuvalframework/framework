import { ConsoleBase } from "../ConsoleBase";
import { SubProcessCommandBase } from "./SubProcessCommandBase";
import { TVC } from "../TVC";

export class TaskConsoleCommand  extends SubProcessCommandBase  {
    public CommandName: string = 'Task';
    public Text: string = '';
    public Callback: Function;

    public constructor(console:ConsoleBase<TVC>, callback?: Function) {
        super(console);
        this.Callback = callback!;
    }

    public Execute(console: ConsoleBase<TVC>): void {
      this.Callback();
    }
}