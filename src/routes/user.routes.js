import { Router } from 'express';
import { register, login, profile, update, upload, showAvatar } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.js';
import multer from 'multer';

// Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname)
    }
});

const uploads = multer({ storage });

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile/:userId', auth , profile);

router.put('/update', auth , update);

router.post('/upload', [auth, uploads.single("file0")], upload);

router.get('/avatar/:file', showAvatar);

export default router;