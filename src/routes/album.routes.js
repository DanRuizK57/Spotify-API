import { Router } from 'express';
import { save, getAlbum, list, update } from '../controllers/album.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:albumId', auth, getAlbum);

router.get('/list/:artistId', auth, list);

router.put('/update/:albumId', auth, update);

export default router;