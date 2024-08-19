import Assert from "assert";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import CartDao from "../dao/cartDAO.js";

dotenv.config();

const assert = Assert.strict; //Para que las comparaciones sean más estrictas
const URI = process.env.URI_TEST;
const cartDao = new CartDao();


describe("Tests Cart DAO", function () {
    this.timeout(10000);

    before(async function () {
      await mongoose.connect(URI);
      await cartModel.deleteMany({});
      await productModel.deleteMany({});
    });
  
    after(async function () {
      await mongoose.connection.close();
    });
    describe('createCart', () => {
        it("Should create a new cart with no products", async function () {
            const cart = await cartDao.createCart();
      
            assert.deepStrictEqual(cart.products, [], 'Cart products array should be an empty array');
            assert.ok(cart._id, 'Cart should have an _id property'); 
        });
    });

    describe('updateQuantityCart', () => {
        it("Should update product quantity in the cart", async function () {
            const cart = await cartDao.createCart();
            const productId = new mongoose.Types.ObjectId();

            await cartModel.updateOne({ _id: cart._id }, { $push: { products: { productId, quantity: 1 } } });
            const result = await cartDao.updateQuantityCart(cart._id, productId, 3);

            assert.deepStrictEqual(result.products[0].quantity, 3, 'Quantity should be updated to 3');
        });
    });

    describe('findCartById', () => {
        it("Should find a cart by ID", async function () {
            const cart = await cartDao.createCart();
            const cartFound = await cartDao.findCartById(cart._id, true);

            assert.ok(cartFound, 'Found cart should not be null'); 
            assert.strictEqual(cart._id.toString(), cartFound._id.toString(), 'IDs should be the same');
        });
    });

    describe('deleteProdFromCart', () => {
        it("Should delete a product from cart by its ID", async function () {
            const cart = await cartDao.createCart();
            //Simulo creacion de dos productos
            const productId = new mongoose.Types.ObjectId();
            const secondProdId = new mongoose.Types.ObjectId();
            //Agrego productos al carrito
            await cartModel.updateOne({ _id: cart._id }, { $push: { products: { productId, quantity: 2 } } });
            await cartModel.updateOne({ _id: cart._id }, { $push: { products: { productId: secondProdId, quantity: 1 } } });

            //Borro el primer producto y obtengo carrito actualizado
            const updatedCart = await cartDao.deleteProdFromCart(cart._id, productId);

            //Verifico que el primer producto se haya eliminado
            const firstProductExists = updatedCart.products.some(p => p.productId.toString() === productId.toString());
            assert.strictEqual(firstProductExists, false, 'First product should be deleted from the cart');

            //Verifico que el segundo producto aun siga en el carrito
            const secondProductExists = updatedCart.products.some(p => p.productId.toString() === secondProdId.toString());
            assert.strictEqual(secondProductExists, true, 'Second product should still be in the cart');
        });
    });
});