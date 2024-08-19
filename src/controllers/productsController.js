import productService from '../services/productService.js';
import userService from '../services/userService.js';
import { checkOwnership } from '../utils/functionsUtils.js';

const buildResponse = (data) => { 
    return {
        status: 'success',
        //payload: data.docs.map( (product) => product),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.nextPage,
        prevLink: data.hasPrevPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ""}${data.stock ? `&stock=${data.stock}` : ""}` : "",
        nextLink: data.hasNextPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ""}${data.stock ? `&stock=${data.stock}` : ""}` : ""
    };
};

const getAllProducts = async (req, res) =>{
    try {
        const { page = 1, limit = 10, category, query, sort } = req.query;
        
        let products = await productService.getProducts(page, limit, category, query, sort);
        req.logger.info("Aca los productos: ", products);

        res.send({
            status: "success",
            payload: products,
          });

    } catch (error) {
        req.logger.warning('Cannot get products.')
        res.status(500).send('Internal server error.');
    }
    
}

const getProductById = async (req, res) =>{ 
    try {
        const { pid } = req.params;
        const product = await productService.getProductById(pid);
        
        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send({
                status: 'error',
                message: `Product ${pid} not found.`
            });
        }
    } catch (error) {
        req.logger.warning('Cannot get product.')
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const addProduct = async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try {
        let owner;
        if (req.user.user.role == "Premium"){
            owner = req.user.user.email; 
        }else{
            owner = "Admin";
        }
        req.body.owner = owner;

        const result = await productService.addProduct(req.body);
        
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning('Cannot add product.')
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const updateProduct = async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try{
        const { pid } = req.params;
        const updated = await productService.updateProduct(pid, req.body);
        res.status(200).send({
            status: 'success',
            payload: updated
        });
    } catch(error){
        req.logger.warning('Cannot update product.')
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try{
        const { pid } = req.params;
        const email = req.user.user.email;
        let deleteProdPermission = true;

        const product = await productService.getProductById(pid);
        const owner = product.owner;

        //Si el user es Premium, me fijo si es creador del producto
        if (req.user.user.role === "Premium") {
            deleteProdPermission = await checkOwnership(pid, email);
        }

        if(deleteProdPermission){
            if(owner != "Admin"){
                await userService.sendDeletionEmail(owner, pid);
            }

            await productService.deleteProduct(pid);
            res.status(200).send({
                status: 'Product successfully deleted.'
            });
            req.logger.info('Product successfully deleted.');
        }else{
            req.logger.warning('Permission denied.')
            return res.status(403).send({
                status: "error",
                message: "You dont have permission to delete this product.",
            });
        }
        
    }catch (error){
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
}


export default {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};