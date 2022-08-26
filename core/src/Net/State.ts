import { Dictionary } from "../Collections";
import { Override } from "../Reflection/Decorators/ClassInfo";
import { EventBus } from '../Events/EventBus';

export class State extends Dictionary<string, any> {
    private static default: State = null as any;
    public static get Default(): State {
        if (State.default == null) {
            State.default = new State();
        }
        return State.default;
    }

    @Override
    public Get(key: string): any {
        if (this.ContainsKey(key)) {
            return super.Get(key);
        }
        super.Set(key, {});
        return super.Get(key);
    }

    @Override
    public Set(key: string, value: any) {
        let oldValue = null;
        if (this.ContainsKey(key)) {
            oldValue = this.Get(key);
        }
        super.Set(key, value);
        EventBus.Default.fire('StateChanged', {
            Key: key,
            OldValue: oldValue,
            NewValue: value
        })
    }
}