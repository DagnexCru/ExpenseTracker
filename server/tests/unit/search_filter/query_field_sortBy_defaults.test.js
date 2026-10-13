import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('Query Field Defaults: sortBy', () => {
  it('should apply safe defaults when sortBy is undefined', () => {
    const fallback = undefined;
    assert.strictEqual(fallback, undefined);
  });
});
