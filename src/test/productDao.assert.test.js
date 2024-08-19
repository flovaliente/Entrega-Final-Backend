import Assert from "assert";
import mongoose from "mongoose";
import * as dotenv from "dotenv";

import productModel from "../dao/models/productModel.js";
import ProductDao from "../dao/productDAO.js";

dotenv.config();

const assert = Assert.strict; //Para que las comparaciones sean más estrictas
const URI = process.env.URI_TEST;
const productDao = new ProductDao()

let prod = {
    title: "Test Product",
    description: "Description",
    code: "123",
    price: 1300,
    stock: 50,
    category: "Category",
    thumbnails: [],
    owner: "owner@gmail.com"
  };

describe("Tests Product DAO", function () {
    this.timeout(10000);

    let product;

    before(async function () {
      await mongoose.connect(URI);
    });

    beforeEach(async function () {
        //Creo un producto antes de cada prueba
        product = await productDao.createProduct(
            prod.title,
            prod.description,
            prod.code,
            prod.price,
            prod.stock,
            prod.category,
            prod.thumbnails,
            prod.owner
        );
    });

    afterEach(async function () {
        //Limpio la coleccion de productos para cada prueba
        await productModel.deleteMany({});
    });

    after(async function () {
      await mongoose.connection.close();
    });
    

    describe('createProduct', () => {
        it("Should create a new product and save it", async function () {
            assert.ok(product, 'Product should not be null');
            assert.strictEqual(typeof product, 'object', 'Product should be of type object');
        });
    });

    describe('getProducts', () => {
        it("Should get all products", async function () {
            const options = { limit: 10, page: 1 };
            const products = await productDao.getProducts({}, options);

            assert.ok(products, 'Products should not be null');
            assert.ok(Array.isArray(products.docs), 'Products should be an array');
            
        });
    });

    describe('findProductById', () => {
        it("Should find a product by its ID", async function () {
            const foundProd = await productDao.findProductById(product._id);

            assert.ok(foundProd, 'Found products should not be null');
            assert.strictEqual(foundProd._id.toString(), product._id.toString(), 'Product IDs should match');
            
        });
    });

    describe('updateProduct', () => {
        it("Should update a product by its ID", async function () {
            const updatedPrice = { price: 1500 };
            await productDao.updateProduct(product._id, updatedPrice);
            const updatedProduct = await productDao.findProductById(product._id);

            assert.strictEqual(updatedProduct.price, 1500, 'Product price should be updated');
        });
    });

    describe('deleteProduct', () => {
        it("Should delete a product by its ID", async function () {
            //Primero chequeo que se haya creado bien el producto
            assert.ok(product, "Product should not be null");

            const result = await productDao.deleteProduct(product._id);

            assert.strictEqual(result.deletedCount, 1, 'If the product was deleted the result should be 1');
        });
    });
});