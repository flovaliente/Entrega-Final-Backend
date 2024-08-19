import passport from "passport";
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import jwt, { ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import cartService from "../services/cartService.js";
import userService from "../services/userService.js";
import userModel from "../dao/models/userModel.js";
import CartRepository from "../dao/repositories/CartRepository.js";
import UserRepository from "../dao/repositories/UserRepository.js";

dotenv.config();

const cartRepository = new CartRepository();
const userRepository = new UserRepository();

const localStratergy = local.Strategy;
const jwtStratergy = jwt.Strategy;

const cookieExtractor = (req) =>{
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.accessToken ?? null;
    }
    return token;
};
/*const headerExtractor = (req) => {
    let token = null;
    if (req && req.headers){
        token = req.headers.accessToken ?? null;
    }
    return token;
};*/

const initializatePassport = () => { 
    const CLIENT_ID = process.env.CLIENT_ID;
    const SECRET_ID = process.env.SECRET_ID;
    const secretKey = process.env.SECRET_KEY;

    passport.use('jwt', new jwtStratergy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: secretKey
        },
        async(jwt_payload, done) =>{
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    )); 

    

    passport.use('github', new GitHubStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/users/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) =>{
            try {
                const email = profile._json.email || profile.profileUrl; // Por si email es null
                console.log(profile);

                const user = await userModel.findOne({ email: profile._json.email });

                if(!user){
                    let newUser = {
                        id: profile.id,
                        username: profile._json.login,
                        firstName: profile._json.name,
                        lastName: '',
                        age: 18,
                        password: '1234',
                        email: email,
                        role: "Usuario"
                    }

                    const registeredUser = await userRepository.registerUser(newUser); //Registro el nuevo user
                    const cart = await cartRepository.createCart(registeredUser._id); //Le creo un nuevo cart
                    const result = await userRepository.createUserCart(registeredUser._id, cart._id); //Agrego el cart al usuario
                    
                    done(null, result);
                }else{
                    done(null, user);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userRepository.findUserByEmail(username);
                if(user){
                    console.log("User already exist!");
                    return done(null, false);
                }

                // Creo nuevo cart para el user
                const cart = await cartService.createCart();
                const result = await userService.registerUser({
                    first_name,
                    last_name,
                    email,
                    password,
                    cart: cart._id
                });
                return done(null, result);
            } catch (error) {
                return done(error.message);
            }
        }
    ));


    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializatePassport;