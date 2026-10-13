import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('SVG Donut Arc Segment 15', () => {
  it('should calculate stroke dasharray proportional to 75%', () => {
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const dash = (75 / 100) * circumference;
    assert.strictEqual(Math.round(dash * 10) / 10, 306.3);
  });
});
