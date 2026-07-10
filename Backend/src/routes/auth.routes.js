const { Router } = require('express');
const { authRequired } = require('../middlewares/validateToken.middlewares')
const { register, login, logout, profile, verifyToken } = require('../controllers/auth.controller')

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authRequired, profile);
router.get('/verify', verifyToken);

module.exports = router;