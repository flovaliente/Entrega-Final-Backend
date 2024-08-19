import express from 'express';//
import path from 'path';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';//
import session from 'express-session';//
import mongoStore from 'connect-mongo';//
import passport from 'passport';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import productsRouter from './routers/productsRouter.js';
import cartRouter from './routers/cartRouter.js';//
import indexRouter from './routers/indexRouter.js';//
import chatRouter from './routers/messageRouter.js';//
import userRouter from './routers/userRouter.js';//
import ticketRouter from './routers/ticketRouter.js';
import initializatePassport from './config/passportConfig.js';
import  __dirname  from './utils/constUtil.js';
import { addLogger } from './utils/logger.js';

dotenv.config();


const app = express();

//MongoDB connect
const URI = process.env.URI;
mongoose.connect(URI);

//Middlewares
app.use(express.json());//
app.use(express.static('public'));//
app.use(express.urlencoded({ extended: true }));//
app.use("/js", express.static(__dirname + "/path/to/js"));
app.use(cookieParser());

//Use express-session before passport
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: URI,
      ttl: 20,
    }),
    secret: "secretPhrase",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
initializatePassport();
app.use(passport.initialize());
app.use(passport.session());

//Logger
app.use(addLogger);

// Configurar Handlebars con el helper
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  helpers: {
      ifCond: function (v1, v2, options) {
          if (v1 === v2) {
              return options.fn(this);
          }
          return options.inverse(this);
      }
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));

//Handlebars config
//app.engine('handlebars', handlebars.engine());//
app.set('views', __dirname + "/../views");//
app.set('view engine', 'handlebars');//


//Routers
app.use('/', indexRouter);//
app.use('/api/users', userRouter);//
app.get('/realTimeProducts', indexRouter);
app.use('/api/products', productsRouter);//
app.use('/api/carts', cartRouter);//
app.use('/api/message', chatRouter);//
app.use('/api/ticket', ticketRouter);

//Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "VALSAA",
      version: "1.0.0",
      description: "API for VALSAA Store",
    },
  },
  apis: [`${__dirname}/../docs/**/*.yaml`],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

/*app.use((error, req, res, next) => {
  const message = `Ocurrio un error: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});*/

export default app;