const bcrypt = require('bcryptjs');
const createAccessToken = require('../libs/jwt.libs')
const pool = require('../db');

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
        res.cookie('token', token);

        return res.json({
            message: 'Usuario creado exitosamente',
            id: userSaved.id,
            nombre: userSaved.nombre,
            email: userSaved.email,
            telefono: userSaved.telefono
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
            id: userFound.id
        })

        res.cookie('token', token);

        return res.json({
            message: 'Inició de sesión exitoso',
            id: userFound.id,
            nombre: userFound.nombre,
            email: userFound.email,
            telefono: userFound.telefono
        });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    res.cookie('token', '', {
        expires: new Date(0)
    })

    return res.sendStatus(200);
}

module.exports = {
    register,
    login,
    logout
}