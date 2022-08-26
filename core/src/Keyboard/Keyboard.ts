import { Locale } from "./Locale";
import { KeyCombo } from "./KeyCombo";
import { us } from "./us";

export class Keyboard {
    private _locale: any = null;
    private _currentContext: any = null;
    private _contexts: any = {};
    private _listeners: any = [];
    private _appliedListeners: any = [];
    private _locales: any = {};
    private _targetElement: any = null;
    private _targetWindow: any = null;
    private _targetPlatform: string = '';
    private _targetUserAgent: string = '';
    private _isModernBrowser: boolean = false;
    private _targetKeyDownBinding: any = null;
    private _targetKeyUpBinding: any = null;
    private _targetResetBinding: any = null;
    private _paused: boolean = false;
    private _callerHandler: any = null;
    public constructor(targetWindow, targetElement, platform?, userAgent?) {
        this._locale = null;
        this._currentContext = null;
        this._contexts = {};
        this._listeners = [];
        this._appliedListeners = [];
        this._locales = {};
        this._targetElement = null;
        this._targetWindow = null;
        this._targetPlatform = '';
        this._targetUserAgent = '';
        this._isModernBrowser = false;
        this._targetKeyDownBinding = null;
        this._targetKeyUpBinding = null;
        this._targetResetBinding = null;
        this._paused = false;
        this._callerHandler = null;

        this.setContext('global');
        this.watch(targetWindow, targetElement, platform, userAgent);
        this.setLocale('us', us);
    }

    public setLocale(localeName, localeBuilder) {
        var locale: Locale = null as any;
        if (typeof localeName === 'string') {

            if (localeBuilder) {
                locale = new Locale(localeName);
                localeBuilder(locale, this._targetPlatform, this._targetUserAgent);
            } else {
                locale = this._locales[localeName] || null;
            }
        } else {
            locale = localeName;
            localeName = (locale as any)._localeName;
        }

        this._locale = locale;
        this._locales[localeName] = locale;
        if (locale) {
            this._locale.pressedKeys = locale.pressedKeys;
        }
    }

    public getLocale(localName) {
        localName || (localName = this._locale.localeName);
        return this._locales[localName] || null;
    }

    public bind(keyComboStr, pressHandler, releaseHandler?, preventRepeatByDefault?) {
        if (keyComboStr === null || typeof keyComboStr === 'function') {
            preventRepeatByDefault = releaseHandler;
            releaseHandler = pressHandler;
            pressHandler = keyComboStr;
            keyComboStr = null;
        }

        if (
            keyComboStr &&
            typeof keyComboStr === 'object' &&
            typeof keyComboStr.length === 'number'
        ) {
            for (var i = 0; i < keyComboStr.length; i += 1) {
                this.bind(keyComboStr[i], pressHandler, releaseHandler);
            }
            return;
        }

        this._listeners.push({
            keyCombo: keyComboStr ? new KeyCombo(keyComboStr) : null,
            pressHandler: pressHandler || null,
            releaseHandler: releaseHandler || null,
            preventRepeat: preventRepeatByDefault || false,
            preventRepeatByDefault: preventRepeatByDefault || false
        });
    }


    public unbind(keyComboStr, pressHandler, releaseHandler) {
        if (keyComboStr === null || typeof keyComboStr === 'function') {
            releaseHandler = pressHandler;
            pressHandler = keyComboStr;
            keyComboStr = null;
        }

        if (
            keyComboStr &&
            typeof keyComboStr === 'object' &&
            typeof keyComboStr.length === 'number'
        ) {
            for (var i = 0; i < keyComboStr.length; i += 1) {
                this.unbind(keyComboStr[i], pressHandler, releaseHandler);
            }
            return;
        }

        for (var i = 0; i < this._listeners.length; i += 1) {
            var listener = this._listeners[i];

            var comboMatches = !keyComboStr && !listener.keyCombo ||
                listener.keyCombo && listener.keyCombo.isEqual(keyComboStr);
            var pressHandlerMatches = !pressHandler && !releaseHandler ||
                !pressHandler && !listener.pressHandler ||
                pressHandler === listener.pressHandler;
            var releaseHandlerMatches = !pressHandler && !releaseHandler ||
                !releaseHandler && !listener.releaseHandler ||
                releaseHandler === listener.releaseHandler;

            if (comboMatches && pressHandlerMatches && releaseHandlerMatches) {
                this._listeners.splice(i, 1);
                i -= 1;
            }
        }
    };


    public setContext(contextName) {
        if (this._locale) { this.releaseAllKeys(); }

        if (!this._contexts[contextName]) {
            this._contexts[contextName] = [];
        }
        this._listeners = this._contexts[contextName];
        this._currentContext = contextName;
    };

    public getContext() {
        return this._currentContext;
    };

    public withContext(contextName, callback) {
        var previousContextName = this.getContext();
        this.setContext(contextName);

        callback();

        this.setContext(previousContextName);
    };

    public watch(targetWindow, targetElement, targetPlatform, targetUserAgent) {
        var _this = this;

        this.stop();

        if (!targetWindow) {
            if (!(global as any).addEventListener && !(global as any).attachEvent) {
                throw new Error('Cannot find global functions addEventListener or attachEvent.');
            }
            targetWindow = global;
        }

        if (typeof targetWindow.nodeType === 'number') {
            targetUserAgent = targetPlatform;
            targetPlatform = targetElement;
            targetElement = targetWindow;
            targetWindow = global;
        }

        if (!targetWindow.addEventListener && !targetWindow.attachEvent) {
            throw new Error('Cannot find addEventListener or attachEvent methods on targetWindow.');
        }

        this._isModernBrowser = !!targetWindow.addEventListener;

        var userAgent = targetWindow.navigator && targetWindow.navigator.userAgent || '';
        var platform = targetWindow.navigator && targetWindow.navigator.platform || '';

        targetElement && targetElement !== null || (targetElement = targetWindow.document);
        targetPlatform && targetPlatform !== null || (targetPlatform = platform);
        targetUserAgent && targetUserAgent !== null || (targetUserAgent = userAgent);

        this._targetKeyDownBinding = function (event) {
            _this.pressKey(event.keyCode, event);
            _this._handleCommandBug(event, platform);
        };
        this._targetKeyUpBinding = function (event) {
            _this.releaseKey(event.keyCode, event);
        };
        this._targetResetBinding = function (event) {
            _this.releaseAllKeys(event)
        };

        this._bindEvent(targetElement, 'keydown', this._targetKeyDownBinding);
        this._bindEvent(targetElement, 'keyup', this._targetKeyUpBinding);
        this._bindEvent(targetWindow, 'focus', this._targetResetBinding);
        this._bindEvent(targetWindow, 'blur', this._targetResetBinding);

        this._targetElement = targetElement;
        this._targetWindow = targetWindow;
        this._targetPlatform = targetPlatform;
        this._targetUserAgent = targetUserAgent;
    };

    public stop() {
        var _this = this;

        if (!this._targetElement || !this._targetWindow) { return; }

        this._unbindEvent(this._targetElement, 'keydown', this._targetKeyDownBinding);
        this._unbindEvent(this._targetElement, 'keyup', this._targetKeyUpBinding);
        this._unbindEvent(this._targetWindow, 'focus', this._targetResetBinding);
        this._unbindEvent(this._targetWindow, 'blur', this._targetResetBinding);

        this._targetWindow = null;
        this._targetElement = null;
    };

    public pressKey(keyCode, event) {
        if (this._paused) { return; }
        if (!this._locale) { throw new Error('Locale not set'); }

        this._locale.pressKey(keyCode);
        this._applyBindings(event);
    }

    public releaseKey(keyCode, event) {
        if (this._paused) { return; }
        if (!this._locale) { throw new Error('Locale not set'); }

        this._locale.releaseKey(keyCode);
        this._clearBindings(event);
    }

    public releaseAllKeys(event?) {
        if (this._paused) { return; }
        if (!this._locale) { throw new Error('Locale not set'); }

        this._locale.pressedKeys.length = 0;
        this._clearBindings(event);
    }

    public pause() {
        if (this._paused) { return; }
        if (this._locale) { this.releaseAllKeys(); }
        this._paused = true;
    }

    public resume() {
        this._paused = false;
    }

    public reset() {
        this.releaseAllKeys();
        this._listeners.length = 0;
    }

    private _bindEvent(targetElement, eventName, handler) {
        return this._isModernBrowser ?
            targetElement.addEventListener(eventName, handler, false) :
            targetElement.attachEvent('on' + eventName, handler);
    }

    private _unbindEvent(targetElement, eventName, handler) {
        return this._isModernBrowser ?
            targetElement.removeEventListener(eventName, handler, false) :
            targetElement.detachEvent('on' + eventName, handler);
    }

    private _getGroupedListeners() {
        var listenerGroups: any[] = [];
        var listenerGroupMap: any[] = [];

        var listeners = this._listeners;
        if (this._currentContext !== 'global') {
            listeners = [].concat(listeners, this._contexts.global);
        }

        listeners.sort(function (a, b) {
            return (b.keyCombo ? b.keyCombo.keyNames.length : 0) - (a.keyCombo ? a.keyCombo.keyNames.length : 0);
        }).forEach(function (l) {
            var mapIndex = -1;
            for (var i = 0; i < listenerGroupMap.length; i += 1) {
                if (listenerGroupMap[i] === null && l.keyCombo === null ||
                    listenerGroupMap[i] !== null && listenerGroupMap[i].isEqual(l.keyCombo)) {
                    mapIndex = i;
                }
            }
            if (mapIndex === -1) {
                mapIndex = listenerGroupMap.length;
                listenerGroupMap.push(l.keyCombo);
            }
            if (!listenerGroups[mapIndex]) {
                listenerGroups[mapIndex] = [];
            }
            listenerGroups[mapIndex].push(l);
        });
        return listenerGroups;
    };

    private _applyBindings(event) {
        var preventRepeat = false;

        event || (event = {});
        event.preventRepeat = function () { preventRepeat = true; };
        event.pressedKeys = this._locale.pressedKeys.slice(0);

        var pressedKeys = this._locale.pressedKeys.slice(0);
        var listenerGroups = this._getGroupedListeners();


        for (var i = 0; i < listenerGroups.length; i += 1) {
            var listeners = listenerGroups[i];
            var keyCombo = listeners[0].keyCombo;

            if (keyCombo === null || keyCombo.check(pressedKeys)) {
                for (var j = 0; j < listeners.length; j += 1) {
                    var listener = listeners[j];

                    if (keyCombo === null) {
                        listener = {
                            keyCombo: new KeyCombo(pressedKeys.join('+')),
                            pressHandler: listener.pressHandler,
                            releaseHandler: listener.releaseHandler,
                            preventRepeat: listener.preventRepeat,
                            preventRepeatByDefault: listener.preventRepeatByDefault
                        };
                    }

                    if (listener.pressHandler && !listener.preventRepeat) {
                        listener.pressHandler.call(this, event);
                        if (preventRepeat) {
                            listener.preventRepeat = preventRepeat;
                            preventRepeat = false;
                        }
                    }

                    if (listener.releaseHandler && this._appliedListeners.indexOf(listener) === -1) {
                        this._appliedListeners.push(listener);
                    }
                }

                if (keyCombo) {
                    for (var j = 0; j < keyCombo.keyNames.length; j += 1) {
                        var index = pressedKeys.indexOf(keyCombo.keyNames[j]);
                        if (index !== -1) {
                            pressedKeys.splice(index, 1);
                            j -= 1;
                        }
                    }
                }
            }
        }
    }

    private _clearBindings(event) {
        event || (event = {});

        for (var i = 0; i < this._appliedListeners.length; i += 1) {
            var listener = this._appliedListeners[i];
            var keyCombo = listener.keyCombo;
            if (keyCombo === null || !keyCombo.check(this._locale.pressedKeys)) {
                if (this._callerHandler !== listener.releaseHandler) {
                    var oldCaller = this._callerHandler;
                    this._callerHandler = listener.releaseHandler;
                    listener.preventRepeat = listener.preventRepeatByDefault;
                    listener.releaseHandler.call(this, event);
                    this._callerHandler = oldCaller;
                }
                this._appliedListeners.splice(i, 1);
                i -= 1;
            }
        }
    }

    private _handleCommandBug (event, platform) {
        // On Mac when the command key is kept pressed, keyup is not triggered for any other key.
        // In this case force a keyup for non-modifier keys directly after the keypress.
        var modifierKeys = ["shift", "ctrl", "alt", "capslock", "tab", "command"];
        if (platform.match("Mac") && this._locale.pressedKeys.includes("command") &&
            !modifierKeys.includes(this._locale.getKeyNames(event.keyCode)[0])) {
            this._targetKeyUpBinding(event);
        }
    }
    public addListener(keyComboStr, pressHandler, releaseHandler, preventRepeatByDefault?) { }
    public on(keyComboStr, pressHandler, releaseHandler, preventRepeatByDefault?) {  }
    public removeListener(keyComboStr, pressHandler, releaseHandler) { }
    public off(keyComboStr, pressHandler, releaseHandler) { }
}

Keyboard.prototype.addListener = Keyboard.prototype.bind;
Keyboard.prototype.on = Keyboard.prototype.bind;
Keyboard.prototype.removeListener = Keyboard.prototype.unbind;
Keyboard.prototype.off = Keyboard.prototype.unbind;