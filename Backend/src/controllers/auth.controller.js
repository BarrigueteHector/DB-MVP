const bcrypt = require('bcryptjs');
const createAccessToken = require('../libs/jwt.libs')
const pool = require('../db');
const jwt = require('jsonwebtoken');
const { auth } = require('../config');

const register = async (req, res, next) => {
    const {nombre, apellido_p, apellido_m, email, password, telefono} = req.body;

    try {
        const result = await pool.query("SELECT nombre FROM usuarios WHERE email = $1 OR telefono = $2", [email, telefono]);

        if (result.rows.length > 0) 
            return res.status(409).json({ 
                message: 'El correo/telefono ya está asociado a otra cuenta' 
            });

        const pass_hash = await bcrypt.hash(password, 10);

        const newUser = await pool.query("INSERT INTO usuarios (nombre, apellido_p, apellido_m, email, password, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [nombre, apellido_p, apellido_m, email, pass_hash, telefono]);
        
        const userSaved = newUser.rows[0];

        const token = createAccessToken({ id: userSaved.id });
        res.cookie('token', token, {
            httpOnly: true
        });

        return res.json({
            message: 'Usuario creado exitosamente',
            id: userSaved.id,
            nombre: userSaved.nombre,
            email: userSaved.email,
            telefono: userSaved.telefono,
            rol: userSaved.rol
        });
    } catch (error) {
         next(error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) 
            return res.status(400).json({ 
                message: 'Usuario no encontrado' 
            });      
            
        const userFound = result.rows[0];

        const isMatch = await bcrypt.compare(password, userFound.password);

        if (!isMatch)
            return res.status(400).json({
                message: "Contraseña incorrecta"
            });

        const token = await createAccessToken({
            id: userFound.id,
            rol: userFound.rol
        })

        res.cookie('token', token, {
             httpOnly: true
        });

        return res.json({
            message: 'Inició de sesión exitoso',
            id: userFound.id,
            nombre: userFound.nombre,
            email: userFound.email,
            telefono: userFound.telefono,
            rol: userFound.rol
        });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    return res.sendStatus(200);
}

const profile = async (req, res, next) => {
    try {
        const userFound = await pool.query('SELECT nombre, apellido_p, apellido_m, email, telefono, rol FROM usuarios WHERE id = $1', [req.user.id]);

        if (userFound.rows.length === 0)
            return res.status(400).json({
                message: 'Usuario no encontrado'
            });

        const user = userFound.rows[0];
        
        return res.json({
            // id: user.id,
            nombre: user.nombre,
            apellido_p: user.apellido_p,
            apellido_m: user.apellido_m,
            email: user.email,
            telefono: user.telefono,
            rol: user.rol
        })
    } catch (error) {
        next(error);
    }
}

const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if(!token) return res.status(401).json({
        message: 'Acceso denegado'
    });

    jwt.verify(token, auth.secret_key, async (error, user) => {
        if(error) return res.status(401).json({
            message: 'Acceso denegado'
        });
        
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [user.id]);

        if (result.rows.length === 0) 
            return res.status(400).json({ 
                message: 'Usuario no encontrado' 
            });      

        const userFound = result.rows[0];

        return res.json({
            id: userFound.id,
            nombre: userFound.nombre,
            apellido_p: user.apellido_p,
            apellido_m: user.apellido_m,
            email: userFound.email,
            telefono: userFound.telefono,
            rol: userFound.rol
        })
    })
}

module.exports = {
    register,
    login,
    logout,
    profile,
    verifyToken
}