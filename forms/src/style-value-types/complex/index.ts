import { color } from '../color';
import { number } from '../numbers';
import { Color } from '../types';
import { colorRegex, floatRegex, isString, sanitize } from '../utils';

const colorToken = '${c}';
const numberToken = '${n}';

function test(v: any) {
  return (
    isNaN(v) &&
    isString(v) &&
    (v.match(floatRegex)?.length ?? 0) + (v.match(colorRegex)?.length ?? 0) > 0
  );
}

function analyse(v: string | number) {
  if (typeof v === 'number') v = `${v}`;

  const values: Array<Color | number> = [];
  let numColors = 0;

  const colors = v.match(colorRegex);
  if (colors) {
    numColors = colors.length;
    // Strip colors from input so they're not picked up by number regex.
    // There's a better way to combine these regex searches, but its beyond my regex skills
    v = v.replace(colorRegex, colorToken);
    values.push(...colors.map(color.parse));
  }

  const numbers = v.match(floatRegex);
  if (numbers) {
    v = v.replace(floatRegex, numberToken);
    values.push(...numbers.map(number.parse));
  }

  return { values, numColors, tokenised: v };
}

function parse(v: string | number) {
  return analyse(v).values;
}

function createTransformer(v: string | number) {
  const { values, numColors, tokenised } = analyse(v);
  const numValues = values.length;

  return (v: Array<Color | number | string>) => {
    let output = tokenised;

    for (let i = 0; i < numValues; i++) {
      output = output.replace(
        i < numColors ? colorToken : numberToken,
        i < numColors ? color.transform(v[i]) : sanitize(v[i] as number)
      );
    }

    return output;
  };
}

const convertNumbersToZero = (v: number | Color) =>
  typeof v === 'number' ? 0 : v;

function getAnimatableNone(v: string | number) {
  const parsed = parse(v);
  const transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}

export const complex = { test, parse, createTransformer, getAnimatableNone };