const test = () => {
  const isValidName = (name) => Boolean(name && name.trim().length >= 2 && name.trim().length <= 50);

  if (isValidName('A')) throw new Error('Single char name should fail');
  if (!isValidName('Al')) throw new Error('Two char name should pass');
  if (!isValidName('Dagnew Cru')) throw new Error('Standard name should pass');
  if (isValidName(' '.repeat(5))) throw new Error('Spaces only should fail');
  console.log('✅ Unit Test Passed: name_length');
};

test();
