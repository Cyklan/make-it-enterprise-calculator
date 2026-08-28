export const AUDIT_OPERATION = 'ADD'

export const AUDIT_OUTCOME = Object.freeze({
  SUCCESS: 'SUCCESS',
  INVALID: 'INVALID',
})

export const DEFAULT_AUDIT_KEY = 'enterprise-calculator.audit'

export const DEFAULT_RETENTION = 200

function createCorrelationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256)
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex
    .slice(6, 8)
    .join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`
}

export class MemoryAuditStore {
  #events

  constructor(initial = []) {
    this.#events = [...initial]
  }

  push(event) {
    this.#events.push(event)
    return event
  }

  all() {
    return this.#events.slice()
  }

  get size() {
    return this.#events.length
  }
}

export class BrowserAuditStore {
  #storage
  #key
  #retention
  #events

  constructor(storage, key = DEFAULT_AUDIT_KEY, { retention = DEFAULT_RETENTION } = {}) {
    this.#storage = storage
    this.#key = key
    this.#retention = retention
    this.#events = this.#restore()
  }

  #restore() {
    const fallback = []
    try {
      const serialized = this.#storage.getItem(this.#key)
      const events = serialized ? JSON.parse(serialized) : []
      return Array.isArray(events) ? events : fallback
    } catch {
      return fallback
    }
  }

  push(event) {
    this.#events.push(event)
    if (this.#events.length > this.#retention) {
      this.#events = this.#events.slice(this.#events.length - this.#retention)
    }
    this.#persist()
    return event
  }

  #persist() {
    try {
      this.#storage.setItem(this.#key, JSON.stringify(this.#events))
    } catch {
      // persistence failure must never break the calculator
    }
  }

  all() {
    return this.#events.slice()
  }

  get size() {
    return this.#events.length
  }
}

export class AuditLog {
  #store

  constructor(store = new MemoryAuditStore()) {
    this.#store = store
  }

  record(event) {
    return this.#store.push({
      id: createCorrelationId(),
      timestamp: new Date().toISOString(),
      ...event,
    })
  }

  events() {
    return this.#store.all()
  }

  get size() {
    return this.#store.size
  }
}
