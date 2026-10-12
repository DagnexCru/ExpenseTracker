const test = () => {
  const minLength = 6;
  const isSufficient = (pass) => Boolean(pass && pass.length >= minLength);

  if (isSufficient('12345')) throw new Error('5 chars should fail');
  if (!isSufficient('123456')) throw new Error('6 chars should pass');
  if (!isSufficient('longSecurePassword!')) throw new Error('Long pass should pass');
  console.log('✅ Unit Test Passed: password_length');
};

test();
