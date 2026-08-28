import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { AdditionService } from '../../src/enterprise/application/addition-service.js'
import { AuditLog, MemoryAuditStore } from '../../src/enterprise/audit/audit-log.js'

const createService = () => {
  const auditLog = new AuditLog(new MemoryAuditStore())
  return { service: new AdditionService({ auditLog }), auditLog }
}

describe('AdditionService.compute', () => {
  it('adds two valid decimals with either separator', () => {
    const { service } = createService()
    const outcome = service.compute('1,5', '2.25')

    assert.equal(outcome.status, 'success')
    assert.equal(outcome.value, 3.75)
    assert.equal(outcome.display, '3.75')
  })

  it('normalizes input before adding', () => {
    const { service } = createService()
    const outcome = service.compute('1,5,5', '0')

    assert.equal(outcome.status, 'success')
    assert.equal(outcome.display, '1.55')
  })

  it('preserves the existing arithmetic behaviour for non-exact decimals', () => {
    const { service } = createService()
    const outcome = service.compute('0.1', '0.2')

    assert.equal(outcome.status, 'success')
    assert.equal(outcome.value, 0.1 + 0.2)
    assert.equal(outcome.display, '0.30000000000000004')
  })

  it('rejects malformed or missing operands without computing', () => {
    const { service, auditLog } = createService()
    const outcome = service.compute('1.', '')

    assert.equal(outcome.status, 'invalid')
    assert.equal(outcome.message, 'Enter a valid decimal number.')
    assert.equal('value' in outcome, false)
    assert.equal(auditLog.size, 1)
    assert.equal(auditLog.events()[0].outcome, 'INVALID')
    assert.equal(auditLog.events()[0].result, null)
  })

  it('records a success audit event for every valid addition', () => {
    const { service, auditLog } = createService()
    service.compute('1,5', '2.25')

    const events = auditLog.events()
    assert.equal(events.length, 1)
    assert.equal(events[0].operation, 'ADD')
    assert.equal(events[0].outcome, 'SUCCESS')
    assert.deepEqual(events[0].operands, { first: '1,5', second: '2.25' })
    assert.equal(events[0].result, '3.75')
    assert.ok(events[0].id)
    assert.ok(events[0].timestamp)
  })
})
