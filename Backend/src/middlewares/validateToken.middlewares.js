const jwt = require('jsonwebtoken');
const { auth } = require('../config');

const authRequired = (req, res, next) => {
    const { token } = req.cookies;

    if(!token)
        return res.status(401).json({
            message: 'No token, authorization denied'
        });    

    jwt.verify(token, auth.secret_key, (error, user) => {
        if (error)
            return res.status(403).json({
                message: 'Invalid token'
            });
        
        req.user = user

        next();
    })
}

const staffRequired = (req, res, next) => {
    if(req.user.rol !== 'staff')
        return res.status(403).json({
            message: 'Acceso denegado'
        })
    
    next();
}

module.exports = {
    authRequired, 
    staffRequired
};