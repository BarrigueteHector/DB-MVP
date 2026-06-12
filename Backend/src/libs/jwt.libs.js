const { auth } = require ("../config");
const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload, auth.secret_key, {expiresIn: "1d"})
}

module.exports = createAccessToken;