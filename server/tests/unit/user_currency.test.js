const allowedCurrencies = ['ETB', 'USD', 'EUR', 'GBP'];

const test = () => {
  if (!allowedCurrencies.includes('ETB')) throw new Error('ETB must be supported');
  if (!allowedCurrencies.includes('USD')) throw new Error('USD must be supported');
  if (allowedCurrencies.includes('XYZ')) throw new Error('Unsupported currency accepted');
  console.log('✅ Unit Test Passed: user_currency');
};

test();
