/** Exact, bounded models for the local manipulatives; no game-progress claims. */
export function placeValueParts(value: number, exchangeHundred = false) {
  if (!Number.isInteger(value) || value < 0 || value > 1000) throw new RangeError('Expected an integer from 0 to 1000');
  const hundreds = Math.floor(value / 100);
  const exchange = exchangeHundred && hundreds > 0;
  return {
    hundreds: hundreds - Number(exchange),
    tens: Math.floor(value % 100 / 10) + (exchange ? 10 : 0),
    ones: value % 10,
  };
}

export type GroupModelMode = 'multiply' | 'share' | 'pack';
export function equalGroupModel(mode: GroupModelMode, first: number, second: number) {
  if (!Number.isInteger(first) || !Number.isInteger(second) || first < 0 || first > 36 || second < 1 || second > 6) {
    throw new RangeError('Invalid group model parameters');
  }
  if (mode === 'multiply') {
    if (first > 6) throw new RangeError('At most six groups');
    return { groups: first, each: second, remainder: 0, total: first * second };
  }
  if (mode === 'share') return { groups: second, each: Math.floor(first / second), remainder: first % second, total: first };
  if (mode === 'pack') return { groups: Math.floor(first / second), each: second, remainder: first % second, total: first };
  throw new RangeError('Unknown grouping mode');
}
