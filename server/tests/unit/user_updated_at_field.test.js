import { describe, it } from 'node:test';
import assert from 'node:assert';
import User from '../../src/models/User.js';

describe('Unit: User Schema Timestamps (updatedAt)', () => {
  it('should include updatedAt path in User schema definitions', () => {
    assert.ok(User.schema.paths.updatedAt, 'updatedAt path must be configured by timestamps');
  });
});
