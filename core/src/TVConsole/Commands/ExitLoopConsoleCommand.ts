import { ConsoleBase } from "../ConsoleBase";
import { TVC } from "../TVC";
import { ConsoleCommandBase } from "./CommandBase";
import { LoopQueue } from "./StartLoopConsoleCommand";

export class ExitLoopConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Exit Loop';

    public constructor(console: ConsoleBase<TVC>) {
        super(console);
    }

    public Execute(console: ConsoleBase<TVC>): void {
        while (console.m_QueueStack.Count > 0) {
            if (console.m_CurrentQueue instanceof LoopQueue) {
                console.m_CurrentQueue.Finite();
                break;
            } else {
                console.m_CurrentQueue = console.m_QueueStack.Pop();
            }
        }
    }
}

export class ResetLoopConsoleCommand extends ConsoleCommandBase {
    public CommandName: string = 'Reset Loop';

    public constructor(console: ConsoleBase<TVC>) {
        super(console);
    }

    public Execute(console: ConsoleBase<TVC>): void {
        while (console.m_QueueStack.Count > 0) {
            if (console.m_CurrentQueue instanceof LoopQueue) {
                console.m_CurrentQueue.Reset();
                console.m_QueueStack.Push(console.m_CurrentQueue); // resetleyip geri yüklüyoruz.
                break;
            } else {
                console.m_CurrentQueue = console.m_QueueStack.Pop(); // LoopQueue bulana kadar devam ediyoruz.
            }
        }
    }
}