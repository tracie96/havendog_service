import express from 'express';
import { expressInterest, getInterestsByPet, updateInterestStatus, getAllInterests } from '../controllers/petInterest.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', (req, res, next) => {
    console.log('POST /api/interests route hit');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    next();
}, expressInterest);
router.get('/pet/:petId', getInterestsByPet);
router.get('/', getAllInterests);

// Protected routes (require authentication)
router.put('/:id/status', verifyToken, updateInterestStatus);

export default router; 