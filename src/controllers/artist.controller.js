import ArtistModel from "../models/artist.model.js";

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

export { save, getArtist };
