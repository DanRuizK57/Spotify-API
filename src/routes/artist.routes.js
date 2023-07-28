import { Router } from 'express';
import { save, getArtist } from '../controllers/artist.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:artistId', auth, getArtist);

export default router;