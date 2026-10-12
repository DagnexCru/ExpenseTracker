# SpendWise Phase 2 — Database Schema & Data Modeling

## Database: `expensetracker`
## Collection: `users`

### Document Structure
```json
{
  "_id": "ObjectId('670a23f890abcdef01234567')",
  "name": "Abebe Bikila",
  "email": "abebe.test@spendwise.et",
  "password": "$2a$10$e8eY... (bcrypt hash)",
  "currency": "ETB",
  "createdAt": "2026-10-12T20:00:00.000Z",
  "updatedAt": "2026-10-12T20:00:00.000Z"
}
```

### Fields Specification
| Field | Type | Required | Default | Validation Rules | Description |
|---|---|---|---|---|---|
| `name` | String | Yes | - | `trim: true`, `minlength: 2`, `maxlength: 50` | User full name |
| `email` | String | Yes | - | `unique: true`, `lowercase: true`, `trim: true`, Regex match | User login and contact identifier |
| `password` | String | Yes | - | `minlength: 6`, `select: true` | Salted bcrypt hash |
| `currency` | String | No | `'ETB'` | Enum: `['ETB', 'USD', 'EUR', 'GBP']` | Preferred currency |
| `createdAt` | Date | Auto | Current Date | Mongoose timestamps | Creation timestamp |
| `updatedAt` | Date | Auto | Current Date | Mongoose timestamps | Last update timestamp |

### Indexes
1. `_id_`: Default MongoDB primary key index (`{ _id: 1 }`).
2. `email_1`: Unique ascending index on email (`{ email: 1, unique: true }`).
