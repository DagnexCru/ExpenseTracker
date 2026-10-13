import { describe, it } from 'node:test';
import assert from 'node:assert';
import { hashPassword } from '../../src/utils/password.util.js';

describe('Unit: Bcrypt Salt Cost Factor', () => {
  it('should generate a bcrypt hash with cost factor 10 ($2a$10$ or $2b$10$)', async () => {
    const hash = await hashPassword('SamplePassword123');
    assert.match(hash, /^\$2[ab]\$10\$/);
  });
});
