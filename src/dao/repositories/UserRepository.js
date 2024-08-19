import { isValidPassword } from '../../utils/functionsUtils.js';
import UserDao from "../userDAO.js";


class UserRepository{
    constructor(){
        this.userDao = new UserDao();
    }

    async getAllUsers(){
        try {
            return await this.userDao.getAllUsers();
        } catch (error) {
            console.error('Error trying to get all users from UserRepository.');
            throw new Error('Error finding users.');
        }
    }

    async getUser(uid){
        try {
            return await this.userDao.getUser(uid);
        } catch (error) {
            console.error('Error trying to get user from UserRepository.');
            throw new Error('Error finding user.');
        }
    }

    async createUser(user){
        try {
            return await this.userDao.createUser(user);
        } catch (error) {
            console.error('Error creating user in UserRepository.');
            throw new Error('Error creating user.');
        }
    }

    async createUserCart(uid, cid){
        try {
            const result = await this.userDao.findUserByIdAndUpdate(uid, cid);
            console.log("User desde service: ", result);
            return result;
        } catch (error) {
            console.error(error.message);
        }
    }

    async registerUser(user){
        try {
            console.log('Cart: ', user.cart);
            const result = await this.userDao.createUser(user);
            console.log("Usuario en repository: ", result);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Registration error.`);
        }
    }


    async findUserByEmail(email) {
        try {
            const result = await this.userDao.findUserByEmail(email);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    async findUserByToken(token){
        try {
            return await this.userDao.findUserByToken(token);
        } catch (error) {
            console.error(error);
        }
    }

    async switchRole(uid, newRole){
        try {
            return await this.userDao.switchRole(uid, newRole);
        } catch (error) {
            console.error(error);
        }
    }

    async updatePassword(uid, newPassword){
        try {
            return await this.userDao.updatePassword(uid, newPassword);
        } catch (error) {
            console.error(error);
        }
    }

    async updateLastConnection(email){
        try {
            return await this.userDao.updateLastConnection(email);
        } catch (error) {
            console.error(error);
        }
    }

    async updateAddress(uid, address){
        try {
            return await this.userDao.updateAddress(uid, address);
        } catch (error) {
            console.error(error);
        }
    }

    async updateUserDocuments(uid, documents){
        try {
            return await this.userDao.updateUserDocuments(uid, documents);
        } catch (error) {
            console.error(error);
        }
    }

    async searchInactiveUsers(inactivityLimit){
        try {
            return await this.userDao.searchInactiveUsers(inactivityLimit);
        } catch (error) {
            console.error(error);
        }
    }

    async deleteUsersAndCarts(inactiveUsers){
        try {
            return await this.userDao.deleteUsersAndCarts(inactiveUsers);
        } catch (error) {
            console.error(error);
        }
    }
}

export default UserRepository;