/** Skip duplicate/clamped snap positions so Previous always leaves the scroll end. */
export function galleryScrollTarget(positions: number[], current: number, maximum: number, direction: -1 | 1): number {
  const inset = positions[0] ?? 0;
  const targets = [0, ...positions.map(p => Math.max(0, Math.min(maximum, p - inset))), maximum];
  if (direction < 0) return Math.max(0, ...targets.filter(p => p < current - 2));
  return Math.min(maximum, ...targets.filter(p => p > current + 2));
}
