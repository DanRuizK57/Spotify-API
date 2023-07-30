import SongModel from "../models/song.model.js";

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

export { save, getSong, list, update };