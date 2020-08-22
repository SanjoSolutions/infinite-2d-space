export function parse (input) {
  return JSON.parse(input, reviver)
}

function reviver(key, value) {
  return typeof value === 'string' && value.endsWith('n') ?
    BigInt(value.substring(0, value.length - 1)) :
    value
}
