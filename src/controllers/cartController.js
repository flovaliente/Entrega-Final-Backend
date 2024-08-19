import cartService from '../services/cartService.js';
import userService from '../services/userService.js';
import productService from '../services/productService.js';
import ticketService from '../services/ticketService.js';
import { checkOwnership } from '../utils/functionsUtils.js';

const createCart = async (req, res) => {
    try{
        const carts = await cartService.createCart();
        res.status(200).send({
            status: 'success',
            payload: carts
        });
    }catch (error){
        req.logger.warning('Cannot create cart.')
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.status(200).send({
            status: 'success',
            payload: carts
        });  
    } catch (error) {
        res.status(404).send({ 
            status: 'error',
            message: error.message
        });
    }
    
}

const getCartById = async (req, res) => {
    try{
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        console.log(cart.products);
        res.status(200).send(cart);
    }catch (error){
        req.logger.warning('Cannot get cart.')
        res.status(error.statusCode || 500).send({
            status: 'error',
            message: error.message
        });
    }
}

const updateQuantityCart = async (req, res) =>{
    try {
        const { cid, pid } = req.params;
        const quantity = req.body.quantity;
        console.log(quantity);

        await cartService.updateQuantityCart(cid, pid, quantity);

        res.status(200).send({
            status:'success',
            message: 'Quantity updated successfully.'
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

//Lo de no añadir su propio producto funciona
//Preguntar si tendria que implementar que el usuario solo pueda agregar productos a su carrito
const addToCart = async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const quantity = req.body;
        console.log('Cart id: ', cid);
        console.log('Product id: ', pid);
        const email = req.user.user.email;
        let addToCartPermission = true;

        if (req.user.user.role === "Premium") {
            addToCartPermission = !await checkOwnership(pid, email);//Si el producto fue creado por el no le doy permiso
        }
        console.log('Permiso: ', addToCartPermission);
        if(addToCartPermission){
            await cartService.addToCart(cid, pid, quantity);
            res.status(200).send({
                status:'success',
                message: 'Product successfully added to cart.'
            });
            req.logger.info('Product added to cart.');
        }else{
            res.status(403).send({
                status: 'error',
                message: 'You cannot add your own product to cart.'
            });
            req.logger.info('Permission denied.');
        }
    }catch (error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
    
}

const deleteCart = async (req, res) =>{
    try {
        const { cid } = req.params;
        await cartService.deleteCart(cid);
        res.status(200).send({
            status: 'success',
            message: 'Cart successfully deleted.'
        });
    } catch (error) {
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
    
}

const deleteProdFromCart = async (req, res) =>{
    try {
        const { cid, pid } = req.params;
        await cartService.deleteProdFromCart(cid, pid);
        res.status(200).send({
            status: 'success',
            message: 'Product successfully deleted from cart.'
        });
    } catch (error) {
        req.logger.warning('Error deleting product from cart.');
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

const purchaseCart = async (req, res) =>{
    const usuario = req.user;
    console.log("El usuario es", usuario);
    try {
        const purchaser = req.user.user.email;
        console.log('Email: ', purchaser);
        const cid = req.params.cid;
        const uid = req.user.user._id;
        console.log(`Initializing cart purchase with id ${cid}.`);
        console.log(`User id from session: ${uid}.`);

        const user = await userService.getUser(uid);

        // Verifico que el carrito pertenezca al user
        if(user.cart.toString() != cid){
            req.logger.error('Permission denied.');
            return res.status(401).send({
                status: 'error',
                message: 'You don`t have permission to purchase in this cart.'
            });
        }

        console.log("Usuario despues: ", user);

        const cart = await cartService.getCartById(cid);

        console.log("Prod.product._id ", cart.products);
        // Verifico que el carrito no este vacio
        if(cart.products.length === 0){
            req.logger.error('Empty cart.');
            return res.status(400).send({
                status: 'error',
                message: 'Empty cart, you have to add products before purchasing.'
            });
        }

        // Elimino productos que no tienen suficiente stock
        let notProcessedProd = [];
        let processedProd = [];
        let total = 0;
        for(let prod of cart.products){
            const product = await productService.getProductById(prod.productId._id);// Obtengo el producto asi puedo ver el stock de este
            // Ahora chequeo que el quantity del cart sea menor o igual al stock del producto
            if(prod.quantity > product.stock){
                notProcessedProd.push(prod);
                //await cartService.deleteProdFromCart(cid, product._id);
                console.log(`Product ${product._id} not processed due to lack of stock.`);
            }else{// Mientras voy calculando el total de los productos que no voy procesando, actualizando stock y eliminando los procesados
                total += prod.productId.price * prod.quantity;
                await productService.updateProduct(prod.productId._id, { stock: prod.productId.stock - prod.quantity });
                processedProd.push(prod);
                await cartService.deleteProdFromCart(cid, product._id);
            }
        }


        // Creo el ticket
        const ticket = await ticketService.createTicket({ purchaser: purchaser, amount: total, products: processedProd });
        console.log("Purchaser: ", purchaser, "Total: ", total, "Productos procesados: ", processedProd);
        console.log('New ticket: ', ticket);

        res.status(200).send({
            status: 'success',
            payload: { ticket, notProcessedProd }
        })

    } catch (error) {
        req.logger.error('Error trying to purchase cart.');
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
}

export default {
    createCart,
    getCarts,
    getCartById,
    updateQuantityCart,
    addToCart,
    deleteCart,
    deleteProdFromCart,
    purchaseCart
};