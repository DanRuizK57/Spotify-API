import jwt from "jwt-simple";
import moment from "moment";
import envs from '../configs/environments.js';

export function createToken(user) {

    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), // Fecha de creación del payload en formato unix (ilegible)
        exp: moment().add(30, "days").unix() // Fecha de expiración
    };

    // Devolver jwt token codificado
    return jwt.encode(payload, envs.SECRET_KEY);

}

