import { AdditionService } from './application/addition-service.js'
import {
  AuditLog,
  BrowserAuditStore,
  MemoryAuditStore,
} from './audit/audit-log.js'

export { sanitizeDecimal, isDecimalValid, toCanonicalDecimal, VALIDATION_MESSAGE } from './domain/decimal.js'
export { AuditLog, MemoryAuditStore, BrowserAuditStore, AUDIT_OPERATION, AUDIT_OUTCOME } from './audit/audit-log.js'
export { AdditionService } from './application/addition-service.js'

export function createBrowserAdditionContext() {
  let store = new MemoryAuditStore()
  try {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      store = new BrowserAuditStore(globalThis.localStorage)
    }
  } catch {
    store = new MemoryAuditStore()
  }

  const auditLog = new AuditLog(store)
  return {
    additionService: new AdditionService({ auditLog }),
    auditLog,
  }
}
