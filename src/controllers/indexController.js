import productService from "../services/productService.js";
import cartService from "../services/cartService.js";
import { generateProducts } from "../utils/fakerUtil.js";
import userService from "../services/userService.js";
import { transport } from "../utils/mailUtil.js";
import { isValidPassword } from "../utils/functionsUtils.js";

const welcome = async (req, res) => {
    try {
      res.render("welcome", { title: "Welcome | Valsaa", style: "home.css" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
    
}

const register = async (req, res) => {
    try {
      res.render("register", {
        title: "Register | Valsaa",
        style: "login.css",
        failRegister: req.session.failRegister ?? false,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
    
}

const products = async (req, res) => {
    try {
      const cart = req.user.user.cart;
      console.log('Este es el cart: ', cart);
      const { page = 1, limit = 10, category, query, sort } = req.query;
      
      let products = await productService.getProducts(page, limit, category, query, sort);
      console.log("Aca los productos: ", products);

      res.render("products", { 
        title: "Products | Valsaa", 
        style: "product.css", 
        products: products,
        cid: req.user.user.cart,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.nextPage,
        prevLink: products.hasPrevPage ? `http://localhost:8080/products?limit=${products.limit}&page=${products.prevPage}${products.category ? `&category=${products.category}` : ""}${products.stock ? `&stock=${products.stock}` : ""}` : "",
        nextLink: products.hasNextPage ? `http://localhost:8080/products?limit=${products.limit}&page=${products.nextPage}${products.category ? `&category=${products.category}` : ""}${products.stock ? `&stock=${products.stock}` : ""}` : ""
       });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
    
}

const cart = async (req, res) =>{
    try {
      let total = 0;
      const cid = req.user.user.cart;
      //console.log('Cart id: ', cid);
      const cart = await cartService.getCartById(cid);

      for(let prod of cart.products){
        total += prod.productId.price * prod.quantity;
      }

      res.render("cart", {
        title: "Cart | Valsaa",
        cart: cart,
        user: req.user.user,
        totalPrice: total,
        style: "cart.css"
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
}

const datosEnvio = async (req, res) =>{
  try {
    let total = 0;
    const cid = req.user.user.cart;
    //console.log('Cart id: ', cid);
    const cart = await cartService.getCartById(cid);

    for(let prod of cart.products){
      total += prod.productId.price * prod.quantity;
    }
    res.render("datosEnvio", {
      title: "Datos de envío | Valsaa",
      cart: cart,
      user: req.user.user,
      totalPrice: total,
      style: "cart.css"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
}

const formaDePago = async (req, res) =>{
  try {
    let total = 0;
    const cid = req.user.user.cart;
    //console.log('Cart id: ', cid);
    const cart = await cartService.getCartById(cid);

    for(let prod of cart.products){
      total += prod.productId.price * prod.quantity;
    }
    res.render("formaDePago", {
      title: "Formas de pago | Valsaa",
      cart: cart,
      user: req.user.user,
      totalPrice: total,
      style: "cart.css"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
}

const realtimeproducts = async (req, res) => {
    try {
      let products = await productService.getProducts();
      //products = products.map((p) => p.toJSON());
      res.render("home", { title: "RealTime-Products ", style: "RTP.css", products });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
    
}

const login = async (req, res) => {
    try {
      if(req.cookies.accessToken){
        res.redirect("/products");
      }else{
        res.render("login", {
          title: "Valsaa | Login",
          style: "login.css",
          failLogin: req.session.failLogin ?? false,
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Error.');
    }
    
}

const user = async(req, res) => {
  try {
    res.render('user', {
      title: "Valsaa | User",
      style: "user.css",
      user: req.user.user
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
}

const mockingproducts = async(req, res) => {
  try {
    const limit = 10;
    const currentPage = parseInt(req.query.page) || 1;
    const totalProducts = 100;
    const totalPages = Math.ceil(totalProducts / limit);
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalProducts);
    const currentProd = generateProducts().slice(startIndex, endIndex);
    console.log(req.query.page)

    res.render('mockingProducts', {
      title: "Valsaa | Mocking Products",
      style: "product.css",
      products: currentProd,
      prevPage,
      nextPage,
      pages
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
  
}

const loggertest = (req, res) => {
  req.logger.fatal("Logger test fatal message");
  req.logger.error("Logger test error message");
  req.logger.warning("Logger test warning message");
  req.logger.info("Logger test info message");
  req.logger.http("Logger test http message");
  req.logger.debug("Logger test debug message");

  res.send("Logger test completed!");
}

const unauthorized = async(req, res) => {
  res.status(401).render('unauthorized', {
    title: "Unhautorized",
    style: "product.css"
  });
}

const sendEmail = async (req, res) => {
  try {
    const result = await transport.sendMail({
      from: "Valsaa <flovaliente143@gmail.com>",
      to: "florcody@hotmail.com",
      subject: "Correo de prueba",
      html: `<div>
                <h1>Welcome!</h1>
                <p>We are testing!</p>
              </div>`,
    });

    res.send({ status: "success", result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ status: "error", message: "Error sending email." });
  }
};

const recoverPasswordRequest = async(req, res) => {
  res.render('recoverPassword', {
    title: "Valsaa | Recover Password",
    style: "recoverPass.css"
  });
}

const recoverPassword = async(req, res) => {
  const  email = "flovaliente143@gmail.com";
  try {
    console.log('Email: ', email);
    const result = await userService.sendRecoveryEmail(email);
    res.send({
      status: 'success',
      result
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
}

const recoverToken = async (req, res) => {
  const { token } = req.params;
  try {
    console.log('Token en recoveryToken: ', token);
    const user = await userService.findUserByToken(token);
    console.log('User el recoveryToken: ', user);
    if(!user){
      return res.status(404).render('recoverPassword', { error: 'Invalid token' });
    }
    res.render('changePassword', {
      title: 'Valsaa | Change password',
      style: 'recoverPass.css',
      token
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).render('recoverPassword', { error: "Error en recoverToken: " + error.message });
  }
}

const changePassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    console.log("Token en changePassword: ", token);
    console.log("Password en changePassword: ", password);

    const user = await userService.findUserByToken(token);

    if(isValidPassword(user, password)){
      res.status(409).send({
        status: 'error',
        message: 'New password cannot be the same as the old one.'
      });
    };
    
    await userService.updatePassword(user._id, password);
    res.status(200).send({
      status: 'success',
      message: 'Password changed successfully!'
    });
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send({
      status: 'error',
      message: "Errir en changePassword: " + error.message
    });
  }
}


const adminPanel = async (req, res) => {
  try {
    let users = await userService.getUsers();
    users = users.filter(user => user.role === 'User' || user.role === 'Premium');
    console.log(users);
    res.render('adminPanel', {
      title: 'Admin Panel | Valsaa',
      style: 'admin.css',
      users: users
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error.');
  }
}
export default {
    welcome,
    register,
    products,
    cart,
    datosEnvio,
    formaDePago,
    realtimeproducts,
    login,
    user,
    mockingproducts,
    loggertest,
    unauthorized,
    sendEmail,
    recoverPasswordRequest,
    recoverPassword,
    recoverToken,
    changePassword,
    adminPanel
};