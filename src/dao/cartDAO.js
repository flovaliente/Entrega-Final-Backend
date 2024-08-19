import cartModel from "./models/cartModel.js";

export default class CartDao{
    createCart = async () =>{
        try {
            return await cartModel.create({ products: [] });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getCarts = async () =>{
        try {
            return await cartModel.find().populate('products.productId');
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findCartById = async (cid, populate) =>{
        try {
            let cart;
            if(populate){
                cart = await cartModel.findById(cid).populate("products.productId").lean();
            }else{
                cart = await cartModel.findById(cid);
            }
            return cart;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateQuantityCart = async (cid, pid, quantity) =>{
        try {
            return await cartModel.findOneAndUpdate(
                { _id: cid, "products.productId": pid }, 
                { $set: { "products.$.quantity": quantity }},
                { new: true }
            );
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    deleteCart = async (cid) =>{
        try {
            return await cartModel.deleteOne({ _id: cid });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    deleteProdFromCart = async (cid, pid) =>{
        try {
            return await cartModel.findOneAndUpdate({ _id: cid }, { $pull: { products: { productId: pid } }}, { new: true });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

}