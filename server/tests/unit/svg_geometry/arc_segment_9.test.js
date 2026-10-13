import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('SVG Donut Arc Segment 9', () => {
  it('should calculate stroke dasharray proportional to 45%', () => {
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const dash = (45 / 100) * circumference;
    assert.strictEqual(Math.round(dash * 10) / 10, 183.8);
  });
});
