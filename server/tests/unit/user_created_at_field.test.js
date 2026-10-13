import { describe, it } from 'node:test';
import assert from 'node:assert';
import User from '../../src/models/User.js';

describe('Unit: User Schema Timestamps (createdAt)', () => {
  it('should include createdAt path in User schema definitions', () => {
    assert.ok(User.schema.paths.createdAt, 'createdAt path must be configured by timestamps');
  });
});
