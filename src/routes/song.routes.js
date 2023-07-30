import { Router } from 'express';
import { save } from '../controllers/song.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

export default router;