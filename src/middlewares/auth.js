import jwt from "jwt-simple";
import moment from "moment";
import envs from '../configs/environments.js';

// Middleware de autenticación
export function auth(req, res, next) {

    // Comprobar si llega la cabecera de auth
    if (!req.headers.authorization) {
        return res.status(403).json({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación",
          });
    }

    // Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, '');

    // Decodificar el token
    try {

        let payload = jwt.decode(token, envs.SECRET_KEY);

        // Comprobar expiración del token
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ 
                status: "error", 
                message: "Token expirado"
            });
        }

        // Agregar datos del usuario a la request
        // Cada vez que se quiera obtener al usuario de la sesión se usa req.user
        req.user = payload;
        
    } catch (err) {
        return res.status(404).send({ 
            status: "error", 
            message: "Token inválido"
        });
    }

    // Pasar a ejecución de acción
    next();

}