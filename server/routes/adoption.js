import express from 'express';
import {
    createAdoption,
    getAllAdoptions,
    getAdoptionById,
    updateAdoption,
    deleteAdoption,
    getAdoptionsByLocation,
    getAdoptionsByBreed
} from '../controllers/adoption.js';

const router = express.Router();

// All routes are public
router.get('/', getAllAdoptions);
router.get('/:id', getAdoptionById);
router.get('/location/:location', getAdoptionsByLocation);
router.get('/breed/:breed', getAdoptionsByBreed);
router.post('/', createAdoption);
router.put('/:id', updateAdoption);
router.delete('/:id', deleteAdoption);

export default router; 