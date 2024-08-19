import bcrypt from 'bcrypt';

import productService from '../services/productService.js';

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const checkOwnership = async (pid, email) => {
    const product = await productService.getProductById(pid);
    if (!product) return false;
    return product.owner === email;
};