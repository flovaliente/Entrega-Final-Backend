import productModel from "./models/productModel.js";

export default class ProductDao{
    createProduct = async (title, description, code, price, stock, category, thumbnails, owner) =>{
        try {
            return await productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [], owner });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getProducts = async (criteria, options) =>{
        try {
            return await productModel.paginate(criteria, options);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findProductById = async (pid) =>{
        try {
            return await productModel.findOne({ _id: pid });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateProduct = async (pid, updatedProduct) =>{
        try {
            return await productModel.updateOne({ _id: pid }, updatedProduct)
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    deleteProduct = async (pid) =>{
        try {
            return await productModel.deleteOne({ _id: pid });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
}