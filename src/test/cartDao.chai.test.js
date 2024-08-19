import { expect } from "chai";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import CartDao from "../dao/cartDAO.js";

dotenv.config();

const URI = process.env.URI_TEST;
const cartDao = new CartDao();

describe("Tests Cart DAO", function () {
    this.timeout(10000);

    let cart;
    let productId;

    before(async function () {
      await mongoose.connect(URI);
      await cartModel.deleteMany({});
      await productModel.deleteMany({});
    });

    beforeEach(async function () {
        //Antes de cada test creo un carrito, creo un producto y lo agrego al carrito
        const product = await productModel.create({
            title: "Test Product",
            description: "A product for testing",
            price: 100,
            stock: 10,
            category: "Test Category",
            code: "TP123",
            thumbnails: [],
            owner: "testOwner"
        });
        
        productId = product._id;

        cart = await cartDao.createCart();
        await cartModel.updateOne(
            { _id: cart._id },
            { $push: { products: { productId, quantity: 1 } } }
        );
    });

    afterEach(async function () {
        await cartModel.deleteMany({});
        await productModel.deleteMany({});
    });
  
    after(async function () {
      await mongoose.connection.close();
    });

    describe('createCart', () => {
        it("Should create a new cart with no products", async function () {
            const newCart = await cartDao.createCart();
      
            expect(newCart).to.be.an('object');
            expect(newCart).to.have.property('_id');
            expect(newCart.products).to.be.an('array').that.is.empty;
        });
    });

    describe('getCarts', () => {
        it("Should retrieve all carts", async function () {
            const carts = await cartDao.getCarts();
      
            expect(carts).to.be.an('array');
            expect(carts).to.have.lengthOf(1);
            expect(carts[0]).to.have.property('products').that.is.an('array');
        });
    });

    describe('findCartById', () => {
        it("Should retrieve a cart by its ID with populated products", async function () {
            const foundCart = await cartDao.findCartById(cart._id, true);

            expect(foundCart).to.be.an("object");
            expect(foundCart._id.toString()).to.equal(cart._id.toString());
            expect(foundCart.products).to.be.an("array");
            expect(foundCart.products[0].productId._id.toString()).to.equal(productId.toString());
        });
    });

    describe("deleteCart", function () {
        it("Should delete a cart by its ID", async function () {
            const deleteResult = await cartDao.deleteCart(cart._id);
            expect(deleteResult).to.be.an("object");
            expect(deleteResult.deletedCount).to.equal(1);

            const deletedCart = await cartDao.findCartById(cart._id, false);
            expect(deletedCart).to.be.null;
        });
    });

    describe("deleteProdFromCart", function () {
        it("Should delete a product from the cart", async function () {
            const updatedCart = await cartDao.deleteProdFromCart(cart._id, productId);
            console.log('Updated cart: ', updatedCart);
            expect(updatedCart).to.be.an("object");
            expect(updatedCart.products).to.be.an("array").that.is.empty;
        });
    });
});