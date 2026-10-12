const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const test = () => {
  if (!emailRegex.test('valid@example.com')) throw new Error('Valid email rejected');
  if (emailRegex.test('invalid-email')) throw new Error('Invalid email accepted');
  if (emailRegex.test('@example.com')) throw new Error('Missing local part accepted');
  if (emailRegex.test('user@')) throw new Error('Missing domain accepted');
  console.log('✅ Unit Test Passed: email_regex');
};

test();
