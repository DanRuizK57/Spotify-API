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

export { save };