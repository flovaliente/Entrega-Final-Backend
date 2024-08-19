import { Router } from 'express';
import passport from 'passport';

import { uploader } from '../utils/multerUtil.js';
import userController from '../controllers/userController.js';
//import { passportCall } from '../utils/authUtil.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();
//Obtengo todos los usuarios
router.get('/', userController.getUsers);

//Registro usuario
router.post('/register', userController.register);

router.get('/failRegister', userController.failRegister);

//Login usuario
router.post("/login", userController.login);

router.get('/failLogin', userController.failLogin);

//Logout usuario
router.get('/logout', passport.authenticate("jwt", { session: false }), userController.logout);

//Login con github
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }), userController.github);

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), userController.githubcallback);

//Obtengo el usuario (token) extraido de la cookie
router.get('/current', passport.authenticate("jwt", { session: false }), authorization('User'), userController.current);

//Cambio rol de Premium a User y viceversa
router.put('/premium/:uid', passport.authenticate("jwt", { session: false }), authorization(['Admin']), userController.switchRole);

//Subir documentos
router.post('/:uid/documents', uploader.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "productImage", maxCount: 1 },
    { name: "idDocument", maxCount: 1 },
    { name: "addressDocument", maxCount: 1 },
    { name: "accountStatementDocument", maxCount: 1 },
  ]),
  userController.uploadDocuments);

router.put('/updateaddress/:uid', passport.authenticate("jwt", { session: false }), userController.updateAddress);

router.delete('/', userController.deleteInactiveUsers);


export default router;