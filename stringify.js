export function stringify (input) {
  return JSON.stringify(input, replacer)
}

function replacer(key, value) {
  return typeof value === 'bigint' ?
    value.toString() + 'n' :
    value
}
