import { TString } from '../Text/TString';
import { KeyCombo } from './KeyCombo';
import { hasOwnProp } from '../Context/Utils';
export class Locale {
    public localeName: string = TString.Empty;
    public pressedKeys: any[] = [];
    private _appliedMacros: any[] = [];
    private _keyMap: any = {};
    private _killKeyCodes: any = [];
    private _macros: any[] = [];
    public constructor(name) {
        this.localeName = name;
        this.pressedKeys = [];
        this._appliedMacros = [];
        this._keyMap = {};
        this._killKeyCodes = [];
        this._macros = [];
    }

    public bindKeyCode(keyCode, keyNames) {
        if (typeof keyNames === 'string') {
            keyNames = [keyNames];
        }

        this._keyMap[keyCode] = keyNames;
    }

    public bindMacro(keyComboStr, keyNames) {
        if (typeof keyNames === 'string') {
            keyNames = [keyNames];
        }

        var handler = null;
        if (typeof keyNames === 'function') {
            handler = keyNames;
            keyNames = null;
        }

        var macro = {
            keyCombo: new KeyCombo(keyComboStr),
            keyNames: keyNames,
            handler: handler
        };

        this._macros.push(macro);
    }

    public getKeyCodes(keyName) {
        var keyCodes: any[] = [];
        for (var keyCode in this._keyMap) {
            if (hasOwnProp(this._keyMap, keyCode)) {
                var index = this._keyMap[keyCode].indexOf(keyName);
                if (index > -1) { keyCodes.push((keyCode as any) | 0); }
            }
        }
        return keyCodes;
    };

    public getKeyNames(keyCode) {
        return this._keyMap[keyCode] || [];
    }

    public setKillKey(keyCode) {
        if (typeof keyCode === 'string') {
            var keyCodes = this.getKeyCodes(keyCode);
            for (var i = 0; i < keyCodes.length; i += 1) {
                this.setKillKey(keyCodes[i]);
            }
            return;
        }

        this._killKeyCodes.push(keyCode);
    }

    public pressKey(keyCode) {
        if (typeof keyCode === 'string') {
            var keyCodes = this.getKeyCodes(keyCode);
            for (var i = 0; i < keyCodes.length; i += 1) {
                this.pressKey(keyCodes[i]);
            }
            return;
        }

        var keyNames = this.getKeyNames(keyCode);
        for (var i = 0; i < keyNames.length; i += 1) {
            if (this.pressedKeys.indexOf(keyNames[i]) === -1) {
                this.pressedKeys.push(keyNames[i]);
            }
        }

        this._applyMacros();
    }

    public releaseKey(keyCode) {
        if (typeof keyCode === 'string') {
            var keyCodes = this.getKeyCodes(keyCode);
            for (var i = 0; i < keyCodes.length; i += 1) {
                this.releaseKey(keyCodes[i]);
            }
        }

        else {
            var keyNames = this.getKeyNames(keyCode);
            var killKeyCodeIndex = this._killKeyCodes.indexOf(keyCode);

            if (killKeyCodeIndex > -1) {
                this.pressedKeys.length = 0;
            } else {
                for (var i = 0; i < keyNames.length; i += 1) {
                    var index = this.pressedKeys.indexOf(keyNames[i]);
                    if (index > -1) {
                        this.pressedKeys.splice(index, 1);
                    }
                }
            }

            this._clearMacros();
        }
    }

    private _applyMacros() {
        var macros = this._macros.slice(0);
        for (var i = 0; i < macros.length; i += 1) {
            var macro = macros[i];
            if (macro.keyCombo.check(this.pressedKeys)) {
                if (macro.handler) {
                    macro.keyNames = macro.handler(this.pressedKeys);
                }
                for (var j = 0; j < macro.keyNames.length; j += 1) {
                    if (this.pressedKeys.indexOf(macro.keyNames[j]) === -1) {
                        this.pressedKeys.push(macro.keyNames[j]);
                    }
                }
                this._appliedMacros.push(macro);
            }
        }
    }

    private _clearMacros() {
        for (var i = 0; i < this._appliedMacros.length; i += 1) {
            var macro = this._appliedMacros[i];
            if (!macro.keyCombo.check(this.pressedKeys)) {
                for (var j = 0; j < macro.keyNames.length; j += 1) {
                    var index = this.pressedKeys.indexOf(macro.keyNames[j]);
                    if (index > -1) {
                        this.pressedKeys.splice(index, 1);
                    }
                }
                if (macro.handler) {
                    macro.keyNames = null;
                }
                this._appliedMacros.splice(i, 1);
                i -= 1;
            }
        }
    }
}
