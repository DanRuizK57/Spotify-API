import { Router } from 'express';
import { save, getArtist, list, update, remove, upload, showImage } from '../controllers/artist.controller.js';
import { auth } from '../middlewares/auth.js';
import multer from 'multer';

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists/")
    },
    filename: (req, file, cb) => {
        cb(null, "artist-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({ storage });

const router = Router();

router.post('/save', auth, save);

router.get('/get/:artistId', auth, getArtist);

router.get('/list/:page?', auth, list);

router.put('/update/:artistId', auth, update);

router.delete('/remove/:artistId', auth, remove);

router.post('/upload/:artistId', [auth, uploads.single("file0")], upload);

router.get('/image/:file', showImage);

export default router;