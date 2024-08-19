import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import userModel from "./models/userModel.js";
import cartModel from "./models/cartModel.js";

const secretKey = process.env.SECRET_KEY;

export default class UserDao{
    createUser = async (user) =>{
        try {
            return await userModel.create(user);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getAllUsers = async () =>{
        try {
            return await userModel.find({}, 'firstName lastName email role');
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    getUser = async (uid) =>{
        try {
            return await userModel.findById(uid);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByIdAndUpdate = async (uid, cid) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { cart: cid });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByEmail = async (email) =>{
        try {
            return await userModel.findOne({ email }).lean();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findUserByToken = async (token) =>{
        try {
            const user = jwt.verify(token, secretKey);
            console.log('User en userDAO: ', user);
            const email = user.user;
            return await userModel.findOne({ email }).lean();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    switchRole = async (uid, newRole) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { role: newRole }, { new: true }); //New para que me devuelva el usuario actualizado
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updatePassword = async (uid, newPassword) =>{
        try {
            const user = await userModel.findByIdAndUpdate(uid, { password: newPassword }, { new: true }); //New para que me devuelva el usuario actualizado
            return user.save();
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateLastConnection = async (email) =>{
        try {
            return await userModel.findOneAndUpdate({ email }, { last_connection: new Date() });
        } catch (error) {
            console.error('Error updating last connection:', error);
            return null;
        }
    }

    updateAddress = async (uid, address) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { address: address });
        } catch (error) {
            console.error('Error updating address:', error);
            return null;
        }
    }

    updateUserDocuments = async (uid, documents) =>{
        try {
            return await userModel.findByIdAndUpdate(uid, { $push: { documents: { $each: documents } } }, { new: true });
        } catch (error) {
            console.error('Error updating documents:', error);
            return null;
        }
    }

    searchInactiveUsers = async (inactivityLimit) =>{
        try {
            return await userModel.find({ last_connection: { $lt: inactivityLimit } });//El $lt significa: less than
        } catch (error) {
            console.error('Error searching inactive users:', error);
            return null;
        }
    }

    deleteUsersAndCarts = async (inactiveUsers) =>{
        try {
            const cartIds = inactiveUsers.map(user => user.cart); 
            console.log('cartIds: ', cartIds);
            console.log('inactive users: ', inactiveUsers);
            await cartModel.deleteMany({ _id: { $in: cartIds } });//Borro los carritos de los usuarios inactivos
            
            const userIds = inactiveUsers.map(user => user._id);
            return await userModel.deleteMany({ _id: { $in: userIds } });//Borro los usuarios inactivos
        } catch (error) {
            console.error('Error deleting inactive users:', error);
            return null;
        }
    }
}