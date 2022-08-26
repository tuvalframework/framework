import { IConsoleCommand } from "./IConsoleCommand";
import { TVC } from '../TVC';
import { Override, Virtual } from '../../Reflection/Decorators/ClassInfo';
import { Queue } from '../../Collections';
import { ConsoleBase } from '../ConsoleBase';

export abstract class ConsoleCommandBase implements IConsoleCommand {
    public CommandName: string = '';
    protected console: ConsoleBase<any> = null as any;
    public constructor(console: ConsoleBase<TVC>) {
        this.console = console;
    }
    @Override
    public GetSubProcessQueue(): Queue<any> {
        return null as any;
    }
    public IsWaitable(): boolean {
       return false;
    }
    public IsSubProcess(): boolean {
        return false;
     }
    @Virtual
    public  GetReturnObject(): any {
        return null;
    }
    public abstract Execute(console: ConsoleBase<any>): void;
}