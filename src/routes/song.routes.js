import { Router } from 'express';
import { save, getSong, list, update, remove, upload, audio } from '../controllers/song.controller.js';
import { auth } from '../middlewares/auth.js';
import multer from 'multer';

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs/")
    },
    filename: (req, file, cb) => {
        cb(null, "song-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({ storage });

const router = Router();

router.post('/save', auth, save);

router.get('/get/:songId', auth, getSong);

router.get('/list/:albumId', auth, list);

router.put('/update/:songId', auth, update);

router.delete('/remove/:songId', auth, remove);

router.post('/upload/:songId', [auth, uploads.single("file0")], upload);

router.get('/audio/:file', audio);

export default router;