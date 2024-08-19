import { Router } from 'express';
import passport from 'passport';

import { uploader } from '../utils/multerUtil.js';
import productsController from '../controllers/productsController.js';
import { authorization } from '../middlewares/auth.js';

const productsRouter = Router();

// -Get products-
productsRouter.get('/', productsController.getAllProducts);

// -Get product by id-
productsRouter.get('/:pid', productsController.getProductById);

// -Add product
productsRouter.post('/', uploader.array('thumbnails', 3), passport.authenticate("jwt", { session: false }), authorization(['Admin', 'Premium']), productsController.addProduct);

// -Update product
productsRouter.put('/:pid', uploader.array('thumbnails', 3), passport.authenticate("jwt", { session: false }), authorization('Admin'), productsController.updateProduct);

// -Delete product
productsRouter.delete('/:pid', passport.authenticate("jwt", { session: false }), authorization(['Admin', 'Premium']), productsController.deleteProduct);

export default productsRouter;