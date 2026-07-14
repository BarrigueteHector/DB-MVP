const pool = require('../db');

const listaEventos = async (req, res, next) => {
    try {
        const result = await pool.query("SELECT eventoabc1.id, eventoabc1.artista, eventoabc1.lugar, TO_CHAR(eventoabc1.fecha, 'YYYY-MM-DD') AS fecha, TO_CHAR(eventoabc1.hora_inicio, 'HH24:MI') AS hora_inicio, SUM(tipos_boleto.boletos_disponibles)::INTEGER AS total_boletos FROM eventoabc1 LEFT JOIN tipos_boleto ON tipos_boleto.evento_id = eventoabc1.id GROUP BY eventoabc1.id ORDER BY fecha");

        if (result.rows.length === 0) 
            return res.status(404).json({ 
                message: 'Events not found' 
            });

        res.json(result.rows)
    } catch (error) {
        next(error);
    }
}

const infoEvento = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const event = await pool.query("SELECT id, artista, lugar, TO_CHAR(fecha, 'YYYY-MM-DD') AS fecha, TO_CHAR(hora_inicio, 'HH24:MI') AS hora_inicio FROM eventoabc1 WHERE id = $1", [id]);

        if (event.rows.length === 0)   
            return res.status(404).json({ 
                message: 'Event not found' 
            });

        const tiposBoleto = await pool.query("SELECT id, tipo, precio, boletos_disponibles FROM tipos_boleto WHERE evento_id = $1 ORDER BY precio", [id]);

        // res.json(result.rows[0])

        return res.json({
            ...event.rows[0],
            tipos_boleto: tiposBoleto.rows
        })
    } catch (error) {
        next(error);
    }
}

const comprarBoleto = async (req, res, next) => {
    try {
        const result = await procesarCompra(req.params.tipo_boleto_id, req.user.id, req.params.evento_id);
        res.json(reesult)
    } catch (error) {
        next(error)
    }
}

const procesarCompra = async(tipo_boleto_id, usuario_id, evento_id) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const tipoCheck = await client.query('SELECT evento_id, boletos_disponibles FROM tipos_boleto WHERE id = $1 FOR UPDATE', [tipo_boleto_id]);

        if(tipoCheck.rows.length === 0){
            await client.query('ROLLBACK');
            throw new Error('Ticket type not found');
        }

        if(tipoCheck.rows[0].boletos_disponibles <= 0){
            await client.query('ROLLBACK');
            throw new Error('No tickets available');
        }

        // Evita la compra de más boletos
        // const compra = await client.query('SELECT id FROM compras WHERE usuario_id = $1 AND evento_id = $2', [usuario_id, evento_id]);

        // if(compra.rows.length > 0){
        //     await client.query('ROLLBACK');
        //     throw new Error('You already bought a ticket for this event');
        // }
        
        const result = await client.query('UPDATE tipos_boleto SET boletos_disponibles = boletos_disponibles - 1 WHERE id = $1 AND boletos_disponibles >= 0 RETURNING *', [tipo_boleto_id]);

        const { v4: uuidv4 } = require('uuid');
        const contenido_qr = uuidv4();

        await client.query('INSERT INTO compras (usuario_id, evento_id, tipo_boleto_id, contenido_qr) VALUES ($1, $2, $3, $4)', [usuario_id, evento_id, tipo_boleto_id, contenido_qr]);

        await client.query('COMMIT');
        
        return result.rows[0];
    } catch (error) {
        console.log("Error procesar compra: ", error.message);
        await client.query('ROLLBACK');
        throw error
    } finally {
        client.release();
    }
}

const misBoletos = async(req, res, next) => {
    const client = await pool.connect();

    try {
        const usuario_id = req.user.id;

        const result = await client.query("SELECT eventoabc1.artista, eventoabc1.lugar, TO_CHAR(eventoabc1.hora_inicio, 'HH24:MI') AS hora_inicio, TO_CHAR(eventoabc1.fecha, 'YYYY-MM-DD') AS fecha, compras.seccion, compras.asiento, tipos_boleto.tipo, compras.contenido_qr FROM compras JOIN eventoabc1 ON compras.evento_id = eventoabc1.id JOIN tipos_boleto ON tipos_boleto.id = compras.tipo_boleto_id WHERE compras.usuario_id = $1 ORDER BY eventoabc1.fecha", [usuario_id]);
        
        if (result.rows.length === 0){
            return res.status(404).json({  
                message: 'No has comprado boletos'
            });
        }

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

const confirmarCompraB = async(req, res, next) => {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const result = await pool.query("SELECT id FROM compras WHERE usuario_id = $1 AND evento_id = $2", [usuario_id, id]);

    if (result.rows.length === 0){
        console.log("Compra no realizada");
    } else {
        console.log("Compra realizada");
    }

    res.json({
        compraExitosa: result.rows.length > 0
    });
}

const validarBoleto = async(req, res, next) => {
    const { contenido_qr } = req.params;

    const result = await pool.query("SELECT compras.id, eventoabc1.artista, eventoabc1.fecha, usuarios.nombre, tipos_boleto.tipo FROM compras JOIN eventoabc1 ON compras.evento_id = eventoabc1.id JOIN usuarios ON compras.usuario_id = usuarios.id JOIN tipos_boleto ON compras.tipo_boleto_id = tipos_boleto.id WHERE compras.contenido_qr = $1", [contenido_qr]);

    if (result.rows.length === 0){
        return res.json({
            valido: false,
            message: 'Boleto no encontrado'
        })
    }

    res.json({
        valido: true,
        boleto: result.rows[0]
    });
}

module.exports = {
    listaEventos,
    infoEvento,
    comprarBoleto,
    procesarCompra,
    misBoletos,
    confirmarCompraB,
    validarBoleto
}