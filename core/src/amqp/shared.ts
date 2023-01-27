

const allDots = /\./g;
const allAstx = /\*/g;
const allHashs = /#/g;

export function generateId() {
  return Math.random().toString(16).substring(2, 12);
}

function DirectRoutingKeyPattern(pattern) {
  this._match = pattern;
}
DirectRoutingKeyPattern.prototype.test = function test(routingKey) {
  return this._match === routingKey;
};

function EndMatchRoutingKeyPattern(pattern) {
  this._match = pattern.replace('#', '');
}
EndMatchRoutingKeyPattern.prototype.test = function test(routingKey) {
  return !routingKey.indexOf(this._match);
};

export function getRoutingKeyPattern(pattern: string): (test: string)=>boolean {
  const len = pattern.length;
  const hashIdx = pattern.indexOf('#');
  const astxIdx = pattern.indexOf('*');
  if (hashIdx === -1) {
    if (astxIdx === -1) {
      return new DirectRoutingKeyPattern(pattern);
    }
  } else if (hashIdx === len - 1 && astxIdx === -1) {
    return new EndMatchRoutingKeyPattern(pattern);
  }

  const rpattern = pattern
    .replace(allDots, '\\.')
    .replace(allAstx, '[^.]+?')
    .replace(allHashs, '.*?');

  return (new RegExp(`^${rpattern}$`)) as any;
}

export function sortByPriority(a, b) {
  return (b.options.priority || 0) - (a.options.priority || 0);
}