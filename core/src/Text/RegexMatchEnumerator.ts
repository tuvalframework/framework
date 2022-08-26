import { Match, Regex } from "./RegularExpressions";
import { IEnumerator } from "../Collections/enumeration_/IEnumerator";
import { EnumeratorBase } from "../Collections/enumeration_/EnumeratorBase";
import { EmptyEnumerator } from "../Collections/enumeration_/EmptyEnumerator";


export class RegexMatchEnumerator {
	private readonly _pattern: Regex;

	constructor(pattern: string | RegExp | Regex) {
		if (pattern instanceof Regex) {
			this._pattern = pattern;
		}
		else {
			this._pattern = new Regex(pattern);
		}
	}

	matches(input: string): IEnumerator<Match> {
		let p: number; // pointer
		return new EnumeratorBase<Match>(
			() => {
				p = 0;
			},
			yielder => {
				let match: Match = this._pattern.match(input, p);
				if (match.success) {
					p = match.index + match.length;
					return yielder.yieldReturn(match);
				}

				return yielder.yieldBreak();
			});
	}

	static matches(input: string, pattern: string | RegExp | Regex): IEnumerator<Match> {
		return input && pattern
			? (new RegexMatchEnumerator(pattern)).matches(input)
			: EmptyEnumerator;
	}

}