import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { SUPPORTED_CURRENCY_CODES, DEFAULT_CURRENCY } from '../constants/currencies.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Omit password hash from queries by default
    },
    currency: {
      type: String,
      default: DEFAULT_CURRENCY,
      enum: {
        values: SUPPORTED_CURRENCY_CODES,
        message: '{VALUE} is not a supported currency preference',
      },
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

/**
 * Pre-save middleware hook: Hashes password if modified before saving to MongoDB
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: Verifies entered plaintext password against stored hash
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return comparePassword(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
