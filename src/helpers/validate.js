import validator from "validator";

function validate(params) {

    let resultado = false;

    let name = !validator.isEmpty(params.name) 
        && validator.isLength(params.name, { min: 3, max: undefined })
        && validator.isAlpha(params.name, "es-ES");

    let nick = !validator.isEmpty(params.nick) 
        && validator.isLength(params.nick, { min: 2, max: 60 });

    let email = !validator.isEmpty(params.email) 
        && validator.isEmail(params.email);

    let password = !validator.isEmpty(params.email);


    if (params.surname) {

        let surname = !validator.isEmpty(params.surname) 
            && validator.isLength(params.surname, { min: 3, max: undefined })
            && validator.isAlpha(params.surname, "es-ES");

        if (!surname) {
            throw new Error("Apellido inválido");
        }

    }

    if (!name || !nick || !email || !password) {
        throw new Error("No se ha superado la validación");
    } else {
        console.log("Validación superada");
        resultado = true;
    }

    return resultado;

}

export { validate };