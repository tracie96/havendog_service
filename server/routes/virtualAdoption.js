import express from 'express';
import { verifyAdmin } from '../middleware/auth.js';
import {
    getPublicListing,
    getAdminOverview,
    updateMonthlyPrice,
    createChallenge,
    updateChallenge,
    deleteChallenge,
    createSponsorship
} from '../controllers/virtualAdoption.js';

const router = express.Router();

router.get('/', getPublicListing);
router.post('/sponsorships', createSponsorship);
router.get('/manage', verifyAdmin, getAdminOverview);
router.put('/settings', verifyAdmin, updateMonthlyPrice);
router.post('/challenges', verifyAdmin, createChallenge);
router.patch('/challenges/:id', verifyAdmin, updateChallenge);
router.delete('/challenges/:id', verifyAdmin, deleteChallenge);

export default router;
