import { Router } from 'express';
import { save, getSong } from '../controllers/song.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:songId', auth, getSong);

export default router;