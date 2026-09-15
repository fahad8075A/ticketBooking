import express from 'express';
import { 
  addEvent, 
  getEvent, 
  listEvent, 
  updateEvent, 
  deleteEvent 
} from './event.controllers.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (anyone can browse)
router.get('/', listEvent);
router.get('/:id', getEvent);

// Protected routes (requires login/token)
router.post('/', authenticate, addEvent);
router.put('/:id', authenticate, updateEvent);     // Added for editing
router.delete('/:id', authenticate, deleteEvent);  // Added for deleting

export default router;