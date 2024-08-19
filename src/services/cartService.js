import CartRepository from "../dao/repositories/CartRepository.js";

const cartManager = new CartRepository();

const createCart = async () =>{
    try {
        return await cartManager.createCart();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCarts = async () =>{
    try {
        return await cartManager.getCarts();
    } catch (error) {
        throw new Error(error.message);
    }
}

const getCartById = async (cid) =>{
    try {
        return await cartManager.getCartById(cid, true);
    } catch (error) {
        throw new Error(error.message);
    }
}

const updateQuantityCart = async (cid, pid, quantity) =>{
    try {
        await cartManager.updateQuantityCart(cid, pid, quantity);
    } catch (error) {
        throw new Error(error.message);
    }
}
const addToCart = async (cid, pid, quantity) =>{
    try {
        await cartManager.addToCart(cid, pid, quantity);
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteCart = async (cid) =>{
    try {
        await cartManager.deleteCart(cid);
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteProdFromCart = async (cid, pid) =>{
    try {
        await cartManager.deleteProdFromCart(cid, pid);
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    createCart,
    getCarts,
    getCartById,
    updateQuantityCart,
    addToCart,
    deleteCart,
    deleteProdFromCart
};