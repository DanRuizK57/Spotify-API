import path from "path";
import AlbumModel from "../models/album.model.js";
import fs from "fs";
import SongModel from "../models/song.model.js";

async function save(req, res) {
  try {
    // Obtener datos de la petición
    let params = req.body;

    // Crear obj album
    let album = new AlbumModel(params);

    // Guardar en la BBDD
    await album.save();

    return res.status(200).send({
      status: "success",
      album,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function getAlbum(req, res) {
  try {
    // Obtener ID del album
    const albumId = req.params.albumId;

    // Buscar en BBDD
    let album = await AlbumModel.findById(albumId).populate("artist"); // Para obtener el obj completo de album

    if (!album) {
      return res.status(404).send({
        status: "error",
        message: "Álbum no encontrado",
      });
    }

    return res.status(200).send({
      status: "success",
      album,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function list(req, res) {
  try {
    // Obtener ID del artista
    const artistId = req.params.artistId;

    // Buscar álbumes en la BBDD
    const albums = await AlbumModel.find({ artist: artistId }).populate(
      "artist"
    );

    if (!albums) {
      return res.status(404).send({
        status: "error",
        message: "No se encontraron álbumes de este artista",
      });
    }

    return res.status(200).send({
      status: "success",
      albums,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function update(req, res) {
  try {
    // Obtener ID del álbum
    const albumId = req.params.albumId;

    // Obtener datos a cambiar
    const data = req.body;

    // Buscar álbum en la BBDD
    let albumToUpdate = await AlbumModel.findByIdAndUpdate(albumId, data, {
      new: true,
    });

    if (!albumToUpdate) {
      return res.status(404).send({
        status: "error",
        message: "No se encontró el álbum",
      });
    }

    return res.status(200).send({
      status: "success",
      album: albumToUpdate,
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
      message: "La solicitud requiere una imagen!",
    });
  }

  // Conseguir en nombre del archivo
  let image = req.file.originalname;

  // Obtener la extensión del archivo
  const imageSplit = image.split("\.");
  const extension = imageSplit[1];

  // Comprobar la extensión
  if (extension != "png" && extension != "jpg"
    && extension != "jpeg" && extension != "gif") {
      
      const filePath = req.file.path;
      // Borrar archivo
      const fileDeleted = fs.unlinkSync(filePath);

      return res.status(400).send({
        status: "error",
        message: "Extensión del fichero inválida!",
      });

    }

  // Si es correcta, guardar en la BBDD
  const albumUpdated = await AlbumModel.findByIdAndUpdate(req.params.albumId, { image: req.file.filename }, { new: true });

  if (!albumUpdated) {
    return res.status(500).send({ 
      status: "error",
      message: "Ha ocurrido un error en la base de datos" 
    });
  }

  return res.status(200).send({
    status: "success",
    message: "Imagen subida correctamente!",
    album: albumUpdated,
    file: req.file
  });

}

function showImage(req, res) {

  const file = req.params.file;

  const filePath = "./uploads/albums/" + file;
  
  // Comprobar que existe 
  fs.stat(filePath, (error, exists) => {

    if (!exists) {
      return res.status(404).send({
        status: "error",
        message: "No existe la imagen!",
      });
    }

    // Devolver imagen
    return res.sendFile(path.resolve(filePath));

  })

}

async function remove(req, res) {
  try {

    // Obtener ID del album
    const albumId = req.params.albumId;

    const albumRemoved = await AlbumModel.findByIdAndDelete(albumId);

    const songsRemoved = await SongModel.find({ album: albumId });
      await SongModel.findOneAndDelete(songsRemoved);

    if (!albumRemoved) {
        return res.status(500).send({
            status: "error",
            message: "El álbum no se ha podido eliminar",
          });
    }

    return res.status(200).send({
        status: "success",
        albumRemoved,
        songsRemoved
      });

  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

export { save, getAlbum, list, update, upload, showImage, remove };
