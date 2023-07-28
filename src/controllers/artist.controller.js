import ArtistModel from "../models/artist.model.js";
import pagination from "mongoose-pagination";

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

    // Obtener ID del artista
    const artistId = req.params.artistId;

    // Obtener datos body
    const data = req.body;

    // Buscar y actualizar artista
    let artistUpdated = await ArtistModel.findByIdAndUpdate(artistId, data, { new: true });

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

}

export { save, getArtist, list, update };
