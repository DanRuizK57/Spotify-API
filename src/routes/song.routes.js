import { Router } from 'express';
import { save, getSong, list, update, remove } from '../controllers/song.controller.js';
import { auth } from '../middlewares/auth.js';

const router = Router();

router.post('/save', auth, save);

router.get('/get/:songId', auth, getSong);

router.get('/list/:albumId', auth, list);

router.put('/update/:songId', auth, update);

router.delete('/remove/:songId', auth, remove);

export default router;