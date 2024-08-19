import ProductRepository from "../dao/repositories/ProductRepository.js";

const productManager = new ProductRepository();

const getProducts = async (page, limit, category, query, sort) =>{
    try {
        const options = { page, limit, sort: { price: sort || "asc"}, lean: true };
        const criteria = {};

        if(category){
            criteria.category = category;
        }

        if(query){
            //query = JSON.parse(query);
            criteria.query = query;
            console.log(criteria);
        }

        return await productManager.getProducts(criteria, options);

        } catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
}

const getProductById = async (pid) =>{
    try {
        return await productManager.getProductById(pid);  
    } catch (error) {
        throw new Error(error.message);
    }
}

const addProduct = async (product) =>{
    try {
        return await productManager.addProduct(product);
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateProduct = async (pid, updatedProduct) =>{
    try {
        return await productManager.updateProduct(pid, updatedProduct);
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteProduct = async (pid) =>{
    try {
        return await productManager.deleteProduct(pid);
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};