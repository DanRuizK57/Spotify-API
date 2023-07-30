import AlbumModel from "../models/album.model.js";

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
            album
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
        album
      });
    } catch (err) {
      return res
        .status(500)
        .send({ error: "Ha ocurrido un error en la base de datos" });
    }
  }

export { save, getAlbum };