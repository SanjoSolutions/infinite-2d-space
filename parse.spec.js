import { describe, it } from '@jest/globals'
import { parse } from './parse.js'

describe('parse', () => {
  it('parses BigInts', () => {
    expect(parse('"100n"')).toEqual(100n)
  })

  it('still parses other types like JSON.parse', () => {
    expect(parse('100')).toEqual(100)
  })
})
