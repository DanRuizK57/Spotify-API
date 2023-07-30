import { Router } from 'express';
import { save, getAlbum, list } from '../controllers/album.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:albumId', auth, getAlbum);

router.get('/list/:artistId', auth, list);

export default router;