import {
  sanitizeDecimal,
  isDecimalValid,
  toCanonicalDecimal,
  VALIDATION_MESSAGE,
} from '../domain/decimal.js'
import { AuditLog, AUDIT_OPERATION, AUDIT_OUTCOME } from '../audit/audit-log.js'

export class AdditionService {
  #auditLog

  constructor({ auditLog = new AuditLog() } = {}) {
    this.#auditLog = auditLog
  }

  compute(firstRaw, secondRaw) {
    const operands = {
      first: sanitizeDecimal(firstRaw),
      second: sanitizeDecimal(secondRaw),
    }

    if (!isDecimalValid(operands.first) || !isDecimalValid(operands.second)) {
      const audit = this.#auditLog.record({
        operation: AUDIT_OPERATION,
        outcome: AUDIT_OUTCOME.INVALID,
        operands,
        result: null,
      })
      return { status: 'invalid', message: VALIDATION_MESSAGE, audit }
    }

    const value =
      toCanonicalDecimal(operands.first) + toCanonicalDecimal(operands.second)
    const display = String(value)

    const audit = this.#auditLog.record({
      operation: AUDIT_OPERATION,
      outcome: AUDIT_OUTCOME.SUCCESS,
      operands,
      result: display,
    })

    return { status: 'success', value, display, audit }
  }
}
