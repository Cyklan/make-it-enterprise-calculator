import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  DECIMAL_PATTERN,
  sanitizeDecimal,
  isDecimalValid,
  toCanonicalDecimal,
} from '../../src/enterprise/domain/decimal.js'

describe('sanitizeDecimal', () => {
  it('keeps digits and a single decimal separator', () => {
    assert.equal(sanitizeDecimal('12.34'), '12.34')
    assert.equal(sanitizeDecimal('12,34'), '12,34')
  })

  it('keeps only the first separator when several are typed', () => {
    assert.equal(sanitizeDecimal('1.2.3'), '1.23')
    assert.equal(sanitizeDecimal('1,2,3'), '1,23')
    assert.equal(sanitizeDecimal('1,2.3'), '1,23')
  })

  it('strips characters that are not digits or separators', () => {
    assert.equal(sanitizeDecimal('a1-b2.5c'), '12.5')
    assert.equal(sanitizeDecimal('-3.14'), '3.14')
    assert.equal(sanitizeDecimal(''), '')
  })
})

describe('isDecimalValid', () => {
  it('accepts non-negative decimals with either separator', () => {
    assert.equal(isDecimalValid('0'), true)
    assert.equal(isDecimalValid('42'), true)
    assert.equal(isDecimalValid('1.5'), true)
    assert.equal(isDecimalValid('1,5'), true)
  })

  it('rejects malformed values', () => {
    assert.equal(isDecimalValid(''), false)
    assert.equal(isDecimalValid('1.'), false)
    assert.equal(isDecimalValid('.5'), false)
    assert.equal(isDecimalValid('1.2.3'), false)
    assert.equal(isDecimalValid('abc'), false)
  })
})

describe('toCanonicalDecimal', () => {
  it('converts a comma separator to a dot for arithmetic', () => {
    assert.equal(toCanonicalDecimal('1,5'), 1.5)
    assert.equal(toCanonicalDecimal('2.25'), 2.25)
  })
})

describe('DECIMAL_PATTERN', () => {
  it('is the single source of truth for the decimal business rule', () => {
    assert.equal(DECIMAL_PATTERN.source, String(/^\d+(?:[.,]\d+)?$/).slice(1, -1))
  })
})
