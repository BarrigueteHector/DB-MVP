const pool = require('../db');

const listaEventos = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT artista, lugar, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha FROM eventoabc1");
        
        res.json(result.rows)
    } catch (error) {
         next(error);
    }
}

const infoEvento = async (req, res, next) => {
    try {
        const { id } = req.params;
        // const result = await pool.query('SELECT artista, lugar, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, hora_inicio FROM eventoabc1 WHERE id = $1', [id]);
        const result = await pool.query('SELECT artista, boletos FROM eventoabc1 WHERE id = $1', [id]);


        if (result.rows.length === 0) 
            return res.status(404).json({ 
                message: 'Task not found' 
            });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

const comprarBoleto = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const usuario_id = req.user.id

        // Inicio de la transacción (evitamos la concurrencia)
        await client.query('BEGIN');
        
        const eventoCheck = await client.query('SELECT boletos FROM eventoabc1 WHERE id = $1 FOR UPDATE', [id]);
        
        if (eventoCheck.rows.length === 0){
            await client.query('ROLLBACK');
            return res.status(404).json({  
                message: 'Evento no encontrado'
            });
        }

        if (eventoCheck.rows[0].boletos <= 0){
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                message: 'No hay boletos'
            });
        }

        const result = await client.query('UPDATE eventoabc1 SET boletos = boletos - 1 WHERE id = $1 AND boletos > 0 RETURNING *', [id]);

        await client.query('INSERT INTO compras (usuario_id, evento_id) VALUES ($1, $2)', [usuario_id, id]);

        await client.query('COMMIT');

        return res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}

const misBoletos = async(req, res, next) => {
    const client = await pool.connect();

    try {
        // const usuario_id = req.user.id;

        const result = await client.query('SELECT * FROM compras');
        // const result = await client.query('SELECT * FROM compras JOIN eventoabc1 ON compras.evento_id = eventoabc1.id WHERE compras.usuario_id = 1', [usuario_id]);

        if (result.rows.length === 0){
            return res.status(404).json({  
                message: 'No has comprado boletos'
            });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.log("a")
        next(error);
    }
}

module.exports = {
    listaEventos,
    infoEvento,
    comprarBoleto,
    misBoletos
}