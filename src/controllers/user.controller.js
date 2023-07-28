import { createToken } from "../helpers/jwt.js";
import { validate } from "../helpers/validate.js";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import fs from "fs";


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

async function login(req, res) {
    try {
      // Recoger parámetros body
      let params = req.body;
  
      if (!params.email || !params.password) {
        return res.status(400).send({
          status: "error",
          message: "Faltan datos por enviar",
        });
      }
  
      // Buscar en la BBDD
      const user = await UserModel.findOne({ email: params.email })
        .select("+password +role");
  
      if (!user) {
        return res.status(400).send({
          status: "error",
          message: "El usuario no está registrado",
        });
      }
  
      // Comprobar su contraseña
      let isSamePassword = bcrypt.compareSync(params.password, user.password);
  
      if (!isSamePassword) {
        return res.status(400).send({
          status: "error",
          message: "Las contraseñas no coinciden!",
        });
      }

      // Limpiar usuario
      let identityUser = user.toObject();
      delete identityUser.password;
      delete identityUser.role;
  
      // Conseguir token
      const token = createToken(user);
  
      return res.status(200).send({
        status: "success",
        message: "El usuario se ha logueado correctamente!",
        user: identityUser,
        token
      });
    } catch (err) {
      return res.status(500).send({ error: "Ha ocurrido un error en la base de datos" });
    }
}

async function profile(req, res) {

    try {
      
        // Recibir el parámetro del ID del usuario por URL
        const userId = req.params.userId;
    
        // Consulta para obtener datos del usuario
        const user = await UserModel.findById(userId)
                    .select({ password: 0, role: 0 }); // Para no entregar datos sensibles
    
        if (!user) {
        return res.status(400).send({
            status: "error",
            message: "El usuario no existe",
        });
        }
    
        return res.status(200).send({
        status: "success",
        user: user
        });
  
    } catch (err) {
      return res.status(500).send({ error: "Ha ocurrido un error en la base de datos" });
    }
  
}

async function update(req, res) {

try {
      
    // Recoger datos usuario identificado
    const userIdentity = req.user;

    // Recoger info del usuario a actualizar
    const userToUpdate = req.body;

    // Validar datos nuevos
    validate(userToUpdate);
  
    // Eliminar campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;
  
    // Comprobar si el usuario existe
    let existingUsers = await UserModel.find({
      $or: [
        { email: userToUpdate.email.toLowerCase() },
        { nick: userToUpdate.nick }
      ],
    });
  
    let userIsset = false;
  
    existingUsers.forEach(user => {
      if (user && user._id != userIdentity.id) {
        userIsset = true;
      }
    })
  
    if (userIsset) {
      return res.status(404).send({
        status: "error",
        message: "Sólo puedes editar tu propio perfil!",
      });
    }
  
    if (userToUpdate.password) {
      // Cifrar contraseña
      userToUpdate.password = await bcrypt.hashSync(userToUpdate.password, 10);
    } else {
      delete userToUpdate.password; // Para q no sobre-escriba en la BBDD
    }
  
    // Buscar y actualizar 
    let userUpdated = await UserModel.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
  
    if (!userUpdated) {
      return res.status(500).send({ error: "Ha ocurrido un error al actualizar" });
    }
  
    return res.status(200).send({
      status: "success",
      message: "El usuario se ha actualizado correctamente!",
      userUpdated,
    });
  
  
} catch (err) {
    return res.status(500).send({ error: "Ha ocurrido un error en la base de datos" });
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
    const userUpdated = await UserModel.findByIdAndUpdate(req.user.id, { image: req.file.filename }, { new: true });
  
    if (!userUpdated) {
      return res.status(500).send({ 
        status: "error",
        message: "Ha ocurrido un error en la base de datos" 
      });
    }
  
    return res.status(200).send({
      status: "success",
      message: "Imagen subida correctamente!",
      user: userUpdated,
      file: req.file
    });
  
  
  }

export { register, login, profile, update, upload };