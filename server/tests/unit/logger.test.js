import { describe, it } from 'node:test';
import assert from 'node:assert';
import { logAuthEvent } from '../../src/utils/logger.util.js';

describe('Audit Logger Utility Tests', () => {
  it('should format and return structured auth audit event payload', () => {
    const event = logAuthEvent('LOGIN_ATTEMPT', {
      email: 'USER@spendwise.et',
      ip: '192.168.1.1',
      status: 'SUCCESS',
    });

    assert.strictEqual(event.eventType, 'LOGIN_ATTEMPT');
    assert.strictEqual(event.email, 'user@spendwise.et');
    assert.strictEqual(event.ip, '192.168.1.1');
    assert.strictEqual(event.status, 'SUCCESS');
    assert.ok(event.timestamp);
  });
});
