import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  AuditLog,
  MemoryAuditStore,
  BrowserAuditStore,
  AUDIT_OUTCOME,
  DEFAULT_AUDIT_KEY,
} from '../../src/enterprise/audit/audit-log.js'

describe('AuditLog', () => {
  it('records append-only events with id and timestamp', () => {
    const log = new AuditLog(new MemoryAuditStore())

    log.record({ operation: 'ADD', outcome: AUDIT_OUTCOME.SUCCESS, operands: {}, result: '3.75' })
    log.record({ operation: 'ADD', outcome: AUDIT_OUTCOME.INVALID, operands: {}, result: null })

    const events = log.events()
    assert.equal(log.size, 2)
    assert.equal(events.length, 2)
    assert.ok(events[0].id)
    assert.ok(events[1].id)
    assert.ok(events[0].timestamp)
    assert.equal(events[1].outcome, 'INVALID')
  })

  it('returns a snapshot so callers cannot mutate the trail', () => {
    const log = new AuditLog(new MemoryAuditStore())
    log.record({ operation: 'ADD', outcome: AUDIT_OUTCOME.SUCCESS, operands: {}, result: '1' })

    const events = log.events()
    events.pop()
    assert.equal(log.size, 1)
  })
})

describe('BrowserAuditStore', () => {
  const fakeStorage = (initial = {}) => {
    const data = new Map(Object.entries(initial))
    return {
      getItem: (key) => (data.has(key) ? data.get(key) : null),
      setItem: (key, value) => data.set(key, String(value)),
    }
  }

  it('persists events to storage and restores them', () => {
    const storage = fakeStorage()
    const store = new BrowserAuditStore(storage)

    store.push({ id: 'a', outcome: 'SUCCESS' })
    store.push({ id: 'b', outcome: 'SUCCESS' })

    const restored = new BrowserAuditStore(storage)
    assert.equal(restored.size, 2)
    assert.equal(restored.all()[0].id, 'a')
  })

  it('caps the retained trail at the configured limit', () => {
    const storage = fakeStorage()
    const store = new BrowserAuditStore(storage, DEFAULT_AUDIT_KEY, { retention: 3 })

    for (let index = 1; index <= 5; index += 1) {
      store.push({ id: String(index), outcome: 'SUCCESS' })
    }

    assert.equal(store.size, 3)
    assert.deepEqual(
      store.all().map((event) => event.id),
      ['3', '4', '5'],
    )
  })

  it('continues in memory when storage is unavailable', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('denied')
      },
      setItem: () => {
        throw new Error('denied')
      },
    }
    const store = new BrowserAuditStore(throwingStorage)

    store.push({ id: 'a', outcome: 'SUCCESS' })
    assert.equal(store.size, 1)
    assert.equal(store.all()[0].id, 'a')
  })

  it('recovers from corrupt stored payloads', () => {
    const storage = fakeStorage({ [DEFAULT_AUDIT_KEY]: 'not-json' })
    const store = new BrowserAuditStore(storage)

    assert.equal(store.size, 0)
    store.push({ id: 'a', outcome: 'SUCCESS' })
    assert.equal(store.size, 1)
  })
})
