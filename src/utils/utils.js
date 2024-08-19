import jwt from 'jsonwebtoken';

const PRIVATE_KEY = "secretKey";

const generateToken = (user) =>{
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '1h' });
    return token;
};

const authToken = (req, res, next) =>{
    const authHeader = req.headers.authorization; //Token viene desde los headers

    if(!authHeader){ // si no hay header es porque no hay token, o sea no esta autenticado
        return res.status(401).send({
            error: "Not authenticated"
        });
    };

    const token = authHeader.split(' ')[1]; // el split es para sacar la palabra Bearer
    jwt.verify(token, PRIVATE_KEY, (error, credentials) =>{
        if(error){
            return res.status(403).send({
                error: "Unauthorized"
            });
        };
        req.user = credentials.user;
        next();
    })
}

export { generateToken, authToken };