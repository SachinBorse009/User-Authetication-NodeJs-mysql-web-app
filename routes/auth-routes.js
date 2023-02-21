import express from 'express';
import authController from '../controller/auth.controller.js';
import limiter from 'express-rate-limit'
const router = express.Router();

//register api route
router.post('/register',authController.userRegister);

//login limiter
const loginLimit = limiter({
    windowMs: 24 * 60 * 60 * 1000, //24 hours
    max:4,  
    message:"User account has been blocked for 24 hours"
})

//login api route 
router.post('/login',loginLimit, authController.userLogin);

// //logout api route
router.get('/logout',authController.logout);



export default router;





