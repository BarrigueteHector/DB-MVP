const { Router } = require('express');
const { listaEventos, infoEvento, comprarBoleto, misBoletos } = require('../controllers/boletera.controller')
const authRequired = require('../middlewares/validateToken.middlewares')

const router = Router();

router.get('/lista_eventos', listaEventos);
router.get('/info_evento/:id', infoEvento);
router.post('/compra_boleto/:id', authRequired, comprarBoleto);
router.get('/mis_boletos', authRequired, misBoletos)

module.exports = router;