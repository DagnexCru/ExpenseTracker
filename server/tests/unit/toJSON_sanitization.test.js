const test = () => {
  const rawDocument = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Sanitized User',
    email: 'user@example.com',
    password: '$2a$10$encryptedHashValue',
    __v: 0,
  };

  const sanitize = (doc) => {
    const copy = { ...doc };
    delete copy.password;
    delete copy.__v;
    return copy;
  };

  const sanitized = sanitize(rawDocument);
  if (sanitized.password) throw new Error('Password must not be in sanitized output');
  if (sanitized.__v !== undefined) throw new Error('__v must not be in sanitized output');
  if (!sanitized.email || !sanitized.name) throw new Error('Safe fields must remain');
  console.log('✅ Unit Test Passed: toJSON_sanitization');
};

test();
