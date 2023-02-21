import express  from "express";
import dbConfig from "./config/db-config.js";
import router from "./routes/auth-routes.js";
import pagesRouter from "./routes/pages.routes.js";
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import flash from 'connect-flash'
import session from "express-session";
import dotenv from 'dotenv'
import morgan from 'morgan'
dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();


app.use(express.json());      
app.use(express.urlencoded({extended:false}));   
app.use(morgan('dev'))
app.use(session({            //here i use this package for to flash the messages
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly:true
    }
}));
app.use(flash()); //flash the error messages
app.use(cookieParser());

app.use(express.static('public')) // for static file
app.set('view engine','ejs');     //ejs view template
app.set('views', './views')  //to set views folder



app.use('/api/users',router); //this is root route of api 
app.use("/", pagesRouter);  //this is server-side rendering route

app.get('/', (req,res) => {
    res.json("Backend server") //testing
})


app.use(async(req,res,next) => {    // global errors handling.
    next(createError.NotFound()) 
})

app.use((error,req,res,next) => {
    res.status(error.status || 500)  //500 for internal server error
    res.send({
        error: {
            status:error.status || 500,
            message: error.message
        }
    });
});


//server running 
app.listen(PORT, () => {
    console.log(`🚀 server is running on ${PORT}`);
});




