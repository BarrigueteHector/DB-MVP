const { auth } = require ("../config");
const jwt = require('jsonwebtoken');

const createAccessToken = (payload) => {
    return jwt.sign(payload, auth.secret_key, {expiresIn: "7d"})
}

module.exports = createAccessToken;