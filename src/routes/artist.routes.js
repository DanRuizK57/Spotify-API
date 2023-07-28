import { Router } from 'express';
import { save, getArtist, list } from '../controllers/artist.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:artistId', auth, getArtist);

router.get('/list/:page?', auth, list);

export default router;