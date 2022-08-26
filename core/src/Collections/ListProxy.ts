export class ListProxy {

    public static CreateProxy<T>(thisarg) {
        return new Proxy(thisarg, {
            get: (target, property) => {
                if (!isNaN(property as any)) {
                    const _target: T = target;
                    if ((_target as any).setInternal) {
                        return (_target as any).setInternal(property as any);
                    }

                }
                return target[property];
            },
            set: (target, property, value, receiver) => {
                if (!isNaN(property as any)) {
                    console.log('set çalıştı');
                    const _target: any = target;
                    if (_target.setInternal) {
                        if ((property as any) < 0 || (property as any) >= _target.getCount()) {
                            _target.addInternal(value);
                        } else {
                            try {
                                _target.setInternal(property, value);
                            } catch (e) {
                                const a = '';
                            }
                        }
                    }
                    return true;
                }
                target[property] = value;
                // you have to return true to accept the changes
                return true;
            }
        });
    }
}