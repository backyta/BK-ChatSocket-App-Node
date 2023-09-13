/* 
    path: api/login
*/
const { Router } = require('express');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


// Midlewares perzonalizados 

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(), // establece en la req un objeto de todos los errores que captura 
    check('password', 'El password es obligaotio').not().isEmpty(),
    validarCampos // le pasa el req, res, y el next que se pasa consecutivamente.
],loginUsuario )


router.post('/new', [
    check('nombre','El nombre es obligatorio y debe ser string').not().isEmpty().isString(),
    check('email', 'El email es obligatorio').isEmail(), 
    check('password', 'El password es obligaotio').not().isEmpty(),
    validarCampos
],crearUsuario)


router.get('/renew', validarJWT ,renewToken )







module.exports = router;
