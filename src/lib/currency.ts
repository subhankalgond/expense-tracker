/**
 * Financial calculation and currency formatting utilities.
 * Handles exact integer minor-unit arithmetic (paise) to prevent floating-point inaccuracies.
 */

/**
 * Formats a number to Indian Rupee (INR) format with ₹ symbol.
 * Example: 125000 -> ₹1,25,000.00 or ₹1,25,000
 */
export function formatINR(
  amount: number,
  options?: { showDecimals?: boolean; compact?: boolean }
): string {
  const { showDecimals = true, compact = false } = options || {};

  if (compact && Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (compact && Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  // Exact Indian locale formatting
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return formatted;
}

/**
 * Converts a rupee decimal amount (e.g. 125.50) into integer paise (12550).
 */
export function toPaise(rupees: number): number {
  return Math.round((rupees + Number.EPSILON) * 100);
}

/**
 * Converts integer paise back into rupee decimal.
 */
export function fromPaise(paise: number): number {
  return paise / 100;
}

/**
 * Accurately sums an array of numbers using integer minor units.
 */
export function safeSum(amounts: number[]): number {
  const totalPaise = amounts.reduce((acc, curr) => acc + toPaise(curr), 0);
  return fromPaise(totalPaise);
}

/**
 * Accurately subtracts subtrahend from minuend using integer minor units.
 */
export function safeSubtract(minuend: number, subtrahend: number): number {
  return fromPaise(toPaise(minuend) - toPaise(subtrahend));
}

/**
 * Computes percentage with protection against division by zero.
 */
export function safePercentage(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  const pct = Math.round((numerator / denominator) * 100);
  return Math.min(Math.max(pct, 0), 999);
}
