import { describe, it } from 'node:test';
import assert from 'node:assert';
import Transaction from '../../src/models/Transaction.js';

describe('Unit: Transaction Schema Structure', () => {
  it('should define all required schema paths', () => {
    const paths = Transaction.schema.paths;
    assert.ok(paths.user, 'user path must exist');
    assert.ok(paths.type, 'type path must exist');
    assert.ok(paths.amount, 'amount path must exist');
    assert.ok(paths.category, 'category path must exist');
    assert.ok(paths.date, 'date path must exist');
    assert.ok(paths.paymentMethod, 'paymentMethod path must exist');
  });

  it('should restrict type enum to income and expense', () => {
    const typeEnum = Transaction.schema.paths.type.enumValues;
    assert.deepStrictEqual(typeEnum, ['income', 'expense']);
  });

  it('should default payment method to cash', () => {
    assert.strictEqual(Transaction.schema.paths.paymentMethod.defaultValue, 'cash');
  });
});
