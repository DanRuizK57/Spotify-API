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

export { save, getSong };