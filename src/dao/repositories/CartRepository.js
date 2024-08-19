//import cartModel from '../models/cartModel.js';
//import productModel from '../models/productModel.js';
import CartDao from "../cartDAO.js";

class CartRepository {
    constructor(){
        this.cartDao = new CartDao();
    }
    
    async createCart(){
        try {
            let result = await this.cartDao.createCart();
            console.log(`Cart created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating cart.`);
        }
    }

    async addToCart(cid, pid, quantity = 1){
        try {
            console.log('Quantity: ', quantity);
            const qty = quantity.quantity ? quantity.quantity : quantity; //Para controlar cuando llamo a la funcion por fetch que me devuelve un objeto con la propiedad quantity
            const cart = await this.cartDao.findCartById(cid, false);//Obtengo el carrito con id cid
            if(!cart){
                throw new Error(`Cart with id: ${cid} do not exist.`);
            }
            //console.log('Cart:', cart);
            const productFind = cart.products.find( (cartProduct) => String(cartProduct.productId) === String(pid) );
            if(productFind){//Chequeo que exista o no el producto en el carrito
                productFind.quantity += qty; //Si el producto existe en el carrito, le incremento la cantidad quantity
            }else{
                cart.products.push( { productId: pid, quantity: qty }); //Si no existe, lo agrego con la cantidad quantity
            }
            await cart.save(); //Guardo el carrito
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to add product to cart.`);
        }
        
    }

    async getCarts(){
        try {
            return await this.cartDao.getCarts(); //con populate me va a traer toda la info del producto
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find carts.`);
        }
    }

    async getCartById(cid){
        try {
            return await this.cartDao.findCartById(cid, true);
        } catch (error) {
            console.error(error.message);
            throw new Error(`Cart with id: ${cid} do not exist.`);
        }
        
    }

    async updateQuantityCart(cid, pid, quantity){
        try {
            return this.cartDao.updateQuantityCart(cid, pid, quantity);
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error updating product quantity.`);
        }
    }

    async deleteCart(cid){
        try {
            const result = await this.cartDao.deleteCart(cid);

            if(result.deletedCount === 0){
                throw new Error(`Cart with id: ${cid} do not exist.`);
            }else{
              console.error(`Cart with id: ${cid} deleted successfully.`);  
            }

            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error deleting cart ${cid}.`);
        }
        

    }

    async deleteProdFromCart(cid, pid){
        try {
            return await this.cartDao.deleteProdFromCart(cid, pid);
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error deleting product from cart.`);
        }
    }
}

export default CartRepository;