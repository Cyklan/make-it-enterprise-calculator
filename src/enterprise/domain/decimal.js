export const DECIMAL_PATTERN = /^\d+(?:[.,]\d+)?$/

export const VALIDATION_MESSAGE = 'Enter a valid decimal number.'

export function sanitizeDecimal(raw) {
  const value = raw.replace(/[^\d.,]/g, '')
  const decimalSeparator = value.match(/[.,]/)?.[0]

  return decimalSeparator
    ? value.replace(/[.,]/g, (separator, index) =>
        separator === decimalSeparator && index === value.indexOf(decimalSeparator)
          ? separator
          : '',
      )
    : value
}

export function isDecimalValid(value) {
  return DECIMAL_PATTERN.test(value)
}

export function toCanonicalDecimal(value) {
  return Number(value.replace(',', '.'))
}
