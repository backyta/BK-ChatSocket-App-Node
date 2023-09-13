const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const obtenerChat = require('../controllers/mensajes.controller');

const router = Router();

router.get('/:de', validarJWT, obtenerChat );










module.exports = router;