function parseNumber(valueWithUnit: string | undefined | null): number | null {
  if (!valueWithUnit) return null;
  const num = parseFloat(valueWithUnit.replace(/[^\d.]/g, ''));
  return isNaN(num) ? null : num;
}

export function getAverage(values: (string | null | undefined)[]): string | null {
  const nums = values.map(parseNumber).filter((n): n is number => n !== null);
  if (!nums.length) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return avg.toFixed(3); // 3 decimal places
}
