export function staggerDelay(index: number, interval: number = 6): number {
  return index * interval;
}

export function staggerFrom(
  baseDelay: number,
  index: number,
  interval: number = 6
): number {
  return baseDelay + index * interval;
}
