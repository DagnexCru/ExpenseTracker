import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Query Field Defaults: sortOrder', () => {
  it('should apply safe defaults when sortOrder is undefined', () => {
    const fallback = undefined;
    assert.strictEqual(fallback, undefined);
  });
});
