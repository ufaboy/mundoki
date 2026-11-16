export interface Rational {
  numerator: number;
  denominator: number;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

export function normalizeRational(num: number, den: number): Rational | null {
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
    return null;
  }
  const sign = den < 0 ? -1 : 1;
  const signedNum = num * sign;
  const absDen = Math.abs(den);
  if (signedNum === 0) {
    return { numerator: 0, denominator: 1 };
  }
  const divisor = gcd(signedNum, absDen);
  return {
    numerator: signedNum / divisor,
    denominator: absDen / divisor,
  };
}

/**
 * Parses a user-entered string into a Rational or numeric value.
 * Supports:
 * - Standard fractions: "3/4", "-2/5", " 6 / 8 "
 * - Mixed or integer strings: "5", "-12"
 * - Locale decimals with either comma or dot: "0,75", "0.75", "-2,5"
 */
export function parseRationalInput(raw: string): {
  valid: boolean;
  errorReason?: 'empty' | 'division_by_zero' | 'malformed';
  rational?: Rational;
  rawNumerator?: number;
  rawDenominator?: number;
} {
  const cleaned = raw.trim().replace(/\s+/g, '');
  if (!cleaned) {
    return { valid: false, errorReason: 'empty' };
  }

  // Check fraction format a/b
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { valid: false, errorReason: 'malformed' };
    }
    const num = Number(parts[0].replace(',', '.'));
    const den = Number(parts[1].replace(',', '.'));
    if (!Number.isInteger(num) || !Number.isInteger(den)) {
      return { valid: false, errorReason: 'malformed' };
    }
    if (den === 0) {
      return { valid: false, errorReason: 'division_by_zero' };
    }
    const normalized = normalizeRational(num, den);
    if (!normalized) {
      return { valid: false, errorReason: 'division_by_zero' };
    }
    return {
      valid: true,
      rational: normalized,
      rawNumerator: num,
      rawDenominator: den,
    };
  }

  // Check decimal or integer format (supporting both es-AR comma and en-US dot)
  const normalizedDecimal = cleaned.replace(',', '.');
  if (!/^[+-]?\d+(\.\d+)?$/.test(normalizedDecimal)) {
    return { valid: false, errorReason: 'malformed' };
  }

  const value = Number(normalizedDecimal);
  if (!Number.isFinite(value) || Math.abs(value) > 1e9) {
    return { valid: false, errorReason: 'malformed' };
  }

  if (Number.isInteger(value)) {
    return {
      valid: true,
      rational: { numerator: value, denominator: 1 },
      rawNumerator: value,
      rawDenominator: 1,
    };
  }

  // Convert terminating decimal to rational
  const decimalPlaces = (normalizedDecimal.split('.')[1] || '').length;
  const scale = Math.pow(10, Math.min(decimalPlaces, 6));
  const scaledNum = Math.round(value * scale);
  const rational = normalizeRational(scaledNum, scale);
  if (!rational) {
    return { valid: false, errorReason: 'malformed' };
  }
  return {
    valid: true,
    rational,
    rawNumerator: scaledNum,
    rawDenominator: scale,
  };
}

export function formatRational(r: Rational): string {
  if (r.denominator === 1) {
    return `${r.numerator}`;
  }
  return `${r.numerator}/${r.denominator}`;
}
