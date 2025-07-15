import express from 'express';
import {
    createBoardingSubmission,
    getBoardingSubmissions,
    getBoardingSubmissionById,
    updateBoardingStatus
} from '../controllers/boarding.js';

const router = express.Router();

// Create a new boarding submission
router.post('/', createBoardingSubmission);

// Get all boarding submissions (can filter by status)
router.get('/', getBoardingSubmissions);

// Get a specific boarding submission
router.get('/:id', getBoardingSubmissionById);

// Update boarding submission status
router.patch('/:id/status', updateBoardingStatus);

export default router; 