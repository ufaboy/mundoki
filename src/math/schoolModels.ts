function integer(value: number, min: number, max: number) {
  if (!Number.isInteger(value) || value < min || value > max) throw new RangeError('Model value outside range');
}
export function fractionModel(numerator: number, denominator: number) {
  if (![2,4,8].includes(denominator)) throw new RangeError('Unsupported denominator');
  integer(numerator,0,denominator);
  return { numerator, denominator, eighths: numerator * (8 / denominator), value: numerator / denominator };
}
export function areaProduct(a: number, b: number) {
  integer(a,10,49); integer(b,2,29);
  const tensA = Math.floor(a / 10) * 10, onesA = a % 10;
  const tensB = Math.floor(b / 10) * 10, onesB = b % 10;
  return { a, b, tensA, onesA, tensB, onesB, parts: [tensA*tensB,onesA*tensB,tensA*onesB,onesA*onesB], total:a*b };
}
export function divisionModel(total: number, divisor: number) {
  integer(total,0,999); integer(divisor,2,9);
  const quotient = Math.floor(total/divisor), remainder = total % divisor;
  return {total,divisor,quotient,remainder,containers:quotient+(remainder>0?1:0)};
}
