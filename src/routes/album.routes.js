import { Router } from 'express';
import { save, getAlbum, list, update, upload, showImage, remove } from '../controllers/album.controller.js';
import { auth } from '../middlewares/auth.js';
import multer from 'multer';

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums/")
    },
    filename: (req, file, cb) => {
        cb(null, "album-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({ storage });

const router = Router();

router.post('/save', auth, save);

router.get('/get/:albumId', auth, getAlbum);

router.get('/list/:artistId', auth, list);

router.put('/update/:albumId', auth, update);

router.post('/upload/:albumId', [auth, uploads.single("file0")], upload);

router.get('/image/:file', showImage);

router.delete('/remove/:albumId', auth, remove);

export default router;