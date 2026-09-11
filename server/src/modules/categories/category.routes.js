import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: Get categories for the frontend filter
router.get('/', categoryController.getCategories);

// Admin-only: Manage categories
router.post('/', verifyToken, requireAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, requireAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, requireAdmin, categoryController.deleteCategory);

export default router;