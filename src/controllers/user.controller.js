import { validate } from "../helpers/validate.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";

async function register(req, res) {
    try {
      // Obtener datos de la petición
      let params = req.body;
  
      // Comprobar que llegan los datos
      if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).send({ error: "Faltan datos por enviar" });
      }

      // Validación de parámetros
      validate(params);
  
      // Control usuario duplicado
      let existingUsers = await UserModel.find({
        $or: [{ email: params.email.toLowerCase() }, { nick: params.nick }],
      });
  
      if (existingUsers && existingUsers.length >= 1) {
        return res.status(500).send({
          status: "error",
          message: "El usuario ya existe!",
        });
      } else {
        // Cifrar contraseña
        params.password = await bcrypt.hashSync(params.password, 10);
  
        let user = new UserModel(params);
  
        await user.save();

        // Limpiar obj a devolver
        let userStored = user.toObject();
        delete userStored.password;
        delete userStored.role;
  
        return res.status(200).send({
          status: "success",
          message: "El usuario se ha registrado correctamente!",
          userStored,
        });
      }
    } catch (err) {
      return res.status(500).send({ error: "Ha ocurrido un error en la base de datos" });
    }
}

export { register };