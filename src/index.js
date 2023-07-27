import express from 'express';
import cors from 'cors';
import envs from './configs/environments.js';
import connect from './configs/mongo.js';
import AlbumRoutes from './routes/album.routes.js';
import ArtistRoutes from './routes/artist.routes.js';
import SongRoutes from './routes/song.routes.js';
import UserRoutes from './routes/user.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/album", AlbumRoutes);
app.use("/artist", ArtistRoutes);
app.use("/song", SongRoutes);
app.use("/user", UserRoutes);

console.log('Conectando a la base de datos...');
connect()
  .then(() => {
    console.log('MongoDB Conectado Correctamente');
    app.listen(envs.PORT, async () => {
      console.log(`Servidor iniciado en el PUERTO: ${envs.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(-1);
});