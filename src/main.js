import './style.css'
import {
  sanitizeDecimal,
  isDecimalValid,
  VALIDATION_MESSAGE,
} from './enterprise/domain/decimal.js'
import {
  AUDIT_OPERATION,
  AUDIT_OUTCOME,
} from './enterprise/audit/audit-log.js'
import { createBrowserAdditionContext } from './enterprise/index.js'

const form = document.querySelector('#calculator')
const first = document.querySelector('#first-number')
const second = document.querySelector('#second-number')
const result = document.querySelector('#result')

const { additionService, auditLog } = createBrowserAdditionContext()

const sanitizeInput = (event) => {
  const input = event.currentTarget

  input.value = sanitizeDecimal(input.value)

  input.setCustomValidity(
    input.value && !isDecimalValid(input.value) ? VALIDATION_MESSAGE : '',
  )
}

first.addEventListener('input', sanitizeInput)
second.addEventListener('input', sanitizeInput)

form.addEventListener('submit', (event) => {
  event.preventDefault()

  if (!form.checkValidity()) {
    auditLog.record({
      operation: AUDIT_OPERATION,
      outcome: AUDIT_OUTCOME.INVALID,
      operands: { first: first.value, second: second.value },
      result: null,
    })
    form.reportValidity()
    return
  }

  const outcome = additionService.compute(first.value, second.value)

  if (outcome.status === 'success') {
    result.textContent = outcome.display
  }
})
