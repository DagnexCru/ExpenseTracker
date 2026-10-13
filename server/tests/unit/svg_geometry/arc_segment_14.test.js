import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('SVG Donut Arc Segment 14', () => {
  it('should calculate stroke dasharray proportional to 70%', () => {
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const dash = (70 / 100) * circumference;
    assert.strictEqual(Math.round(dash * 10) / 10, 285.9);
  });
});
