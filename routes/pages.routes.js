import express from 'express';
import authController from '../controller/auth.controller.js';
const pagesRouter = express.Router();

//register page route
pagesRouter.get('/',(req,res) =>{
    res.render("register",{Message: req.flash('message')} )
});

//login page route
pagesRouter.get('/login',(req,res) =>{
    res.render("login", {Message: req.flash('message')})
});


//home page route
pagesRouter.get('/home',authController.isLoggedIn,(req,res) =>{
   if(req.user){
    res.render('home', {user: req.user})
   }else{
       res.redirect("/login"); 
   }
});



export default pagesRouter;
