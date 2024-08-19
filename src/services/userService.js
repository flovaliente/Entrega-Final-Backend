import UserRepository from "../dao/repositories/UserRepository.js";
import CartRepository from "../dao/repositories/CartRepository.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import { generateToken } from "../utils/utils.js";
import { transport } from "../utils/mailUtil.js"; 

const userManager = new UserRepository();
const cartManager = new CartRepository();

const getUsers = async () =>{
    try {
        return await userManager.getAllUsers();
    } catch (error) {
        console.error("Error trying to get all users: ", error.message);
        throw new Error('Error trying to get all users');
    }
    
}

const registerUser = async (user) =>{
    try {
            if((user.email == 'adminCoder@coder.com')  && (user.password == "admin")){
                user.role = "Admin";
                const result = await userManager.createUser(user);
                console.log('Usuario dentro: ', result);
                //result.role = 'Admin';
                //result.save();
                return result;
            }
            // Creo nuevo cart para el user
            const cart = await cartManager.createCart();
            console.log("User en service: ", user);
            console.log("Cart en service: ", cart);
            const result = await userManager.registerUser({
                ...user,
                cart: cart._id
            });
            
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Registration error.`);
        }
}

const loginUser = async (email, password) =>{
    try {
        
        const user = await userManager.findUserByEmail(email);
        if(!user || !isValidPassword(user, password)){
            throw new Error('Invalid credentials');
        }

        const accessToken = generateToken(user);
        return accessToken;
    } catch (error) {
        console.error("Login error: ", error.message);
        throw new Error('Login error');
    }
    
}

const getUser = async (uid) =>{
    try {
        return await userManager.getUser(uid);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to get user.');
    }
    
}

const findUserByEmail = async (email) =>{
    try {
        return await userManager.findUserByEmail(email);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to get user.');
    }
    
}

const findUserByToken = async (token) =>{
    try {
        return await userManager.findUserByToken(token);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to get user.');
    } 
}

const switchRole = async (uid, newRole) =>{
    try {
        const user = await userManager.switchRole(uid, newRole);
        return generateToken(user); //Ya retorno el token asi lo guardo en la cookie en el controller
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to switch user role.');
    }
}

const sendRecoveryEmail = async (email) =>{
    try {
        const user = await userManager.findUserByEmail(email);
        if (!user){
            throw new Error('Unregistered user.');
        }

        //Genero token de 1h
        const token = generateToken(user.email);
        console.log('Token: ', token);
        const mail = {
            from: "Valsaa <flovaliente143@gmail.com>",
            to: email,
            subjet: "Password recovery",
            html: `
                <h1>VALSAA</h1>
                <h2>Password recovery</h2>
                <p><b>If you have not requested this email, ignore it.</b></p>
                <p>To reset your password, click the following link:</p>
                <a href="http://localhost:8080/recover/${token}">Reset</a>
            `
        };
        return await transport.sendMail(mail);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error trying to send recovery password email.');
    }
}

const sendInactivityEmail = async (email) =>{
    try {
        const user = await userManager.findUserByEmail(email);
        if (!user){
            throw new Error('Unregistered user.');
        }

        const mail = {
            from: "Valsaa <flovaliente143@gmail.com>",
            to: email,
            subjet: "Cuenta eliminada",
            html: `
                <h1>VALSAA</h1>
                <p><b>Usuario inactivo</b></p>
                <p>${user.firstName} hemos eliminado tu cuenta en VALSAA por inactividad</p>
            `
        };
        return await transport.sendMail(mail);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error sending mail to inactive users.');
    }
}

const sendDeletionEmail = async (email, pid) =>{
    try {
        const user = await userManager.findUserByEmail(email);
        if (!user){
            throw new Error('Unregistered user.');
        }

        const mail = {
            from: "Valsaa <flovaliente143@gmail.com>",
            to: email,
            subjet: "Cuenta eliminada",
            html: `
                <h1>VALSAA</h1>
                <p><b>Usuario inactivo</b></p>
                <p>${user.firstName} hemos eliminado tu producto con id: ${pid}</p>
            `
        };
        return await transport.sendMail(mail);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error sending mail to inactive users.');
    }
}

const updatePassword = async (uid, newPassword) =>{
    try {
        await userManager.updatePassword(uid, newPassword);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while updating password.');
    }
}

const updateLastConnection = async (email) =>{
    try {
        return await userManager.updateLastConnection(email);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while updating user last connection.');
    }
}

const updateAddress = async (uid, address) =>{
    try {
        return await userManager.updateAddress(uid, address);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while updating user address.');
    }
}

const updateUserDocuments = async (uid, documents) =>{
    try {
        return await userManager.updateUserDocuments(uid, documents);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while updating user documents.');
    }
}

const searchInactiveUsers = async (inactivityLimit) =>{
    try {
        return await userManager.searchInactiveUsers(inactivityLimit);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error while searching inactive users.');
    }
}

const deleteUsersAndCarts = async (inactiveUsers) =>{
    try {
        return await userManager.deleteUsersAndCarts(inactiveUsers);
    } catch (error) {
        console.error(error.message);
        throw new Error('Error deleting inactive users.');
    }
}

export default {
    getUsers,
    registerUser,
    loginUser,
    getUser,
    switchRole,
    sendRecoveryEmail,
    sendInactivityEmail,
    sendDeletionEmail,
    findUserByEmail,
    findUserByToken,
    updatePassword,
    updateLastConnection,
    updateAddress,
    updateUserDocuments,
    searchInactiveUsers,
    deleteUsersAndCarts
};