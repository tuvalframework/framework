import { Message } from './Message';
import { TController } from './TController';
export interface IView {
    Controller: TController;
    SetController(controller: TController): void;
    WndProc(msg:Message);
}