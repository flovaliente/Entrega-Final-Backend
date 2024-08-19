//import productModel from '../models/productModel.js'
import CustomError from "../../services/errors/CustomError.js";
import { generateProductsErrorInfo } from "../../services/errors/info.js";
import { ErrorCodes } from "../../services/errors/enums.js";
import ProductDao from "../productDAO.js";

class ProductRepository {
    constructor(){
        this.productDao = new ProductDao();
    }
    
    async addProduct(product){
        const { title, description, code, price, stock, category, thumbnails, owner } = product;
        try {
            if(!title || !description || !code || !price || !stock || ! category){
                const errorInfo = generateProductsErrorInfo(product);
                console.log(errorInfo);
                return CustomError.createError({
                    name: "Add product error",
                    cause: errorInfo,
                    message: "Error trying to create product.",
                    code: ErrorCodes.INVALID_TYPES_ERROR
                })
            }
            const result = await this.productDao.createProduct(title, description, code, price, stock, category, thumbnails, owner);
            //console.log(result);
            console.log(`Product created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating product.`);
        }
    }

    async getProducts(criteria, options){
        try {
            return await this.productDao.getProducts(criteria, options);
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find products.`);
        }
    }

    async getProductById(pid){
        try {
            const product = await this.productDao.findProductById(pid);

            if (!product)
                throw new Error(`Product with id: ${pid} do not exist.`);

            return product;
        } catch (error) {
            throw new Error(error.message);
        }
        
    }

    async updateProduct(pid, updatedProduct){
        try {
            const result = await this.productDao.updateProduct(pid, updatedProduct);
            console.log(`Product with id: ${pid} updated successfully ♻️`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error updating product.`);
        }
    }

    async deleteProduct(pid){
        try {
            const result = await this.productDao.deleteProduct(pid);

            if(result.deletedCount === 0){
                throw new Error(`Product with id: ${pid} do not exist.`);
            }else{
              console.log(`Product with id: ${pid} deleted successfully.`);  
            }

            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error deleting product ${pid}.`);
        }
    }
}

export default ProductRepository;