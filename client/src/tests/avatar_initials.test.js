import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getInitials } from '../utils/avatar.util.js';

describe('Client: Avatar Initials Extraction', () => {
  it('should extract two-letter initials from full names', () => {
    assert.strictEqual(getInitials('Dagnew Cru'), 'DC');
    assert.strictEqual(getInitials('Abebe Bikila'), 'AB');
    assert.strictEqual(getInitials('Single'), 'SI');
    assert.strictEqual(getInitials(''), 'U');
  });
});
