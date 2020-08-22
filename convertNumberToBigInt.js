export function convertNumbeToBigInt (value) {
  return typeof value === 'bigint' ?
    value :
    BigInt(Math.floor(value))
}
