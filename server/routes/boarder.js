import express from 'express';
import { createBoarder, getBoarders } from '../controllers/boarder.js';

const router = express.Router();

router.post('/', createBoarder);
router.get('/', getBoarders);

export default router;
