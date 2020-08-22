import { describe, it } from '@jest/globals'
import { convertNumbeToBigInt } from './convertNumberToBigInt.js'

describe('convertNumbeToBigInt', () => {
  it('it truncates numbers after comma', () => {
    expect(convertNumbeToBigInt(1.5)).toEqual(1n)
  })

  it('converts a Number to a BigInt', () => {
    expect(convertNumbeToBigInt(1)).toEqual(1n)
  })

  it('accepts BigInt and just returns its value', () => {
    expect(convertNumbeToBigInt(1n)).toEqual(1n)
  })
})
