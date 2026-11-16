/** A 3 × 3 map, numbered left-to-right from the top row. */
export function moveOnStoryMap(position: number, direction: string): number {
  const row = Math.floor(position / 3), column = position % 3;
  if (direction === 'up' && row > 0) return position - 3;
  if (direction === 'down' && row < 2) return position + 3;
  if (direction === 'left' && column > 0) return position - 1;
  if (direction === 'right' && column < 2) return position + 1;
  return position;
}
