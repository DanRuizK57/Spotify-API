import ArtistModel from "../models/artist.model.js";
import pagination from "mongoose-pagination";
import fs from "fs";
import path from "path";

async function save(req, res) {
  try {
    // Obtener datos del body
    let params = req.body;

    // Crear obj a guardar
    let artist = new ArtistModel(params);

    // Guardar en la BBDD
    await artist.save();

    return res.status(200).send({
      status: "success",
      artist: artist,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function getArtist(req, res) {
  try {
    // Obtener ID de artista
    const artistId = req.params.artistId;

    // Buscar en BBDD
    let artist = await ArtistModel.findById(artistId);

    if (!artist) {
      return res.status(500).send({
        status: "error",
        message: "Artista no encontrado",
      });
    }

    return res.status(200).send({
      status: "success",
      artist: artist,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function list(req, res) {
  try {
    // Controlar en que página estamos
    let page = 1;

    if (req.params.page) {
      page = parseInt(req.params.page);
    }

    // Consulta con mongoose paginate
    let itemsPerPage = 2;

    const artists = await ArtistModel.find()
      .sort("name")
      .paginate(page, itemsPerPage);

    if (!artists) {
      return res.status(404).send({
        status: "error",
        message: "No hay artistas disponibles",
      });
    }

    const totalArtists = await ArtistModel.countDocuments({}).exec();

    return res.status(200).send({
      status: "success",
      artists,
      page,
      itemsPerPage,
      totalArtists,
      pages: Math.ceil(totalArtists / itemsPerPage),
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function update(req, res) {
  try {
    // Obtener ID del artista
    const artistId = req.params.artistId;

    // Obtener datos body
    const data = req.body;

    // Buscar y actualizar artista
    let artistUpdated = await ArtistModel.findByIdAndUpdate(artistId, data, {
      new: true,
    });

    if (!artistUpdated) {
      return res.status(500).send({
        status: "error",
        message: "El artista no se ha podido actualizar",
      });
    }

    return res.status(200).send({
      status: "success",
      artist: artistUpdated,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Ha ocurrido un error en la base de datos" });
  }
}

async function remove(req, res) {
  try {

    // Obtener ID del artista
    const artistId = req.params.artistId;

    const artistRemoved = await ArtistModel.findByIdAndDelete(artistId);
    // eliminar albums 
    // eliminar canciones

    if (!artistRemoved) {
        return res.status(500).send({
            status: "error",
            message: "El artista no se ha podido eliminar",
          });
    }

    return res.status(200).send({
        status: "success",
        artistRemoved,
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
    const artistUpdated = await ArtistModel.findByIdAndUpdate(req.params.artistId, { image: req.file.filename }, { new: true });
  
    if (!artistUpdated) {
      return res.status(500).send({ 
        status: "error",
        message: "Ha ocurrido un error en la base de datos" 
      });
    }
  
    return res.status(200).send({
      status: "success",
      message: "Imagen subida correctamente!",
      artist: artistUpdated,
      file: req.file
    });
  
  
}

function showImage(req, res) {
  
    const file = req.params.file;
  
    const filePath = "./uploads/artists/" + file;
    
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

export { save, getArtist, list, update, remove, upload, showImage };
