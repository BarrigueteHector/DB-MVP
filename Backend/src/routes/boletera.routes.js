const { Router } = require('express');
const { listaEventos, infoEvento, comprarBoleto, misBoletos, confirmarCompraB, validarBoleto } = require('../controllers/boletera.controller')
const { authRequired, staffRequired } = require('../middlewares/validateToken.middlewares')

const router = Router();

router.get('/lista_eventos', listaEventos);
router.get('/info_evento/:id', infoEvento);
router.post('/compra_boleto/:id', authRequired, comprarBoleto);
router.get('/mis_boletos', authRequired, misBoletos);
router.get('/confirmar_compra/:id', authRequired, confirmarCompraB );
router.get('/validar_boleto/:contenido_qr', authRequired, staffRequired, validarBoleto);

module.exports = router;