import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    createAdoption,
    getAllAdoptions,
    getAdoptionById,
    updateAdoptionStatus,
    deleteAdoption,
    getAdoptionsByLocation,
    getAdoptionsByBreed
} from '../controllers/adoption.js';

const router = express.Router();

// Public routes
router.get('/', getAllAdoptions);
router.get('/:id', getAdoptionById);
router.get('/location/:location', getAdoptionsByLocation);
router.get('/breed/:breed', getAdoptionsByBreed);

// Protected routes
router.use(verifyToken);
router.post('/', createAdoption);
router.put('/:id/status', updateAdoptionStatus);
router.delete('/:id', deleteAdoption);

export default router; 