import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('SVG Donut Arc Segment 2', () => {
  it('should calculate stroke dasharray proportional to 10%', () => {
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const dash = (10 / 100) * circumference;
    assert.strictEqual(Math.round(dash * 10) / 10, 40.8);
  });
});
