# SpendWise — Password Complexity & Policy Guidelines

## Minimum Requirements
1. **Length:** Minimum 6 characters (enforced by Mongoose validator and express middleware).
2. **Hashing:** 10 rounds of salt generation using `bcryptjs`.
3. **Entropy Feedback:** Tiered client and server scoring (Too Short, Weak, Fair, Good, Strong).
4. **Leak Mitigation:** `User.toJSON` transforms delete the password hash from memory prior to serialization.
