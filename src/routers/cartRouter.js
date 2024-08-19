import { Router } from 'express';

import passport from 'passport';
import { passportCall } from '../utils/authUtil.js';
import cartController from '../controllers/cartController.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();

// -Create carts
router.post('/', cartController.createCart);

// -Get carts
router.get('/', cartController.getCarts);

// -Get cart by id
router.get('/:cid', cartController.getCartById);

// -Actualizar el quantity
router.put('/:cid/product/:pid', cartController.updateQuantityCart);

// -Add product to cart
router.post('/:cid/product/:pid', passport.authenticate("jwt", { session: false }), authorization(['User', 'Premium']), cartController.addToCart);

// -Delete cart
router.delete('/:cid', cartController.deleteCart);

// Delete product from cart
router.delete('/:cid/product/:pid', cartController.deleteProdFromCart);

// Purchase cart
router.post('/:cid/purchase', passport.authenticate("jwt", { session: false }), cartController.purchaseCart);

export default router;