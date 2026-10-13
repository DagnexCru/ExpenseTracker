import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAvatarGradient } from '../utils/avatar.util.js';

describe('Client: Avatar Gradient Determinism', () => {
  it('should return identical gradient classes for identical user names', () => {
    const grad1 = getAvatarGradient('Dagnew Cru');
    const grad2 = getAvatarGradient('Dagnew Cru');
    assert.strictEqual(grad1, grad2);
    assert.ok(grad1.startsWith('from-'));
  });
});
