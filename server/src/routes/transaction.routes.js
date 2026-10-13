/**
 * @file transaction.routes.js
 * @description Route definitions for /api/transactions protected by JWT authentication
 */

import express from 'express';
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Enforce authentication on all transaction endpoints
router.use(protect);

router.route('/')
  .post(create)
  .get(getAll);

router.route('/:id')
  .get(getById)
  .put(update)
  .delete(remove);

export default router;
