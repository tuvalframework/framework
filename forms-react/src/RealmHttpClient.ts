import { HttpClient, HttpClientResponse, HttpClientRequestConfig, ModuleLoader } from '@tuval/core';
import { instance as container } from '@tuval/core';



var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
export interface IStackFrame {
    isConstructor?: boolean;
    isEval?: boolean;
    isNative?: boolean;
    isToplevel?: boolean;
    columnNumber?: number;
    lineNumber?: number | string;
    fileName?: string;
    functionName?: string;
    source?: string;
    args?: any[];
    evalOrigin?: IStackFrame;
    toString(): string;
}
export class StackFrame implements IStackFrame {
    isConstructor?: boolean;
    isEval?: boolean;
    isNative?: boolean;
    isToplevel?: boolean;
    columnNumber?: number;
    lineNumber?: number | string;
    fileName?: string;
    functionName?: string;
    source?: string;
    args?: any[];
    evalOrigin?: IStackFrame;
    public constructor(obj: IStackFrame) {
        this.isConstructor = obj.isConstructor;
        this.isEval = obj.isEval;
        this.isNative = obj.isNative;
        this.isToplevel = obj.isToplevel;
        this.columnNumber = obj.columnNumber;
        this.lineNumber = obj.lineNumber;
        this.fileName = obj.fileName;
        this.functionName = obj.functionName;
        this.source = obj.source;
        this.args = obj.args;
        this.evalOrigin = obj.evalOrigin;
    }
    public toString(): string {
        return '';
    }
}
export class ErrorStackParser {
    /**
     * Given an Error object, extract the most information from it.
     *
     * @param {Error} error object
     * @return {Array} of StackFrames
     */
    public static parse(error) {
        if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
            return this.parseOpera(error);
        } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
        } else if (error.stack) {
            return this.parseFFOrSafari(error);
        } else {
            throw new Error('Cannot parse given Error object');
        }
    }

    // Separate line and column numbers from a string of the form: (URI:Line:Column)
    public static extractLocation(urlLike) {
        // Fail-fast but return locations like "(native)"
        if (urlLike.indexOf(':') === -1) {
            return [urlLike];
        }

        var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
        var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
        return [parts[1], parts[2] || undefined, parts[3] || undefined];
    }

    public static parseV8OrIE(error) {
        var filtered = error.stack.split('\n').filter(function (line) {
            return !!line.match(CHROME_IE_STACK_REGEXP);
        }, this);

        return filtered.map(function (line) {
            if (line.indexOf('(eval ') > -1) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
            }
            var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(');

            // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
            // case it has spaces in it, as the string is split on \s+ later on
            var location = sanitizedLine.match(/ (\((.+):(\d+):(\d+)\)$)/);

            // remove the parenthesized location from the line, if it was matched
            sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

            var tokens = sanitizedLine.split(/\s+/).slice(1);
            // if a location was matched, pass it to extractLocation() otherwise pop the last token
            var locationParts = this.extractLocation(location ? location[1] : tokens.pop());
            var functionName = tokens.join(' ') || undefined;
            var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

            return new StackFrame({
                functionName: functionName,
                fileName: fileName,
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
            });
        }, this);
    }

    public static parseFFOrSafari(error) {
        var filtered = error.stack.split('\n').filter(function (line) {
            return !line.match(SAFARI_NATIVE_CODE_REGEXP);
        }, this);

        return filtered.map(function (line) {
            // Throw away eval information until we implement stacktrace.js/stackframe#8
            if (line.indexOf(' > eval') > -1) {
                line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
            }

            if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                // Safari eval frames only have function names and nothing else
                return new StackFrame({
                    functionName: line
                });
            } else {
                var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                var matches = line.match(functionNameRegex);
                var functionName = matches && matches[1] ? matches[1] : undefined;
                var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                return new StackFrame({
                    functionName: functionName,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }
        }, this);
    }

    public static parseOpera(e) {
        if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
            e.message.split('\n').length > e.stacktrace.split('\n').length)) {
            return this.parseOpera9(e);
        } else if (!e.stack) {
            return this.parseOpera10(e);
        } else {
            return this.parseOpera11(e);
        }
    }

    public static parseOpera9(e) {
        var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
        var lines = e.message.split('\n');
        var result = [];

        for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                result.push(new StackFrame({
                    fileName: match[2],
                    lineNumber: match[1],
                    source: lines[i]
                }));
            }
        }

        return result;
    }

    public static parseOpera10(e) {
        var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
        var lines = e.stacktrace.split('\n');
        var result = [];

        for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
                result.push(
                    new StackFrame({
                        functionName: match[3] || undefined,
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    })
                );
            }
        }

        return result;
    }

    // Opera 10.65+ Error.stack very similar to FF/Safari
    public static parseOpera11(error) {
        var filtered = error.stack.split('\n').filter(function (line) {
            return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
        }, this);

        return filtered.map(function (line) {
            var tokens = line.split('@');
            var locationParts = this.extractLocation(tokens.pop());
            var functionCall = (tokens.shift() || '');
            var functionName = functionCall
                .replace(/<anonymous function(: (\w+))?>/, '$2')
                .replace(/\([^)]*\)/g, '') || undefined;
            var argsRaw;
            if (functionCall.match(/\(([^)]*)\)/)) {
                argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
            }
            var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                undefined : argsRaw.split(',');

            return new StackFrame({
                functionName: functionName,
                args: args,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
            });
        }, this);
    }
}

export interface IStateService {
    GetSessionId(): string;
    SetSessionId(value: string): void;
}
export class RealmHttpClient {
    public static version = "1.2.3.4.5.6.7.8";
    public static Post<D = any, T = any, R = HttpClientResponse<T>>(url: string, data?: D, config?: HttpClientRequestConfig<D>): Promise<R> {

        const stateService: any = container.resolve<IStateService>('IStateService') as any;
        if (stateService == null) {
            throw 'State service not found'
        }
    
        const sesionInfo = stateService.GetStateVariable('session');
        return HttpClient.Post(url, data, Object.assign(config ?? {}, {
            headers: {
                'token': sesionInfo.session_id,
                'origin': window.location.origin
            }
        }))
    }
}