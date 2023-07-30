import path from "path";
import SongModel from "../models/song.model.js";
import fs from "fs";

async function save(req, res) {
    try {
      // Obtener datos de la petición
      let params = req.body;
  
      // Crear obj canción
      let song = new SongModel(params);
  
      // Guardar en la BBDD
      await song.save();
  
      return res.status(200).send({
        status: "success",
        song,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error en la base de datos" });
    }
}

async function getSong(req, res) {

  try {

    let songId = req.params.songId;

    let song = await SongModel.findById(songId).populate("album");

    if (!song) {
      return res.status(404).send({
        status: "error",
        message: "No existe la canción!",
      });
    }

    return res.status(200).send({
      status: "success",
      song,
    });
    
  } catch (err) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error en la base de datos" });
  }

}

async function list(req, res) {

  try {

    const albumId = req.params.albumId;

    let songs = await SongModel.find({ album: albumId })
      .populate( { 
        path: "album",
        populate: {
          path: "artist",
          model: "Artist"
        }
     } ) // Para ver toda la info detalla, popular sobre popular
      .sort("track");

    if (!songs) {
      return res.status(404).send({
        status: "error",
        message: "No existen canciones en este álbum!",
      });
    }

    return res.status(200).send({
      status: "success",
      songs,
    });
    
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }

}

async function update(req, res) {
  try {
    // Obtener ID de la canción
    const songId = req.params.songId;

    // Obtener datos a cambiar
    const data = req.body;

    // Buscar álbum en la BBDD
    let songToUpdate = await SongModel.findByIdAndUpdate(songId, data, {
      new: true,
    });

    if (!songToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró la canción",
      });
    }

    return res.status(200).send({
      status: "success",
      song: songToUpdate,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function remove(req, res) {
  try {

    // Obtener ID de la canción
    const songId = req.params.songId;

    const songRemoved = await SongModel.findByIdAndRemove(songId);

    if (!songRemoved) {
        return res.status(500).send({
            status: "error",
            message: "La canción no se ha podido eliminar",
        });
    }

    return res.status(200).send({
        status: "success",
        song: songRemoved
      });

  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function upload(req, res) {

  // Recoger el fichero de imagen y comprobar que existe
  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "La solicitud requiere una canción!",
    });
  }

  // Conseguir en nombre del archivo
  let song = req.file.originalname;

  // Obtener la extensión del archivo
  const songSplit = song.split("\.");
  const extension = songSplit[1];

  // Comprobar la extensión
  if (extension != "mp3" && extension != "ogg") {
      
      const filePath = req.file.path;
      // Borrar archivo
      const fileDeleted = fs.unlinkSync(filePath);

      return res.status(400).send({
        status: "error",
        message: "Extensión del fichero inválida!",
      });

    }

  // Si es correcta, guardar en la BBDD
  const songUpdated = await SongModel.findByIdAndUpdate(req.params.songId, { file: req.file.filename }, { new: true });

  if (!songUpdated) {
    return res.status(500).send({ 
      status: "error",
      message: "Ha ocurrido un error en la base de datos" 
    });
  }

  return res.status(200).send({
    status: "success",
    message: "Canción subida correctamente!",
    song: songUpdated,
    file: req.file
  });

}

function audio(req, res) {

  const file = req.params.file;

  const filePath = "./uploads/songs/" + file;
  
  // Comprobar que existe 
  fs.stat(filePath, (error, exists) => {

    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la canción!",
      });
    }

    // Devolver imagen
    return res.sendFile(path.resolve(filePath));

  })

}

export { save, getSong, list, update, remove, upload, audio };