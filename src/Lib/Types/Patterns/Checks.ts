export function hasPattern(pattern: string, items: string[]): boolean {
  for (var I = 0; I < items.length; I++) {
    if (items[I].includes(pattern)) return true;
  }

  return false;
}
