import express from 'express';
import {
    createSurrenderSubmission,
    getSurrenderSubmissions,
    getSurrenderSubmissionById,
    updateSurrenderStatus
} from '../controllers/surrender.js';

const router = express.Router();

router.post('/', createSurrenderSubmission);
router.get('/', getSurrenderSubmissions);
router.get('/:id', getSurrenderSubmissionById);
router.patch('/:id', updateSurrenderStatus);

export default router;
