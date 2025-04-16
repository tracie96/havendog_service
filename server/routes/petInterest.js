import express from 'express';
import { expressInterest, getInterestsByPet, updateInterestStatus, getAllInterests } from '../controllers/petInterest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', expressInterest);
router.get('/pet/:petId', getInterestsByPet);
router.get('/', getAllInterests);

// Protected routes (require authentication)
router.put('/:id/status', verifyToken, updateInterestStatus);

export default router; 