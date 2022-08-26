import { Queue } from "../../Collections";
import { List } from "../../Collections/Generic/List";
import { int } from "../../float";
import { foreach } from "../../foreach";
import { Override } from "../../Reflection/Decorators/ClassInfo";
import { ConsoleBase } from "../ConsoleBase";
import { SubProcessCommandBase } from "./SubProcessCommandBase";
import { TVC } from "../TVC";
import { ConsoleCommandBase } from "./CommandBase";
import { NullCommand } from './NullCommand';

export class LoopQueue extends Queue<ConsoleCommandBase> {
    private commands: List<ConsoleCommandBase> = null as any;
    private pointer: int = 0;
    private m_InfiniteLoop: boolean = true;
    public constructor() {
        super();
        this.commands = new List();
    }
    public Enqueue(item: ConsoleCommandBase): void {
        super.Enqueue(item);
        this.commands.Add(item);
    }
    public Dequeue(): ConsoleCommandBase {
        const command = super.Dequeue();
        if (this.Count === 0 && this.m_InfiniteLoop) {
            foreach(this.commands, (item) => super.Enqueue(item)); // Tekrar dolduruyoruz.
        }
        return command;
    }
    public Reset(): void {
        this.Clear();
        this.Enqueue(new NullCommand(null as any));
    }
    public Finite(): void {
        this.m_InfiniteLoop = false;
        this.Clear();
    }
}

export class EndLoop extends ConsoleCommandBase {
    public Execute(console: ConsoleBase<TVC>): void {
        // do nothing
    }

    @Override
    public IsWaitable(): boolean {
        return true;
    }

    @Override
    public GetReturnObject(): any {
        return {
            type: 12,
            waitThis: this.console.tvc,
            callFunction: "waitVbl",
            waitFunction: "waitVbl_wait",
            args: []
        };
    }
}
export class StartLooConsoleCommand extends SubProcessCommandBase {
    public CommandName: string = 'StartLoop';
    public commands: List<ConsoleCommandBase> = null as any;;

    public constructor(console: ConsoleBase<TVC>) {
        super(console);
        this.commands = new List();
    }

    @Override
    public GetSubProcessQueue(): Queue<any> {
        return new LoopQueue();
    }
    public Execute(console: ConsoleBase<TVC>): void {
        let overflow: int = 0;
        const queue = console.m_QueueStack.Peek();
        while (true) {
            const command = queue.Dequeue();
            if (command instanceof EndLoop) {
                console.m_CurrentQueue.Enqueue(command as any);
                break;
            } else {
                console.m_CurrentQueue.Enqueue(command as any);
            }
            if (overflow++ > 1000) {
                throw 'Overflow of loop. End loop command not found.'
            }
        }
        /* console.m_QueueStack.Push(console.m_CurrentQueue);
        console.m_CurrentQueue = console.m_LoopQueue; */

    }
    @Override
    public GetReturnObject(): any {
        return {
            type: 1,
            label: 0
        }
    }
}