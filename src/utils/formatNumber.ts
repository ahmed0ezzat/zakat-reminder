// src/utils/formatNumber.ts
export function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '';
  return num.toLocaleString('en-US');
}
