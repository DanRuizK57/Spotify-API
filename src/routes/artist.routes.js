import { Router } from 'express';
import { save, getArtist, list, update, remove } from '../controllers/artist.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:artistId', auth, getArtist);

router.get('/list/:page?', auth, list);

router.put('/update/:artistId', auth, update);

router.delete('/remove/:artistId', auth, remove);

export default router;