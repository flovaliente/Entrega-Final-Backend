import { Router } from 'express';
import passport from 'passport';

import { authorization } from '../middlewares/auth.js';
import indexController from '../controllers/indexController.js';

const router = Router();

router.get('/', indexController.welcome);

router.get('/register', indexController.register);

router.get('/products', passport.authenticate('jwt', { session: false }), indexController.products);

router.get('/cart', passport.authenticate('jwt', { session: false }), indexController.cart);

//Ruta para elegir envio
router.get('/envio', passport.authenticate('jwt', { session: false }), indexController.datosEnvio);

//Ruta para elegir forma de pago
router.get('/pago', passport.authenticate('jwt', { session: false }), indexController.formaDePago);

router.get('/realtimeproducts', indexController.realtimeproducts);

router.get('/login', indexController.login);

router.get('/user', passport.authenticate('jwt', { session: false }), indexController.user);

router.get('/mockingproducts', indexController.mockingproducts);

router.get('/loggertest', indexController.loggertest);

router.get('/unauthorized', indexController.unauthorized);

//Send email
router.get("/send/mail", indexController.sendEmail);

//Recover password request
router.get('/recover', indexController.recoverPasswordRequest);

//Recover password
router.post('/recover', indexController.recoverPassword);

router.get('/recover/:token', indexController.recoverToken);

router.post('/changePassword', indexController.changePassword);

router.get('/adminPanel', passport.authenticate('jwt', { session: false }), authorization(['Admin']), indexController.adminPanel);

export default router;