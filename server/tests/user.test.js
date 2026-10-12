import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { connectDB } from '../src/config/db.js';

const runUserTests = async () => {
  console.log('🧪 Starting User Model Unit & Schema Tests...');
  await connectDB();

  const testEmail = `test_${Date.now()}@example.com`;

  try {
    // 1. Validation test: Invalid email format
    const invalidUser = new User({
      name: 'Bad Email User',
      email: 'not-an-email',
      password: 'validPassword123!',
    });

    let validationFailed = false;
    try {
      await invalidUser.validate();
    } catch (err) {
      validationFailed = true;
    }
    if (!validationFailed) {
      throw new Error('User model accepted invalid email format');
    }
    console.log('  ✅ User schema rejected invalid email format');

    // 2. Validation test: Password too short
    const shortPasswordUser = new User({
      name: 'Short Password User',
      email: 'valid@example.com',
      password: '123',
    });

    let shortPassFailed = false;
    try {
      await shortPasswordUser.validate();
    } catch (err) {
      shortPassFailed = true;
    }
    if (!shortPassFailed) {
      throw new Error('User schema accepted password under 6 characters');
    }
    console.log('  ✅ User schema rejected password shorter than 6 characters');

    // 3. User creation and pre-save password hashing
    const validUser = new User({
      name: 'John Doe',
      email: testEmail,
      password: 'ValidPassword123!',
      currency: 'ETB',
    });

    await validUser.save();
    console.log('  ✅ User document saved to MongoDB collection');

    // Verify password was hashed and not plaintext
    if (validUser.password === 'ValidPassword123!' || !validUser.password.startsWith('$2')) {
      throw new Error('User pre-save hook failed to hash password with bcrypt');
    }
    console.log('  ✅ User pre-save hook successfully hashed password with bcrypt');

    // Verify matchPassword instance method
    const isMatch = await validUser.matchPassword('ValidPassword123!');
    if (!isMatch) {
      throw new Error('User.matchPassword failed for valid credentials');
    }
    console.log('  ✅ User.matchPassword confirmed valid password');

    const isWrongMatch = await validUser.matchPassword('WrongPass');
    if (isWrongMatch) {
      throw new Error('User.matchPassword falsely verified wrong password');
    }
    console.log('  ✅ User.matchPassword rejected invalid password');

    // Verify toJSON omits password
    const jsonOutput = validUser.toJSON();
    if (jsonOutput.password) {
      throw new Error('User.toJSON leaked password field');
    }
    console.log('  ✅ User.toJSON safely omitted password field from serialized output');

    // Clean up test document
    await User.deleteOne({ _id: validUser._id });
    console.log('  ✅ Cleaned up temporary test user');

    console.log('🎉 All User Model Unit Tests Passed!\n');
  } finally {
    await mongoose.connection.close();
  }
};

runUserTests().catch((err) => {
  console.error('❌ User Model Test Failure:', err.message);
  process.exit(1);
});
